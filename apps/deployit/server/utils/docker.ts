/* eslint-disable @typescript-eslint/no-unused-vars */
import { execAsync } from "../../../../packages/server/src/index";


export const isWSL = async () => {
	try {
		const { stdout } = await execAsync("uname -r");
		const isWSL = stdout.includes("microsoft");
		return isWSL;
	} catch (_error) {
		return false;
	}
};


export const getDockerHost = async (): Promise<string> => {
	if (process.env.NODE_ENV === "production") {
		if (process.platform === "linux" && !(await isWSL())) {
			try {
				
				const { stdout } = await execAsync(
					"ip route | awk '/default/ {print $3}'",
				);

				const hostIp = stdout.trim();
				if (!hostIp) {
					throw new Error("Failed to get Docker host IP");
				}

				return hostIp;
			} catch (error) {
				console.error("Failed to get Docker host IP:", error);
				return "172.17.0.1"; 
			}
		}

		return "host.docker.internal";
	}

	return "localhost";
};
