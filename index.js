import { ethers } from "./ethers-5.2.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
connectButton.onclick = connect

const fundButton = document.getElementById("fundButton")
fundButton.onclick = fund

const balanceButton = document.getElementById("balanceButton")
balanceButton.onclick = getBalance

const withdrawButton = document.getElementById("withdrawButton")
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum != "undefined") {
    console.log("Metamask")
    await window.ethereum.request({ method: "eth_requestAccounts" })
    console.log("Connected")
    connectButton.innerHTML = "connected"
  } else {
    connectButton.innerHTML = "Please install metamask"
    console.log("No Metamask")
  }
}

async function fund() {
  const ethAmount = document.getElementById("ethAmount").value
  console.log(`Funding with ${ethAmount}`)
  if (typeof window.ethereum != "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      })
      await listenForTransactionMined(transactionResponse, provider)
      console.log("Done")
    } catch (e) {
      console.error(e)
    }
  }
}

function listenForTransactionMined(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash} ...`)
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(`Completed with ${transactionReceipt.confirmations}`)
      resolve()
    })
  })
}

async function getBalance() {
  if (typeof window.ethereum != "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const balance = await provider.getBalance(contractAddress)
      console.log(ethers.utils.formatEther(balance))
    } catch (e) {
      console.error(e)
    }
  }
}

async function withdraw() {
  if (typeof window.ethereum != "undefined") {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, abi, signer)
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMined(transactionResponse, provider)
    } catch (e) {
      console.error(e)
    }
  }
}
