'use client';

import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useEtherProvider } from "@/context/provider";
import campaign from "../../components/contracts/votingcampaign";


const VoterPage = () => {
    const router = useRouter();
    const [CampaignAddress, setCampaignAddress] = useState('');
    const {provider, WalletAddress} = useEtherProvider();


    const connectCampaign = async () => {
        console.log("connect campaign");
        const Campaign = await new ethers.Contract(CampaignAddress, campaign.abi, provider);
        try {
            await Campaign.campaignName({from: WalletAddress});
            await router.push(`/Voter/connect/${CampaignAddress}`);
        } catch (error) {
            alert("Invalid Campaign contract. Please try again with the correct campaign address.");
        }
        
    };

    return (
        <div className="hero min-h-screen bg-base-200 ">
            <div class="hero-content text-center">
                <div class="max-w-md">
                    <div class="flex w-full">
                    <div class="grid flex-grow place-items-center">
                            <div className="card-body">
                                <label className="label">
                                    <span className="label-text">Enter the Campaign Address</span>
                                </label>
                                <input
                                    type="text"
                                    value={CampaignAddress}
                                    onChange={(event) =>
                                        setCampaignAddress(event.target.value)
                                    }
                                    placeholder=""
                                    className="input input-bordered w-full max-w-xs" />
                                <button class="btn btn-primary" onClick={connectCampaign}>Connect</button>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VoterPage;