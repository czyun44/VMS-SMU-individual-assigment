'use client';
import { useState } from "react";
import campaign from "../components/contracts/votingcampaign";
import { initializeProvider } from "../components/ethers/ConnectWallet";
import { deployContract } from "@/components/ethers/ContractMethods";
import { useEtherProvider } from "@/context/provider";

const CampaignABI = campaign.abi;
const CampaignByteCode = campaign.bytecode;

export default function Home() {
    const { provider, setProvider, WalletAddress, setWalletAddress, 
        refresh, setRefresh, network, setNetwork, balance, setBalance } = useEtherProvider();
    const [contract, setContract] = useState(null);
    const [contractaddress, setContractAddress] = useState('');


    const deployCampaignContract = async () => {
        const name = "campaign";
        const description = "This is a description";
        const startDateTime = 1620000000;
        const endDateTime = 1620000000;

        const contractParameters = [name, description, startDateTime, endDateTime];
        const campaign = await deployContract(CampaignABI, CampaignByteCode, contractParameters, provider);
        setContractAddress(campaign.target)
        return { campaign, name, description, startDateTime, endDateTime };

    }

    const interactWithContract = async () => {
        if (contract) {
            const result = await contract.someFunction();
            console.log(result);
        }
    };

    return (
        <div className="container mx-auto justify-center">
            <div>
                <h1>Ethers.js and React Integration</h1>

                <p>Connected to network: {network}</p>

                <p>Balance: {balance} Eth</p>

                <p>Contract: {contractaddress}</p>

                <button className="btn" onClick={() => deployCampaignContract()}>Deploy contract</button>

            </div>

            <button className="btn" onClick={() => setRefresh(!refresh)}>Refresh</button>
        </div>

    )
};