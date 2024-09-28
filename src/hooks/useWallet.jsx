import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

const useWallet = () => {
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [network, setNetwork] = useState(null);

  const connectWallet = useCallback(async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setNetwork(parseInt(chainId, 16));

        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        setBalance(ethers.formatEther(balance));
      } catch (error) {
        console.error("Error connecting to wallet:", error);
      }
    } else {
      console.error("No Ethereum provider found. Install MetaMask.");
    }
  }, []); 

  const getBalance = async (address) => {
    if (address && window.ethereum) {
      const balance = await window.ethereum.request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      });
      return ethers.formatEther(balance);
    }
  };

  const switchToETHMainnet = async () => {
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
  
  const switchToSepolia = async () => {
    try {
      const targetNetwork = {
        chainId: '0xaa36a7',       
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

  const switchAccount = useCallback(async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] });
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAccount(accounts[0]);

        const balance = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [accounts[0], 'latest']
        });
        setBalance(ethers.formatEther(balance));

        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        setNetwork(parseInt(chainId, 16));
      } catch (error) {
        console.error("Error switching account:", error);
      }
    } else {
      console.error("No Ethereum provider found. Install MetaMask.");
    }
  }, []);

  useEffect(() => {
    const handleAccountsChanged = async (accounts) => {
      setAccount(accounts[0]);

      if (account) {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"]
        })
        setBalance(ethers.formatEther(balance));
      }
    }

    const handleChainChanged = async (chainId) => {
      setNetwork(parseInt(chainId, 16));

      if (account) {
        const balance = await window.ethereum.request({
          method: "eth_getBalance",
          params: [account, "latest"]
        })
        setBalance(ethers.formatEther(balance));
      }
    }

    const handleDisconnect = () => {
      setAccount(null);
      setBalance(0);
      setNetwork(null);
    }

    const handleConnect = (e) => {
      console.log(e);
    }

    if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountsChanged);

      window.ethereum.on('chainChanged', handleChainChanged);

      window.ethereum.on('disconnect', handleDisconnect);

      window.ethereum.on('connect', handleConnect);
 
    }

    return () => {
      window.removeEventListener('accountsChanged', handleAccountsChanged);
      window.removeEventListener('chainChanged', handleChainChanged);
      window.removeEventListener('disconnect', handleDisconnect);
      window.removeEventListener('connect', handleConnect);
    };
  }, [account]);

  return { account, balance, network, connectWallet, getBalance, switchToETHMainnet, switchToSepolia, switchAccount };
};

export default useWallet;