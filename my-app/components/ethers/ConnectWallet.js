import { ethers, formatEther } from "ethers";
import React from "react";


export const initializeProvider = async (setProvider, setWalletAddress, setBalance, setNetwork) => {
    if (window.ethereum) {
        const walletaddress = await window.ethereum.request({ method: 'eth_requestAccounts' });
        // console.info(walletaddress);
        setWalletAddress(await walletaddress[0]);
        const provider = await new ethers.BrowserProvider(window.ethereum);
        setProvider(provider);

        const network = await provider.getNetwork();
        setNetwork(network.chainId == 31337 ? "Localhost":network.name);

        setBalance(formatEther(await provider.getBalance(walletaddress[0])));
    } else {
        setProvider(await ethers.getDefaultProvider());
    }
};

