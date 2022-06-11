import { useEffect, useState } from "react";
import Answer from "./Answer";
import { ethers } from "ethers"
import pollContractABI from "../artifacts/contracts/PollManager.sol/PollManager.json"
import H1 from "./H1"
import Button from "./Button"

const pollContractAddress = '0x99bbA657f2BbC93c02D617f8bA121cB8Fc104Acf'

async function getSigner() {
  const provider = new ethers.providers.Web3Provider(window.ethereum, "any");
  await provider.send("eth_requestAccounts", []);
  return provider.getSigner();
}

async function getContract() {
  let signer = await getSigner()
  return new ethers.Contract(pollContractAddress, pollContractABI.abi, signer)
}

function wait(milliseconds) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

const POLL_STATUS = {
  ERROR: -1,
  WAITING: 0,
  LOADING: 1,
  ANSWERED: 2
}

function Poll() {

  const [pollStatus, setPollStatus] = useState(POLL_STATUS.WAITING)
  const [answers, setAnswers] = useState({})
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [total, setTotal] = useState(null)

  async function loadAnswers(pollId) {
    let pollManager = await getContract()
    let answersTemp = {}
    let total = 0;
    for (let i = 0; i < 4; i++) {
      let asd = await pollManager.getAnswersCount(pollId, i)
      total += parseInt(asd.toString())
      answersTemp[i] = asd
    }
    if (total != 0) {
      setAnswers(answersTemp)
    } else {
      await wait(1000)
    }
    setTotal(total)
    return total
  }


  async function sendVote(pollId, answer) {

    let signer = await getSigner()

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
        chainId: 31337,
        verifyingContract: pollContractAddress
      },
      message: {
        poll: pollId,
        answer: answer
      }
    };

    const signature = await signer._signTypedData(typedData.domain, typedData.types, typedData.message)

    setPollStatus(POLL_STATUS.LOADING)



    try {

      let res = await fetch('/api/sendTransaction', {
        method: 'POST',
        body: JSON.stringify({
          signature,
          pollId,
          answer
        })
      })

      let data = await res.json()
      if (res.status === 500) {
        throw data
      }

      setPollStatus(POLL_STATUS.ANSWERED)

      // this sucks but it's needed
      while (await loadAnswers(pollId) === 0) { }

    } catch (e) {
      console.log(e)
      loadAnswers(pollId)
      setPollStatus(POLL_STATUS.ERROR)
    }
  }
  useEffect(() => {
    async function a() { }

    a()
  }, [])

  const pollId = 1

  const pollTitle = "Would you prefer fighting a horse-sized duck or a hundred duck-sized horses?"

  const availableAnswers = [
    { label: "a horse-sized duck", id: 0 },
    { label: "a hundred duck-sized horses", id: 1 },
  ]

  // 
  function renderStatus() {
    switch (pollStatus) {
      case POLL_STATUS.WAITING:
        return (
          <div className="container mx-auto py-10 flex flex-col grow relative">
            <H1>{pollTitle}</H1>
            {availableAnswers.map((a, i) => (
              <div key={i} className="my-4">
                <Answer checked={a.id === selectedAnswer} onSelect={() => setSelectedAnswer(i)}>
                  {a.label}
                </Answer>
              </div>
            ))}
            <Button disabled={selectedAnswer === null} onClick={() => sendVote(pollId, selectedAnswer)}>Vote</Button>
          </div>
        )
      case POLL_STATUS.ERROR:
        return (
          <div className="container mx-auto py-10 flex flex-col grow relative justify-center text-center">
            <H1>Error</H1>
            {Object.values(answers).map((a, i) => (
              <div key={i}>{a.toString()}<br /></div>
            ))}
          </div>
        )
      case POLL_STATUS.ANSWERED:
        return (
          <div className="container mx-auto py-10 flex flex-col grow relative justify-center text-center">
            {Object.values(answers).length === 0 ? (
              <div>
                <H1>Thank you for voting</H1>
                We are loading the results...
              </div>
            ) : (
              <div>
                <H1>{pollTitle}</H1>
                {availableAnswers.map((a, i) => (
                  <div key={i} className="my-4">
                    <Answer checked={a.id === selectedAnswer} percentage={parseInt(answers[i] / total * 100)}>
                      {a.label}
                    </Answer>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      case POLL_STATUS.LOADING:
        return (
          <div className="container mx-auto py-10 flex flex-col grow relative justify-center text-center">
            <H1>Loading...</H1>
          </div>
        )
      default:
        return <div></div>
    }
  }

  return renderStatus();
}

export default Poll;
