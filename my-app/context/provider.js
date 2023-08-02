'use client';
import { getNetwork, initializeProvider } from "@/components/ethers/ConnectWallet";
import { createContext, useContext, useState, useEffect } from "react";
import { ethers, formatEther, ContractFactory } from "ethers";

export const EthersContext = createContext();

export function EthersProviders({ children }) {
    const [provider, setProvider] = useState(ethers.getDefaultProvider());
    const [WalletAddress, setWalletAddress] = useState(null);
    const [refresh, setRefresh] = useState(false);
    const [network, setNetwork] = useState('');
    const [balance, setBalance] = useState(0);
    const [profilecontract, setProfileContract] = useState(null);
    const [LoggedIn, setLoggedIn] = useState(false);
    const [profileAddress, setProfileAddress] = useState('');
    useEffect(() => {

        const initialstartup = async () => {
            await initializeProvider(setProvider, setWalletAddress, setBalance, setNetwork);
            setRefresh(!refresh);
        };

        initialstartup();

    }, [refresh]);
    return (
        <EthersContext.Provider value={{
                provider,
                setProvider,
                WalletAddress, 
                setWalletAddress,
                refresh,
                setRefresh,
                network,
                setNetwork,
                balance,
                setBalance,
                profileAddress,
                setProfileAddress,
                LoggedIn, 
                setLoggedIn,
            }}
        >
            {children}
        </EthersContext.Provider>
    );
}

export function useEtherProvider() {
    return useContext(EthersContext);
}