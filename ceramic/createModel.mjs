import dotenv from "dotenv";

dotenv.config({});

import { writeFile } from "node:fs/promises";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { ModelManager } from "@glazed/devtools";
import { DID } from "dids";
import { Ed25519Provider } from "key-did-provider-ed25519";
import { getResolver } from "key-did-resolver";
import { fromString } from "uint8arrays";

if (!process.env.SEED) {
  throw new Error("Missing SEED environment variable");
}

// The seed must be provided as an environment variable
const seed = fromString(process.env.SEED, "base16");
// Create and authenticate the DID
const did = new DID({
  provider: new Ed25519Provider(seed),
  resolver: getResolver(),
});
await did.authenticate();

// Connect to the local Ceramic node
const ceramic = new CeramicClient("https://gateway-clay.ceramic.network");
ceramic.did = did;

// Create a manager for the model
const manager = new ModelManager({ ceramic });

// Create the schemas
const eventInstanceSchemaID = await manager.createSchema("Event", {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "EventInstance",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "name",
      maxLength: 256,
    },
    basicInfos: {
      type: "object",
      title: "basicInfos",
      properties: {
        fromDatetime: {
          type: "string",
          format: "date-time",
          title: "fromDatetime",
          maxLength: 30,
        },
        toDatetime: {
          type: "string",
          format: "date-time",
          title: "toDatetime",
          maxLength: 30,
        },
        location: {
          type: "object",
          title: "location",
          properties: {
            description: {
              type: "string",
              title: "description",
              maxLength: 512,
            },
            lat: {
              type: "number",
              minimum: -90,
              maximum: 90,
            },
            lng: {
              type: "number",
              minimum: -180,
              maximum: 180,
            },
          },
        },
        links: {
          type: "array",
          title: "links",
          items: {
            type: "string",
            format: "uri",
            pattern: "^https?://",
          },
        },
      },
    },
    poap: {
      type: "object",
      title: "poap",
      properties: {
        name: {
          type: "string",
          title: "name",
          maxLength: 128,
        },
        supply: {
          type: "number",
          format: "supply",
          minimum: 0,
        },
        picture: {
          type: "string",
          format: "date-time",
          title: "toDatetime",
          maxLength: 30,
        },
        poapContractAddress: {
          type: "string",
          title: "poapContractAddress",
          pattern: "^https?://",
        },
        poapEventId: {
          type: "number",
          title: "poapEventId",
          minimum: 0,
        },
      },
    },
  },
});
const eventSchemaID = await manager.createSchema("Event", {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Event",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "name",
      maxLength: 256,
    },
    instances: {
      type: "array",
      title: "instances",
      items: {
        type: "object",
        title: "EventInstanceItem",
        properties: {
          id: {
            $comment: `cip88:ref:${manager.getSchemaURL(
              eventInstanceSchemaID
            )}`,
            type: "string",
            pattern: "^ceramic://.+(\\?version=.+)?",
            maxLength: 150,
          },
        },
      },
    },
  },
});
const orgSchemaID = await manager.createSchema("Organization", {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "Organization",
  type: "object",
  properties: {
    name: {
      type: "string",
      title: "name",
      maxLength: 256,
    },
    events: {
      type: "array",
      title: "events",
      items: {
        type: "object",
        title: "EventItem",
        properties: {
          id: {
            $comment: `cip88:ref:${manager.getSchemaURL(eventSchemaID)}`,
            type: "string",
            pattern: "^ceramic://.+(\\?version=.+)?",
            maxLength: 150,
          },
        },
      },
    },
  },
});
const orgsSchemaID = await manager.createSchema("Organizations", {
  $schema: "http://json-schema.org/draft-07/schema#",
  title: "OrganizationsList",
  type: "object",
  properties: {
    organizations: {
      type: "array",
      title: "organizations",
      items: {
        type: "object",
        title: "OrganizationItem",
        properties: {
          id: {
            $comment: `cip88:ref:${manager.getSchemaURL(orgSchemaID)}`,
            type: "string",
            pattern: "^ceramic://.+(\\?version=.+)?",
            maxLength: 150,
          },
        },
      },
    },
  },
});

// Create the definition using the created schema ID
await manager.createDefinition("organizations", {
  name: "organizations",
  description: "E20 Organizations",
  schema: manager.getSchemaURL(orgsSchemaID),
});

// Create a Note with text that will be used as placeholder
await manager.createTile(
  "placeholderOrganization",
  { name: "This is a placeholder for the organization name..." },
  { schema: manager.getSchemaURL(orgSchemaID) }
);

// Write model to JSON file
await writeFile(
  new URL("model.json", import.meta.url),
  JSON.stringify(manager.toJSON())
);
console.log("Encoded model written to scripts/model.json file");
