'use client';
import campaign from "@/components/contracts/votingcampaign";
import { ethers } from 'ethers';
import { useEtherProvider } from "@/context/provider";
import { useRouter } from "next/navigation";
import { cache, useEffect, useState } from "react";


const CampaignDetail = ({ params }) => {
    const router = useRouter();
    const CampaignAddress = params.campaignaddress;
    const { provider, WalletAddress, refresh, setRefresh } = useEtherProvider();
    const Status = ['Initiated', 'VoteStarted', 'VoteEnded', 'Unknown'];
    const [data, setData] = useState({
        campaignName: '',
        campaignDescription: '',
        campaignStartTime: 0,
        campaignEndTime: 0,
        campaignStatus: 3,
        winner: '',
        winnerVoteCount: 0,
        candidates: [],
        voters: [],
    });

    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [addCandidateNamefield, setAddCandidateNamefield] = useState('');
    const [addVoterAddressfield, setAddVoterAddressfield] = useState('');

    const addVoter = async () => {
        const signer = await provider.getSigner();
        const Campaign = await new ethers.Contract(CampaignAddress, campaign.abi, signer);
        try {
            await Campaign.addVoters(addVoterAddressfield, { from: WalletAddress }).then(
                (result) => { 
//console.log(result) 
                    alert("Voter added successfully");
                    setRefresh(!refresh);
                }
            );
        } catch (error) {
            alert(error.message);
        }
    };

    const addCandidate = async () => {
        const signer = await provider.getSigner();
        const Campaign = await new ethers.Contract(CampaignAddress, campaign.abi, signer);
        try {
            await Campaign.addCandidate(addCandidateNamefield, { from: WalletAddress })
            .then(
                (result) => { 
//console.log(result) 
                    alert("Candidate added successfully");
                    setRefresh(!refresh);
                }
            );
        } catch (error) {
            alert(error.message);
        }
    };

    const startVoting = async () => {
        const signer = await provider.getSigner();
        const Campaign = await new ethers.Contract(CampaignAddress, campaign.abi, signer);
        try {
            await Campaign.beginVoting({ from: WalletAddress }).wait().then(
                (result) => {
//console.log(result)
                    alert("Voting started successfully");
                    setRefresh(!refresh);
                }
            );
        } catch (error) {
            alert(error.message);
        }
    };

    const endVoting = async () => {
        const signer = await provider.getSigner();
        const Campaign = await new ethers.Contract(CampaignAddress, campaign.abi, signer);
        try {
            await Campaign.stopVote({ from: WalletAddress }).then(
                (result) => {
//console.log(result)
                    alert("Voting ended successfully");
                    setRefresh(!refresh);
                }
            );
        } catch (error) {
            alert(error.message);
        }
    };




    useEffect(() => {
        const getCandidates = async (Campaign) => {
            try {
                const candidateCount = await Campaign.totalcandidates({ from: WalletAddress });
                let candidatesList = [];
                for (let i = 0; i < candidateCount; i++) {
                    const candidateName = await Campaign.candidateIndex(i, { from: WalletAddress });
                    const voteCount = await Campaign.candidates(candidateName, { from: WalletAddress });
                    candidatesList.push({
                        name: candidateName,
                        voteCount: Number(voteCount[1]),
                    });
                }
//console.log(candidatesList);
                await setCandidates([...candidatesList]);
            } catch (error) {

            }
        };
        const getVoters = async (Campaign) => {
            try {
                const totalVoter = await Campaign.totalVoters({ from: WalletAddress });
                let votersList = [];
                for (let i = 0; i < totalVoter; i++) {
                    const voterAddress = await Campaign.voterIndex(i, { from: WalletAddress });
                    const Voter = await Campaign.voters(voterAddress, { from: WalletAddress });
                    votersList.push({
                        address: voterAddress,
                        voted: Number(Voter[1]) == 1 ? true : false,
                        candidate: Voter[2],
                    });
                }
//console.log(votersList);
                await setVoters([...votersList]);
            } catch (error) {

            }
        };
        const getDetails = async () => {
            const Campaign = await new ethers.Contract(CampaignAddress, campaign.abi, provider);
            try {
                const campaignName = await Campaign.campaignName({ from: WalletAddress });
                const campaignDescription = await Campaign.campaignDescription({ from: WalletAddress });
                // const campaignStartTime = await Campaign.campaignStartDateTime({ from: WalletAddress });
                // const campaignEndTime = await Campaign.campaignEndDateTime({ from: WalletAddress });
                const campaignStatus = await Campaign.state({ from: WalletAddress });
                let winner = '';
                if (campaignStatus == 2) {
                    winner = await Campaign.finalwinner({ from: WalletAddress });
                    console.log(winner[1]);
                }
                // console.log(campaignName);
                // console.log(campaignDescription);
                // console.log(new Date(Number(campaignStartTime)));
                // console.log(campaignEndTime);
                // console.log(campaignStatus);
                setData({
                    ...data,
                    campaignName: await campaignName,
                    campaignDescription: await campaignDescription,
                    // campaignStartTime: campaignStartTime,
                    // campaignEndTime: campaignEndTime,
                    campaignStatus: await campaignStatus,
                    winner: winner != '' ? winner[0] : 'Not Announced',
                    winnerVoteCount: winner != '' ? Number(winner[1]) : 0,
                });


            } catch (error) {
            }
            getCandidates(Campaign);
            getVoters(Campaign);
        };
        getDetails();
    }, [refresh]);






    return (
        <div className="hero min-h-screen bg-base-200 ">
            <div className="hero-content align-top">
                <div className="max-w-xl">
                    <div className="card bg-base-100">
                        <div className="card-body">
                            <p> Campaign address:{CampaignAddress}</p>
                            <p> Campaign Name: {data.campaignName}</p>
                            <p> Campaign Description: {data.campaignDescription}</p>
                            {/* <p> Campaign StartTime: {data.campaignStartTime}</p> */}
                            {/* <p> Campaign EndTime: {data.campaignEndTime}</p> */}
                            <p> Campaign Status: {Status[data.campaignStatus]}</p>
                            {data.campaignStatus == 0 ? 
                            <button className="btn" onClick={startVoting}>Start Voting</button> : 
                            data.campaignStatus == 1 ? 
                            <button className="btn" onClick={endVoting}>End Voting</button> : null  
                            }

                            {data.campaignStatus == 2 ? 
                            <p> Winner: {data.winner}</p>
                            : null}
                            {data.winnerVoteCount != 0 ?
                                <p> Winner VoteCount: {data.winnerVoteCount}</p>
                                : null
                            }
                            <br></br>

                            <dialog id="addCandidateModal" className="modal modal-bottom sm:modal-middle">
                                <form method="dialog" className="modal-box">
                                    <h3 className="font-bold text-lg">Add Candidate</h3>
                                    <p className="py-4" style={{ whiteSpace: 'break-spaces' }}>Please enter the name of the candidate you want to add.</p>
                                    <input 
                                    type="text" 
                                    placeholder="Candidate Name" 
                                    className="input input-bordered w-full max-w-xs" 
                                    value={addCandidateNamefield}
                                    onChange={(event) =>
                                        setAddCandidateNamefield(event.target.value)
                                    }
                                    />
                                    <div className="modal-action">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn" onClick={addCandidate}>Add</button>
                                    </div>
                                </form>
                            </dialog>
                            {data.campaignStatus == 0 ? <button className="btn" onClick={() => window.addCandidateModal.showModal()}>Add Candidate</button>:null}
                            <p> Candidates:</p>
                            {candidates.length != 0 ?
                                <div className="overflow-x-auto">
                                    <table className="table table-xs table-pin-rows table-pin-cols">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <td>Name</td>
                                                <td>VoteCount</td>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map((candidate, index) => (
                                                <tr>
                                                    <th>{index + 1}</th>
                                                    <td>{candidate.name}</td>
                                                    <td>{candidate.voteCount}</td>
                                                    <th></th>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th></th>
                                                <td></td>
                                                <td></td>
                                                <th></th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                : null}
                            <br></br>
                            <dialog id="addVoterModal" className="modal modal-bottom sm:modal-middle">
                                <form method="dialog" className="modal-box">
                                    <h3 className="font-bold text-lg">Add Voter</h3>
                                    <p className="py-4" style={{ whiteSpace: 'break-spaces' }}>Please enter the address of the voter you want to add.</p>
                                    <input 
                                    type="text" 
                                    placeholder="Voter Address" 
                                    className="input input-bordered w-full max-w-xs" 
                                    value={addVoterAddressfield}
                                    onChange={(event) =>
                                        setAddVoterAddressfield(event.target.value)
                                    }
                                    />
                                    <div className="modal-action">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn" onClick={addVoter}>Add</button>
                                    </div>
                                </form>
                            </dialog>
                            {data.campaignStatus == 0 ? <button className="btn" onClick={() => window.addVoterModal.showModal()}>Add Voter</button> : null}
                            <p> Voters:</p>
                            {voters.length != 0 ?
                                <div className="overflow-x-auto">
                                    <table className="table table-xs table-pin-rows table-pin-cols">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <td>Voter Address</td>
                                                <td>Voted Candidate</td>
                                                <td>Voted</td>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {voters.map((voter, index) => (
                                                <tr>
                                                    <th>{index + 1}</th>
                                                    <td>{voter.address}</td>
                                                    <td>{voter.voted ? "True" : "Not Voted Yet"}</td>
                                                    <td>{voter.candidate}</td>
                                                    <th></th>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th></th>
                                                <td></td>
                                                <td></td>
                                                <th></th>
                                            </tr>
                                        </tfoot>
                                    </table>

                                </div>
                                : null
                            }

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignDetail;