// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  const PollManager = await hre.ethers.getContractFactory("PollManager");
  const pollManager = await PollManager.deploy();
  await pollManager.deployed();
  let createPollTx = await pollManager.createPoll("0x22C1f6050E56d2876009903609a2cC3fEf83B415", 42882, 4)
  await createPollTx.wait()
  console.log(pollManager.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
