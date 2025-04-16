import { readdirSync } from "node:fs";
import { join } from "node:path";
import { docker } from "@deployit/server/constants";
import {
	execAsync,
	execAsyncRemote,
} from "@deployit/server/utils/process/execAsync";

export interface IUpdateData {
	latestVersion: string | null;
	updateAvailable: boolean;
}

export const DEFAULT_UPDATE_DATA: IUpdateData = {
	latestVersion: null,
	updateAvailable: false,
};

/** Returns current deployit docker image tag or `latest` by default. */
export const getdeployitImageTag = () => {
	return process.env.RELEASE_TAG || "latest";
};

export const getdeployitImage = () => {
	return `deployit/deployit:${getdeployitImageTag()}`;
};

export const pullLatestRelease = async () => {
	const stream = await docker.pull(getdeployitImage());
	await new Promise((resolve, reject) => {
		docker.modem.followProgress(stream, (err, res) =>
			err ? reject(err) : resolve(res),
		);
	});
};

/** Returns deployit docker service image digest */
export const getServiceImageDigest = async () => {
	const { stdout } = await execAsync(
		"docker service inspect deployit --format '{{.Spec.TaskTemplate.ContainerSpec.Image}}'",
	);

	const currentDigest = stdout.trim().split("@")[1];

	if (!currentDigest) {
		throw new Error("Could not get current service image digest");
	}

	return currentDigest;
};

/** Returns latest version number and information whether server update is available by comparing current image's digest against digest for provided image tag via Docker hub API. */
export const getUpdateData = async (): Promise<IUpdateData> => {
	let currentDigest: string;
	try {
		currentDigest = await getServiceImageDigest();
	} catch {
		// Docker service might not exist locally
		// You can run the # Installation command for docker service create mentioned in the below docs to test it locally:
		// https://docs.deployit.com/docs/core/manual-installation
		return DEFAULT_UPDATE_DATA;
	}

	const baseUrl = "https://hub.docker.com/v2/repositories/deployit/deployit/tags";
	let url: string | null = `${baseUrl}?page_size=100`;
	let allResults: { digest: string; name: string }[] = [];
	while (url) {
		const response = await fetch(url, {
			method: "GET",
			headers: { "Content-Type": "application/json" },
		});

		const data = (await response.json()) as {
			next: string | null;
			results: { digest: string; name: string }[];
		};

		allResults = allResults.concat(data.results);
		url = data?.next;
	}

	const imageTag = getdeployitImageTag();
	const searchedDigest = allResults.find((t) => t.name === imageTag)?.digest;

	if (!searchedDigest) {
		return DEFAULT_UPDATE_DATA;
	}

	if (imageTag === "latest") {
		const versionedTag = allResults.find(
			(t) => t.digest === searchedDigest && t.name.startsWith("v"),
		);

		if (!versionedTag) {
			return DEFAULT_UPDATE_DATA;
		}

		const { name: latestVersion, digest } = versionedTag;
		const updateAvailable = digest !== currentDigest;

		return { latestVersion, updateAvailable };
	}
	const updateAvailable = searchedDigest !== currentDigest;
	return { latestVersion: imageTag, updateAvailable };
};

interface TreeDataItem {
	id: string;
	name: string;
	type: "file" | "directory";
	children?: TreeDataItem[];
}

export const readDirectory = async (
	dirPath: string,
	serverId?: string,
): Promise<TreeDataItem[]> => {
	if (serverId) {
		const { stdout } = await execAsyncRemote(
			serverId,
			`
process_items() {
    local parent_dir="$1"
    local __resultvar=$2

    local items_json=""
    local first=true
    for item in "$parent_dir"/*; do
        [ -e "$item" ] || continue
        process_item "$item" item_json
        if [ "$first" = true ]; then
            first=false
            items_json="$item_json"
        else
            items_json="$items_json,$item_json"
        fi
    done

    eval $__resultvar="'[$items_json]'"
}

process_item() {
    local item_path="$1"
    local __resultvar=$2

    local item_name=$(basename "$item_path")
    local escaped_name=$(echo "$item_name" | sed 's/"/\\"/g')
    local escaped_path=$(echo "$item_path" | sed 's/"/\\"/g')

    if [ -d "$item_path" ]; then
        # Is directory
        process_items "$item_path" children_json
        local json='{"id":"'"$escaped_path"'","name":"'"$escaped_name"'","type":"directory","children":'"$children_json"'}'
    else
        # Is file
        local json='{"id":"'"$escaped_path"'","name":"'"$escaped_name"'","type":"file"}'
    fi

    eval $__resultvar="'$json'"
}

root_dir=${dirPath}

process_items "$root_dir" json_output

echo "$json_output"
			`,
		);
		const result = JSON.parse(stdout);
		return result;
	}

	const stack = [dirPath];
	const result: TreeDataItem[] = [];
	const parentMap: Record<string, TreeDataItem[]> = {};

	while (stack.length > 0) {
		const currentPath = stack.pop();
		if (!currentPath) continue;

		const items = readdirSync(currentPath, { withFileTypes: true });
		const currentDirectoryResult: TreeDataItem[] = [];

		for (const item of items) {
			const fullPath = join(currentPath, item.name);
			if (item.isDirectory()) {
				stack.push(fullPath);
				const directoryItem: TreeDataItem = {
					id: fullPath,
					name: item.name,
					type: "directory",
					children: [],
				};
				currentDirectoryResult.push(directoryItem);
				parentMap[fullPath] = directoryItem.children as TreeDataItem[];
			} else {
				const fileItem: TreeDataItem = {
					id: fullPath,
					name: item.name,
					type: "file",
				};
				currentDirectoryResult.push(fileItem);
			}
		}

		if (parentMap[currentPath]) {
			parentMap[currentPath].push(...currentDirectoryResult);
		} else {
			result.push(...currentDirectoryResult);
		}
	}
	return result;
};

export const cleanupFullDocker = async (serverId?: string | null) => {
	const cleanupImages = "docker image prune --force";
	const cleanupVolumes = "docker volume prune --force";
	const cleanupContainers = "docker container prune --force";
	const cleanupSystem = "docker system prune  --force --volumes";
	const cleanupBuilder = "docker builder prune  --force";

	try {
		if (serverId) {
			await execAsyncRemote(
				serverId,
				`
	${cleanupImages}
	${cleanupVolumes}
	${cleanupContainers}
	${cleanupSystem}
	${cleanupBuilder}
			`,
			);
		}
		await execAsync(`
			${cleanupImages}
			${cleanupVolumes}
			${cleanupContainers}
			${cleanupSystem}
			${cleanupBuilder}
					`);
	} catch (error) {
		console.log(error);
	}
};
