const { expect } = require("chai");
const { ethers } = require("hardhat");
const { getMessage } = require("eip-712")
const { utils, Wallet } = ethers

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const PollManager = await hre.ethers.getContractFactory("PollManager");
    const pollManager = await PollManager.deploy();
    await pollManager.deployed();
    let createPollTx = await pollManager.createPoll("0x22C1f6050E56d2876009903609a2cC3fEf83B415", 42882)
    await createPollTx.wait()

    const accounts = await ethers.getSigners()
    const signer = accounts[0]

    /* const privateKey = Buffer.from("0P8PhAyjmZrzpKuu4GpDBetWiyXq5fUejz9jiWovsUY=", 'base64')
    const signingKey = new utils.SigningKey("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
    console.log(signingKey.compressedPublicKey) */

    const typedData = {
      types: {
        Vote: [
          { name: 'poll', type: 'uint256' },
          { name: 'answer', type: 'uint8' }
        ]
      },
      primaryType: 'Vote',
      domain: {
        name: 'Vote',
        version: '1',
        chainId: 1,
        verifyingContract: pollManager.address
      },
      message: {
        poll: 1,
        answer: 1
      }
    };

    const signature = await signer._signTypedData(typedData.domain, typedData.types, typedData.message)

    const r = "0x" + signature.substring(2).substring(0, 64);
    const s = "0x" + signature.substring(2).substring(64, 128);
    const v = signature.substring(2).substring(128, 130);

    /* // Get a signable message from the typed data
    const message = getMessage(typedData, true);

    // Sign the message with the private key
    const { r, s, v } = signingKey.signDigest(message); */

    let addVoteTx = await pollManager.addVote(
      {
        poll: 1,
        answer: 1
      },
      parseInt(v, 16),
      r,
      s
    )

    await addVoteTx.wait()

    console.log(await pollManager.getAnswersCount(1, 1))

    let addVoteTx2 = await pollManager.addVote(
      {
        poll: 1,
        answer: 1
      },
      parseInt(v, 16),
      r,
      s
    )

    console.log(await pollManager.getAnswersCount(1, 1))


  });
});
