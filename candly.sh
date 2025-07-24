#!/bin/bash
install_deployi() {
    if [ "$(id -u)" != "0" ]; then
        echo "This script must be run as root" >&2
        exit 1
    fi

    # check if is Mac OS
    if [ "$(uname)" = "Darwin" ]; then
        echo "This script must be run on Linux" >&2
        exit 1
    fi

    # check if is running inside a container
    if [ -f /.dockerenv ]; then
        echo "This script must be run on Linux" >&2
        exit 1
    fi

    # check if something is running on port 80
    if ss -tulnp | grep ':80 ' >/dev/null; then
        echo "Error: something is already running on port 80" >&2
        exit 1
    fi

    # check if something is running on port 443
    if ss -tulnp | grep ':443 ' >/dev/null; then
        echo "Error: something is already running on port 443" >&2
        exit 1
    fi

    command_exists() {
      command -v "$@" > /dev/null 2>&1
    }

    if command_exists docker; then
      echo "Docker already installed"
    else
      curl -sSL https://get.docker.com | sh
    fi

    docker swarm leave --force 2>/dev/null

    get_ip() {
        local ip=""
        
        # Try IPv4 first
        # First attempt: ifconfig.io
        ip=$(curl -4s --connect-timeout 5 https://ifconfig.io 2>/dev/null)
        
        # Second attempt: icanhazip.com
        if [ -z "$ip" ]; then
            ip=$(curl -4s --connect-timeout 5 https://icanhazip.com 2>/dev/null)
        fi
        
        # Third attempt: ipecho.net
        if [ -z "$ip" ]; then
            ip=$(curl -4s --connect-timeout 5 https://ipecho.net/plain 2>/dev/null)
        fi

        # If no IPv4, try IPv6
        if [ -z "$ip" ]; then
            # Try IPv6 with ifconfig.io
            ip=$(curl -6s --connect-timeout 5 https://ifconfig.io 2>/dev/null)
            
            # Try IPv6 with icanhazip.com
            if [ -z "$ip" ]; then
                ip=$(curl -6s --connect-timeout 5 https://icanhazip.com 2>/dev/null)
            fi
            
            # Try IPv6 with ipecho.net
            if [ -z "$ip" ]; then
                ip=$(curl -6s --connect-timeout 5 https://ipecho.net/plain 2>/dev/null)
            fi
        fi

        if [ -z "$ip" ]; then
            echo "Error: Could not determine server IP address automatically (neither IPv4 nor IPv6)." >&2
            echo "Please set the ADVERTISE_ADDR environment variable manually." >&2
            echo "Example: export ADVERTISE_ADDR=<your-server-ip>" >&2
            exit 1
        fi

        echo "$ip"
    }

    get_private_ip() {
        ip addr show | grep -E "inet (192\.168\.|10\.|172\.1[6-9]\.|172\.2[0-9]\.|172\.3[0-1]\.)" | head -n1 | awk '{print $2}' | cut -d/ -f1
    }

    advertise_addr="${ADVERTISE_ADDR:-$(get_private_ip)}"

    if [ -z "$advertise_addr" ]; then
        echo "ERROR: We couldn't find a private IP address."
        echo "Please set the ADVERTISE_ADDR environment variable manually."
        echo "Example: export ADVERTISE_ADDR=192.168.1.100"
        exit 1
    fi
    echo "Using advertise address: $advertise_addr"

    docker swarm init --advertise-addr $advertise_addr
    
     if [ $? -ne 0 ]; then
        echo "Error: Failed to initialize Docker Swarm" >&2
        exit 1
    fi

    echo "Swarm initialized"

    docker network rm -f deployi-network 2>/dev/null
    docker network create --driver overlay --attachable deployi-network

    echo "Network created"

    mkdir -p /etc/deployi

    chmod 777 /etc/deployi

    docker service create \
    --name deployi-postgres \
    --constraint 'node.role==manager' \
    --network deployi-network \
    --env POSTGRES_USER=deployi \
    --env POSTGRES_DB=deployi \
    --env POSTGRES_PASSWORD=ezeslucky \
    --mount type=volume,source=deployi-postgres-database,target=/var/lib/postgresql/data \
    postgres:16

    docker service create \
    --name deployi-redis \
    --constraint 'node.role==manager' \
    --network deployi-network \
    --mount type=volume,source=redis-data-volume,target=/data \
    redis:7

    # Installation
    docker service create \
    --name deployi \
    --replicas 1 \
    --network deployi-network \
    --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    --mount type=bind,source=/etc/deployi,target=/etc/deployi \
    --mount type=volume,source=deployi-docker-config,target=/root/.docker \
    --publish published=3000,target=3000,mode=host \
    --update-parallelism 1 \
    --update-order stop-first \
    --constraint 'node.role == manager' \
    -e RELEASE_TAG=candly \
    -e ADVERTISE_ADDR=$advertise_addr \
    deployi:deployi:candly

    sleep 4

    docker run -d \
    --name deployi-traefik \
    --restart always \
    -v /etc/deployi/traefik/traefik.yml:/etc/traefik/traefik.yml \
    -v /etc/deployi/traefik/dynamic:/etc/deployi/traefik/dynamic \
    -v /var/run/docker.sock:/var/run/docker.sock \
    -p 80:80/tcp \
    -p 443:443/tcp \
    -p 443:443/udp \
    traefik:v3.1.2

    docker network connect deployi-network deployi-traefik

    # Optional: Use docker service create instead of docker run
    #   docker service create \
    #     --name deployi-traefik \
    #     --constraint 'node.role==manager' \
    #     --network deployi-network \
    #     --mount type=bind,source=/etc/deployi/traefik/traefik.yml,target=/etc/traefik/traefik.yml \
    #     --mount type=bind,source=/etc/deployi/traefik/dynamic,target=/etc/deployi/traefik/dynamic \
    #     --mount type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
    #     --publish mode=host,published=443,target=443 \
    #     --publish mode=host,published=80,target=80 \
    #     --publish mode=host,published=443,target=443,protocol=udp \
    #     traefik:v3.1.2

    GREEN="\033[0;32m"
    YELLOW="\033[1;33m"
    BLUE="\033[0;34m"
    NC="\033[0m" # No Color

    format_ip_for_url() {
        local ip="$1"
        if echo "$ip" | grep -q ':'; then
            # IPv6
            echo "[${ip}]"
        else
            # IPv4
            echo "${ip}"
        fi
    }

    public_ip="${ADVERTISE_ADDR:-$(get_ip)}"
    formatted_addr=$(format_ip_for_url "$public_ip")
    echo ""
    printf "${GREEN}Congratulations, Deployi is installed!${NC}\n"
    printf "${BLUE}Wait 15 seconds for the server to start${NC}\n"
    printf "${YELLOW}Please go to http://${formatted_addr}:3000${NC}\n\n"
}

update_deployi() {
    echo "Updating Deployi..."
    
    # Pull the latest candly image
    docker pull deployi/deployi:candly

    # Update the service
    docker service update --image deployi/deployi:candly deployi

    echo "Deployi has been updated to the latest candly version."
}

# Main script execution
if [ "$1" = "update" ]; then
    update_deployi
else
    install_deployi
fi