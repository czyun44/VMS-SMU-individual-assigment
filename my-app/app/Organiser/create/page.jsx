'use client';
import { deployContract } from "@/components/ethers/ContractMethods";
import campaign from "../../../components/contracts/votingcampaign";
import { useState } from "react";
import { useEtherProvider } from "@/context/provider";
import { useRouter } from "next/navigation";

const CampaignABI = campaign.abi;
const CampaignByteCode = campaign.bytecode;

const createCampaign = () => {
    const router = useRouter();
    const {provider} = useEtherProvider();
    const [parameters, setParameters] = useState({
        name: '',
        description: '',
        startDateTime: 0,
        endDateTime: 0
    });
    const [modal, setModal] = useState({
        title: "Hello!",
        content: "Press ESC key or click the button below to close",
        action: "Close"
    });

    const createCampaign = async () => {
        //console.log("create campaign");

        const contractParameters = [parameters.name, parameters.description, parameters.startDateTime, parameters.endDateTime];
        const campaign = await deployContract(CampaignABI, CampaignByteCode, contractParameters, provider);
        setModal({
            title: "Success! Your campaign address is:",
            content: "Contract Address: " + await campaign.target
                + '\n\n' + "Please keep this address to share to voters and future usage!",
            action: "Back to Organiser Page",
            actionFunction: () => {
                router.push('/Organiser');
            }
        })
        window.my_modal_5.showModal()
    };

    return (
<div className="">
            <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                <form method="dialog" className="modal-box">
                    <h3 className="font-bold text-lg">{modal.title}</h3>
                    <p className="py-4" style={{ whiteSpace: 'break-spaces' }}>{modal.content}</p>
                    <div className="modal-action">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn" onClick={modal.actionFunction}>{modal.action}</button>
                    </div>
                </form>
            </dialog>
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col mg:flex-row">
                    <div className=" form-control w-full max-w-xs">
                        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <div className="card-body">
                                <label className="label">
                                    <span className="label-text">Name of Voting</span>
                                </label>
                                <input
                                    type="text"
                                    value={parameters.name}
                                    onChange={(event) =>
                                        setParameters({...parameters, name:event.target.value})
                                    }
                                    placeholder=""
                                    className="input input-bordered w-full max-w-xs" />

                                <label className="label">
                                    <span className="label-text">Description</span>
                                </label>
                                <input
                                    type="text"
                                    value={parameters.description}
                                    onChange={(event) =>
                                        setParameters({...parameters, description:event.target.value})
                                    }
                                    placeholder=""
                                    className="input input-bordered w-full max-w-xs" />
                                <button className="btn" onClick={createCampaign}>Create </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default createCampaign;