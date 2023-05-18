# IP blacklist Service

The IP blacklist Service is a microservice that manages a blacklist of IP addresses. It is designed to prevent abuse and ban IPs known to be used for malicious purposes.

## Features

- Single REST endpoint to check if an IP is part of the blacklist.
- Synchronizes with a public blacklist that is updated every 24 hours.
- Persistence of the blacklist data in a local file.
- Minimizes restart time and downtime when updating the blacklist.
- Handles heavy load and responds in a timely manner.

## Installation

1. Clone the repository:
```bash
git clone https://github.com/IAmMorrow/ip-blacklist-service.git
```

2. Install dependencies:
```bash
cd ip-blacklist-service
pnpm install
```

## Configuration

The IP Blacklist Service can be configured using environment variables. The following variables are available:

- **SERVER_PORT** (default: 4444): The port number for the REST API.
- **POLL_FREQUENCY_MS** (default: 1800000): The frequency (in milliseconds) at which the service polls the public blacklist for updates.
- **BLACKLIST_FILE_PATH** (default: "./blacklist.json"): The file path where the blacklist data is persisted.

To configure the service, you can set these environment variables according to your requirements. Here's an example of how you can set the environment variables:

```bash
SERVER_PORT=4444
LOG_LEVEL=info
BLACKLIST_FILE_PATH="./ipv4Blacklist.json"
```

## Usage

1. Start the IP Blocklist Service:

```bash
pnpm start
```

or for development
```bash
pnpm start:dev
```

2. The service will be accessible at http://<IP>:<PORT>/ips/:ipv4 where :ipv4 is the ipv4 encoded IP address to check against the blacklist.

## Testing
To run the tests, use the following command:

```bash
pnpm test
```

## Design Choices
- The service is implemented using Node.js and TypeScript.
- The Koa library is used for the REST API due to its simplicity and lightweight nature.
- The Axios library is used for making HTTP requests to the public blocklist API.
- The Winston library is used for logging.
- The blocklist data is polled from the public blocklist API at a configurable interval of time.
- The blocklist data is persisted in a local file to minimize downtime during restarts.
- If no local data is available on start or if those are not fresh enough, the server will perform a "cold start" which can take longer.
- All blacklisted ips are stored in memory inside a map, allowing fast and constant time retrieval for any record.

## Trade-offs
Due to time constraints, the following trade-offs were made:

- Unit tests cover critical functionality but may not provide complete coverage.
- Error handling and validation may be simplified for brevity.
- Some optimizations, such as caching, were not implemented.
- A simple JSON file as used to persist blacklist data. A database should probably be used for scaling reasons.
- To handle more clients, the service can implement an auto scaling capable architecture.
