// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ethers } from "ethers"
import pollContractABI from "../../artifacts/contracts/PollManager.sol/PollManager.json"


function getSigner() {
  let wallet = new ethers.Wallet("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  const provider = new ethers.providers.JsonRpcProvider();
  return wallet.connect(provider);
}

const pollContractAddress = '0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf'

function getContract(signer) {
  return new ethers.Contract(pollContractAddress, pollContractABI.abi, signer)

}

export default async function handler(req, res) {

  const { signature, pollId, answer } = JSON.parse(req.body)
  const r = "0x" + signature.substring(2).substring(0, 64);
  const s = "0x" + signature.substring(2).substring(64, 128);
  const v = signature.substring(2).substring(128, 130);

  const signer = getSigner()

  let pollManager = getContract(signer)

  try {
    let addVoteTx = await pollManager.addVote(
      {
        poll: pollId,
        answer: answer
      },
      parseInt(v, 16),
      r,
      s
    )

    const ciccio = await addVoteTx.wait()

    console.log(ciccio)
    if (ciccio) {
      return res.status(200).json({
        success: true
      })
    }

  } catch (e) {
    console.log(e)
    return res.status(500).json(e)
  }
}
