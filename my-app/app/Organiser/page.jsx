'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ethers } from 'ethers';
import campaign from "../../components/contracts/votingcampaign";
import { useEtherProvider } from "@/context/provider";

const OrganiserPage = () => {
    const router = useRouter();
    const {provider, WalletAddress} = useEtherProvider();
    const [CampaignAddress, setCampaignAddress] = useState('');


    const createCampaign = () => {
        console.log("create campaign");
        router.push('/Organiser/create');
    };

    const connectCampaign = async() => {
        console.log("connect campaign");
        const Campaign = await new ethers.Contract(CampaignAddress, campaign.abi, provider);
        try {
            await Campaign.campaignName({from: WalletAddress});
        } catch (error) {
            alert("Invalid Campaign contract. Please try again with the correct campaign.");
        }
        if (await Campaign.isOwner({ from: WalletAddress })) {
            console.log(await Campaign.campaignName({from: WalletAddress}));
            await router.push(`/Organiser/connect/${CampaignAddress}`);
        } else {
            alert("You are not the owner of this campaign. Please try again with the correct campaign.");
        }
        

    };
    return (
        <div className="hero min-h-screen bg-base-200 ">
            <div class="hero-content align-top text-center">
                <div class="max-w-md">
                    <h1 class="text-5xl font-bold">Organiser</h1>
                    <p class="py-6"></p>
                    <div class="flex w-full">
                        <div class="grid flex-grow place-items-center">
                            <div className="card-body">
                                <label className="label">
                                    <span className="label-text">Campaign Address</span>
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


                        <div class="divider divider-horizontal">OR</div>
                        <div class="grid flex-grow place-items-center">
                            <div className="card-body">
                                <button class="btn btn-secondary" onClick={createCampaign}>Create Campaign</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default OrganiserPage;