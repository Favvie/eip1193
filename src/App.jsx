import React, { useState } from 'react';
import useWallet from './hooks/useWallet';
// import {ethers} from 'ethers';
function App() {
  const { account, balance, network, connectWallet, getBalance, switchToETHMainnet, switchToSepolia } = useWallet();
  const [address, setAddress] = useState('');
  const [randomAddressBalance, setRandomAddressBalance] = useState('');

  const handleAddressChange = (e) => {
    setAddress(e.target.value);
  };


  return (
    <div className="App">
      <header className="App-header flex flex-col items-center justify-center h-screen w-screen space-y-5">
        <h1>Wallet Connection</h1>
        <button onClick={connectWallet}>{account ? 'Connected' : 'Connect Wallet'}</button>
        {account && (
          <div>
            <p>Account: {account}</p>
            <p>Balance: {balance} ETH</p>
            <p>Network ID: {network}</p>
          </div>
        )}
        <div>
          <input
            type="text"
            value={address}
            onChange={handleAddressChange}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter address"
          />
          <button onClick={()=> {getBalance(address); setAddress(''); setRandomAddressBalance(balance); }} className='ml-5'>Get Balance</button>
          <p>Random Address Balance: {randomAddressBalance}</p>
        </div>
        <section>
            <button onClick={switchToETHMainnet}>Switch to ETH Mainnet</button>
            <button onClick={switchToSepolia} className='ml-4'>Switch to Sepolia</button>
          </section>
      </header>
      
    </div>
  );
}

export default App;