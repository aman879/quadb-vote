import React, { createContext, useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { toast } from "react-toastify";

// Creating a context for Web3-related data  
export const Web3Context = createContext();

// Holesky Testnet network details  
const HOLESKY_NETWORK = {
    chainId: "0x4268", 
    chainName: "Holesky Testnet",
    nativeCurrency: {
        name: "ETH",
        symbol: "ETH",
        decimals: 18,
    },
    rpcUrls: ["https://api.zan.top/eth-holesky"],
    blockExplorerUrls: ["https://holesky.etherscan.io"],
};

// Web3Provider component to manage Web3 connections  
const Web3Provider = ({ children }) => {
    const [provider, setProvider] = useState(null); // Stores the Ethereum provider  
    const [account, setAccount] = useState(null); // Stores the connected wallet address  

    // Effect to check if MetaMask is installed and restore saved account  
    useEffect(() => {
        if (window.ethereum) {
            const ethProvider = new BrowserProvider(window.ethereum);
            setProvider(ethProvider);

            const savedAccount = localStorage.getItem("connectedAccount");
            if (savedAccount) {
                setAccount(savedAccount);
            }
        } else {
            toast.info("Install MetaMask to use this dApp.", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
            console.log("Ethereum not found.");
        }
    }, []);

    // Effect to handle account and network changes  
    useEffect(() => {
        if (window.ethereum) {
            // Listen for account changes  
            window.ethereum.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                    localStorage.setItem("connectedAccount", accounts[0]);
                } else {
                    disconnectWallet();
                }
            });

            // Listen for network changes  
            window.ethereum.on("chainChanged", (chainId) => {
                if (chainId !== HOLESKY_NETWORK.chainId) {
                    toast.info("Please switch to Holesky", {
                        position: "top-right",
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                    });
                }
            });
        }
    }, []);

    // Function to switch network to Holesky  
    const switchToHolesky = async () => {
        if (!window.ethereum) return;
        try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: HOLESKY_NETWORK.chainId }],
            });
        } catch (error) {
            if (error.code === 4902) {
                try {
                    // If the network is not added, add it  
                    await window.ethereum.request({
                        method: "wallet_addEthereumChain",
                        params: [HOLESKY_NETWORK],
                    });
                } catch (addError) {
                    toast.error("Failed to switch network", {
                        position: "top-right",
                        pauseOnFocusLoss: false,
                        pauseOnHover: false,
                    });
                }
            } else {
                toast.error("Failed to switch to Holesky", {
                    position: "top-right",
                    pauseOnFocusLoss: false,
                    pauseOnHover: false,
                });
            }
        }
    };

    // Function to connect the wallet  
    const connectWallet = async () => {
        if (!window.ethereum) {
            alert("MetaMask not detected.");
            return;
        }

        if (account) {
            disconnectWallet();
            return;
        }

        try {
            await switchToHolesky(); // Ensure user is on the correct network  

            const signer = await provider.getSigner();
            const newAccount = await signer.getAddress();
            setAccount(newAccount);

            localStorage.setItem("connectedAccount", newAccount);

            toast.success("Connected Successfully", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        } catch (error) {
            toast.error("Error while connecting", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        }
    };

    // Function to disconnect the wallet  
    const disconnectWallet = () => {
        setAccount(null);
        localStorage.removeItem("connectedAccount");
    };

    // Providing Web3 context values to the entire application  
    return (
        <Web3Context.Provider value={{ provider, account, connectWallet }}>
            {children}
        </Web3Context.Provider>
    );
};

export default Web3Provider;
