## Installation and Configuration

The application can either be run inside a docker container or it can be deployed locally on a developer machine.

- [Installation instructions for Docker](#running-admin-console-and-ceramic-composedb-inside-a-docker-container)
- [Installation instructions to run locally](#running-admin-console-and-ceramic-composedb-locally)

### Running Impact Evaluator Console and Ceramic composeDB inside a Docker Container

#### Create and Populate .env file

Create a .env file and place it in the project root directory. The .env file should have the following variables set:

```
TAIGA_ID="<your taiga id>"
TAIGA_PWD = "<your taiga password>"
TAIGA_TOKEN="<your taiga auth token>"
TAIGA_PROJECT_ID=36
TAIGA_POINTS_FACTOR=.2
USER_WALLET=<your public wallet address>
DID_PRIVATE_KEY=59e83c249b8947d1524a3f5f66326c78759c86d75573027e7bef571c3fddfb90
CERAMIC_NODE_URL=http://composedb:7007
CERAMIC_QUERY_URL=http://composedb:8000
PORT=8080
WEB3STORAGE_API_KEY="<WEB3.STORAGE API KEY>"
GNOSIS_WALLET_PRIVATE=0xa8a71bde396a3ff4d315cc0bb0f3884f4738b0ca9c2e8d023ae1ddbd6a160897
WRAPPER_CONTRACT_ADDRESS=xx
WEB3_PROVIDER=goerli

```

#### Launch the Docker Container

```
docker-compose up
```

#### Deploy the ComposeDB composite

Deploy the composite after all the docker containers are up.

```
npm run deploy:composite
```

### Running Admin Console and Ceramic composeDB Locally

#### Install Ceramic composeDB

```
pnpm add -g @composedb/cli@^0.3.0
pnpm add -D @composedb/devtools@^0.3.0 @composedb/devtools-node@^0.3.0
pnpm add @composedb/client@^0.3.0
pnpm add -D @composedb/types@^0.3.0
```

#### Configure Ceramic

##### Set environment variable

```
export CERAMIC_ENABLE_EXPERIMENTAL_COMPOSE_DB='true'
pnpm dlx @ceramicnetwork/cli daemon
```

##### Generate a DID private key

```
composedb did:generate-private-key
```

##### Getting the DID Value

```
composedb did:from-private-key [hexadecimal-encoded private key string]
```

##### Ceramic Configuration File

The Ceramic node configuration file, which defaults to ~/.ceramic/daemon.config.json on Linux, macOS and WSL (Windows Subsystem for Linux), needs to be edited to specify the admin DIDs allowed to set models for indexing, as well as the indexing configuration:

```
{
  ...
  "http-api": {
    ...
    "admin-dids": ["did:key:..."]
  },
  "indexing": {
    ...
    "allow-queries-before-historical-sync": true
  }
}
```

#### NPM .env File

Create a .env.local file and place it in the ./task/ folder. It needs to include the following variables:

```
CERAMIC_URL = "http://0.0.0.0:7007"
TAIGA_ID="<your taiga ID>"
TAIGA_PWD = "<your taiga password>"
TAIGA_TOKEN="<your taiga auth token>"
TAIGA_PROJECT_ID=36
TAIGA_POINTS_FACTOR=.2
USER_WALLET=<your user wallet address>
```

##### Start the local Ceramic Node

```
pnpm dlx @ceramicnetwork/cli daemon
```

#### Create the Claim composite

##### Converting a Schema to a composite

```
composedb composite:create ./data/ie_claim.graphql --output=ie-claim-composite.json  --ceramic-url=http://0.0.0.0:7007
```

##### Compile the Composite into a runtime definition

In order to interact with a composite at runtime, it is first necessary to create a runtime composite definition file that will be used to configure the client.

```
composedb composite:compile ie-claim-composite.json ie-claim-composite-runtime.json --ceramic-url=http://0.0.0.0:7007

composedb composite:compile ie-claim-composite.json ./__generated__/definition.js --ceramic-url=http://0.0.0.0:7007
```

##### Deploy the composite

```
composedb composite:deploy ie-claim-composite.json --ceramic-url=http://0.0.0.0:7007
```

##### Start the graphQL Server

Start the local server with GraphiQL using the runtime composite:

```
composedb graphql:server --ceramic-url=http://0.0.0.0:7007 --graphiql --port=5001 ie-claim-composite-runtime.json
```