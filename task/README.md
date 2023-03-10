# Impact Evaluator Console

**Description**: Provides a user interface for the administrators to approve a claim, distribute the award and initation distribution of the award.

## Dependencies

- Ceramic ComposeDB
- Ceramic JS HTTP Client
- Next.js
- web3.storage
- Bacalhau
- Ether.js
- Solidity

## Installation

Detailed instructions on how to install, configure, and get Impact Evaluator Console up and running can be found here: [INSTALL](INSTALL.md)

## Usage

### Interacting with the Impact Evaluator Console App

##### Approve Impact Evaluator Claims

A list of claims to be evaluated are retrieved from the source system and presented to the administrator/approver. The list of Tasks/Claims retrieved from the source system based on a set of criteria. In this use case, the source component retrieves any task that is in a "Ready" state. (In this POC implementation the source system is Taiga). Once approved, the Approved Claims are **created in ComposeDB**. As they are persisted to ComposeDB the status in the source system is updated to "in progress".

[As we consider reuse of the console, the source system would become pluggable and the status values will be configurable].

```
http://localhost:3000/approve/Approve
```

##### Distribute Impact Evaluator Claims

A list of "Approved" claims are retrieved from the source system and presented to the administrator/approver. The list of Tasks/Claims retrieved from the source system is based on a set of criteria. In this use case, the source component retrieves any task that is in a "Closed" state. (In this POC implementation the source system is Taiga). The administrator has the opportunity to distribute the full amount of the approved claim to one or more users up to the its full approved value. Once submitted, the Earned Claims are **created in ComposeDB**. As they are persisted to ComposeDB the status in the source system is updated to "complete".

[As we consider reuse of the console, the source system would become pluggable and the status values will be configurable].

```
http://localhost:3000/distribute/Distribute
```

##### Impact Evaluator Calc

All claims for this "round" are queried from ComposeDB. They are then pinned to web3.storage. The web3.storage CID is then passed Bacalhau Compute to initiate the computation of the impact evaluator. Bacalhau Compute returns a Merkle tree of the rewards.

The response from the Baclahau Calc is then submitted to the Wrapper Contract.

```
http://localhost:3000/calculate/Calculate.js
```

##### Retrieve the CID for a Task

Once a Task has been persisted to CeramicDB, you can retrieve the CID for that claim using the Stream ID.

```
http://localhost:3000/cid/Cid
```

### Interacting through the GraphiQL UI

###### Create an instance of a claim

Launch the graphiQL URL in the browser and run the mutation below:

```
mutation {
    createClaim
        (input: { content: { by: "Steve", claim: "My second Claim", round: "round one", credit: 1 } }) {
        document {
            by
        }
    }
}
```

#### Query the first 10 instances of a claim

Launch the graphiQL URL in the browser and run the query below:

```
query {
  ClaimIndex(first: 10) {
    edges {
      node {
        by
      }
    }
  }
}
```

### Interacting with ComposeDB Command Line

##### Get the details of the GraphQL Schema

To check the details of the GraphQL schema built from your runtime composite representation, you can use the graphql:schema CLI command:

```
composedb graphql:schema runtime-composite.json
```
