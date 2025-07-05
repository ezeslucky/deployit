# Deployi Monitoring (Go Version)

Application that powers Deployi's monitoring service.

You can use it for monitoring any external service.

## Requirements

- Go 1.21

## Configuration

Create a `.env` file in the root of the project with the following content:

```shell
METRICS_CONFIG='{
  "server": {
    "refreshRate": 25,
    "port": 3001,
    "type": "Remote | Deployi",
    "token": "metrics",
    "urlCallback": "http://localhost:3000/api/trpc/notification.receiveNotification",
    "retentionDays": 7,
    "cronJob": "0 0 * * *",
    "thresholds": {
      "cpu": 0,
      "memory": 0
    }
  },
  "containers": {
    "refreshRate": 25,
    "services": {
      "include": ["testing-elasticsearch-14649e"],
      "exclude": []
    }
  }
}'
```

## Installation

```bash
go mod download
```

## Execution

```bash
go run main.go
```

## Endpoints

- `GET /health` - Check service health status (no authentication required)
- `GET /metrics?limit=<number|all>` - Get server metrics (default limit: 50)
- `GET /metrics/containers?limit=<number|all>&appName=<name>` - Get container metrics for a specific application (default limit: 50)

## Features

### Server

- CPU Usage (%)
- Memory Usage (%)
- Disk
- Network
- CPU Model
- Operating System
- Kernel
- Architecture
- Threads


### Containers

Compatible with all Docker container types (standalone containers, Docker Compose, and Docker Swarm stacks). Note: When monitoring Docker Compose or Swarm stacks, use the `--p` flag to properly identify all services within the stack.

Example response:

| Field          | Value                                 |
| -------------- | ------------------------------------- |
| id             | 1                                     |
| timestamp      | 2025-01-19T22:16:30.796129Z           |
| container_id   | 7428f5a49039                          |
| container_name | testing-elasticsearch-14649e-kibana-1 |

Metrics JSON:

```json
{
  "timestamp": "2025-01-19T22:16:30.796129Z",
  "CPU": 83.76,
  "Memory": {
    "percentage": 0.03,
    "used": 2.262,
    "total": 7.654,
    "usedUnit": "MB",
    "totalUnit": "GB"
  },
  "Network": {
    "input": 306,
    "output": 0,
    "inputUnit": "B",
    "outputUnit": "B"
  },
  "BlockIO": {
    "read": 28.7,
    "write": 0,
    "readUnit": "kB",
    "writeUnit": "B"
  },
  "Container": "7428f5a49039",
  "ID": "7428f5a49039",
  "Name": "testing-elasticsearch-14649e-kibana-1"
}
```

## Notifications

Deployi uses a callback URL to send notifications when metrics exceed configured thresholds. Notifications are sent via POST request in the following format:

Note: Setting a threshold to 0 disables notifications for that metric.

```typescript
interface Notification {
  Type: "Memory" | "CPU";
  Value: number;
  Threshold: number;
  Message: string;
  Timestamp: string;
  Token: string;
}
```
