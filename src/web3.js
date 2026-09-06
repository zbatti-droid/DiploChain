
import Web3 from 'web3'

const getWeb3 = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x539',
          chainName: 'Ganache',
          rpcUrls: ['http://127.0.0.1:7545'],
          nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
        }]
      })
    } catch (e) {
      console.log('Chain already added')
    }
    const web3 = new Web3(window.ethereum)
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    return web3
  } else {
    alert('Veuillez installer MetaMask!')
  }
}

export const getContract = async () => {
  const web3 = await getWeb3()
  const accounts = await web3.eth.getAccounts()

  const abi = [
    {
      "inputs": [
        { "internalType": "string",  "name": "_studentName", "type": "string"  },
        { "internalType": "string",  "name": "_institution", "type": "string"  },
        { "internalType": "string",  "name": "_diplomaType", "type": "string"  },
        { "internalType": "uint256", "name": "_issueDate",   "type": "uint256" },
        { "internalType": "string",  "name": "_ipfsHash",    "type": "string"  }
      ],
      "name": "registerDiploma",
      "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "bytes32", "name": "_id", "type": "bytes32" }],
      "name": "verifyDiploma",
      "outputs": [
        { "internalType": "string",  "name": "studentName",  "type": "string"  },
        { "internalType": "string",  "name": "institution",  "type": "string"  },
        { "internalType": "string",  "name": "diplomaType",  "type": "string"  },
        { "internalType": "uint256", "name": "issueDate",    "type": "uint256" },
        { "internalType": "bool",    "name": "isValid",      "type": "bool"    },
        { "internalType": "bool",    "name": "isRevoked",    "type": "bool"    },
        { "internalType": "string",  "name": "revokeReason", "type": "string"  },
        { "internalType": "string",  "name": "ipfsHash",     "type": "string"  }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "bytes32", "name": "_id",     "type": "bytes32" },
        { "internalType": "string",  "name": "_reason", "type": "string"  }
      ],
      "name": "revokeDiploma",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getTotalDiplomas",
      "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "uint256", "name": "index", "type": "uint256" }],
      "name": "getDiplomaByIndex",
      "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [{ "internalType": "address", "name": "_institution", "type": "address" }],
      "name": "addInstitution",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true,  "internalType": "bytes32", "name": "id",          "type": "bytes32" },
        { "indexed": false, "internalType": "string",  "name": "studentName", "type": "string"  },
        { "indexed": false, "internalType": "uint256", "name": "issueDate",   "type": "uint256" },
        { "indexed": false, "internalType": "string",  "name": "ipfsHash",    "type": "string"  }
      ],
      "name": "DiplomaRegistered",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        { "indexed": true,  "internalType": "bytes32", "name": "id",     "type": "bytes32" },
        { "indexed": false, "internalType": "string",  "name": "reason", "type": "string"  }
      ],
      "name": "DiplomaRevoked",
      "type": "event"
    }
  ]

const contractAddress = "0xAa8Ad9CDC44F7a840E21e4538De826fCd0798693"
  const contract = new web3.eth.Contract(abi, contractAddress)
  return { web3, contract, accounts }
}