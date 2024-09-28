import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  
  const [connectedWalletAddress, setConnectedWalletAddress] = useState<string | null>(null)
  
  
  
  
  
  
  const [balance, setBalance] = useState<string | null>(0)
  const [chainId, setChainId] = useState<number | null>(0)

  const [accountChanged, setAccountChanged] = useState(null)
  
  async function initWallet(){
    try {
      // check if any wallet provider is installed. i.e metamask xdcpay etc
      // setWalletConnectLoader(true)
      if (typeof window.ethereum === 'undefined') {
        console.log("Please install wallet.")
        alert("Please install wallet.")
        
        return
      }
      else{
        const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        console.log(accounts[0])
        setConnectedWalletAddress(accounts[0])

        return
      }

    } catch (error) {
      console.log("initwallet error", error)
      
      return
    }
  }



  async function switchNetwork() {
    try {
      const targetNetwork = {
        chainId: '0x1',       
      };

      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [targetNetwork],
      });

      alert("Network switched successfully.");
    } catch (error) {
      console.log("switchNetwork error", error);
      alert("Failed to switch network.");
    }
  }

  async function getBalance() {
    if (window.ethereum) {
        try {
          const balance = await window.ethereum.request({ method: 'eth_getBalance', params: [connectedWalletAddress, 'latest'] });
          const balanceInEth = ethers.formatEther(balance)
          setBalance(balanceInEth)
          console.log(balance)
        }
        catch (error) {
          console.log("getBalance error", error)
          alert("Failed to get balance.")
        }
    }
  }

  async function getChainId() {
    if (window.ethereum) {
        try {
          
          const chainId = await window.ethereum.request({ method: 'eth_chainId' });
          console.log(chainId)
          setChainId(parseInt(chainId, 16))
        }
        catch (error) {
          console.log("getBalance error", error)
          alert("Failed to get balance.")
        }
    }
  }



  async function connectEXC(){
    try {
      // setWalletConnectLoader(true)
      const connect = await window.ethereum.on("accountsChanged", (accounts: string[]) => {
        setAccountChanged(connect)
        console.log(accounts)
      });
      
    } catch (error) {
      alert(`connectEXC error ${error}`)
      // setWalletConnectLoader(false)
      return
    }
  }

  useEffect(() => {
    initWallet();

    const handleAccountsChanged = (accounts: string[]) => {
      console.log('Accounts changed:', accounts);
      setConnectedWalletAddress(accounts[0] || null);
    };

    const handleChainChanged = (chainId: string) => {
      console.log('Network changed to:', parseInt(chainId, 16));
      setChainId(parseInt(chainId, 16));
    };

    // Add event listeners for account and network changes
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };

  }, [])
  return (
    
  <div className='m-6 space-y-4'>
    <h1 className="text-gray-700 text-3xl font-bold">
      Storage Frontend Demo
    </h1>
    <button onClick={initWallet} className='w-[150px] px-4 py-1 bg-slate-300 hover:bg-slate-500 flex justify-around transition-all w-32' >Connect Wallet</button>
    <p>Connected Wallet: {connectedWalletAddress}</p>
    <button onClick={connectEXC} className='px-4 py-1 bg-slate-300 hover:bg-slate-500 flex justify-around transition-all w-32' > 
    { accountChanged ? accountChanged : "CHANGE ACCOUNTS"
            }
    </button>
    
    <button onClick={getBalance} className='w-[150px] px-4 py-1 bg-slate-300 hover:bg-slate-500 flex justify-around transition-all w-32' >Get Balance</button>
    <p>Balance: {balance} ETH</p>

    <button onClick={getChainId} className='w-[150px] px-4 py-1 bg-slate-300 hover:bg-slate-500 flex justify-around transition-all w-32' >Get Chain ID</button>
    <p>Chain ID: {chainId}</p>

    <button onClick={switchNetwork} className='w-[150px] px-4 py-1 bg-slate-300 hover:bg-slate-500 flex justify-around transition-all w-32' >Switch Network</button>
    
   </div>
  
  );
}

export default App;
