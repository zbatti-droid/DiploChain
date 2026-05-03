import Web3 from 'web3'

const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum)
    
    // طلب الاتصال
    await window.ethereum.request({ method: 'eth_requestAccounts' })
    
    // التأكد أننا على شبكة Ganache
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x539' }], // 1337
      })
    } catch (err) {
      console.log('Switch network error:', err)
    }

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
        { "internalType": "string", "name": "_studentName", "type": "string" },
        { "internalType": "string", "name": "_institution", "type": "string" },
        { "internalType": "string", "name": "_diplomaType", "type": "string" }
      ],
      "name": "registerDiploma",
      "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        { "internalType": "bytes32", "name": "_id", "type": "bytes32" }
      ],
      "name": "verifyDiploma",
      "outputs": [
        { "internalType": "bool", "name": "isValid", "type": "bool" },
        { "internalType": "string", "name": "studentName", "type": "string" },
        { "internalType": "string", "name": "institution", "type": "string" },
        { "internalType": "string", "name": "diplomaType", "type": "string" }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

const contractAddress = "0x1D18696f9073D8D52A4dbBE639F7847C1c8E840A"
  const contract = new web3.eth.Contract(abi, contractAddress)

  return { web3, contract, accounts }
}