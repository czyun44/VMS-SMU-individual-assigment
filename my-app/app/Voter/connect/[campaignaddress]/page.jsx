'use client';
import campaign from "@/components/contracts/votingcampaign";
import { ethers } from 'ethers';
import { useEtherProvider } from "@/context/provider";
import { useRouter } from "next/navigation";
import { cache, useEffect, useState } from "react";


const CampaignDetail = ({ params }) => {
    const router = useRouter();
    const CampaignAddress = params.campaignaddress;
    let { provider, WalletAddress, refresh, setRefresh } = useEtherProvider();
    const Status = ['Voting has not started', 'Vote has Started', 'Vote has ended. Winner has been annouced', 'Unknown'];
    const [data, setData] = useState({
        campaignName: '',
        campaignDescription: '',
        campaignStartTime: 0,
        campaignEndTime: 0,
        campaignStatus: 3,
        winner: '',
        winnerVoteCount: 0,
        candidates: [],
    });

    const [candidates, setCandidates] = useState([]);
    const [voters, setVoters] = useState([]);
    const [isLoading, setLoading] = useState(true);
    const [isValidVoter, setValidVoter] = useState(false);
    const [HasVoted, setHasVoted] = useState(false);
    const makeVote = async (name) => {
        const signer = await provider.getSigner();
        const Campaign = await new ethers.Contract(CampaignAddress, campaign.abi, signer);
        try {
            await Campaign.makeVote(name, { from: WalletAddress }).then(
                (result) => { 
                    //alert("Vote has been made successfully");
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

                await setCandidates([...candidatesList]);
            } catch (error) {

            }
        };
        const getVoters = async (Campaign) => {
            try {
                const totalVoter = await Campaign.totalVoters();

                let votersList = [];
                let validVoter = false;
                let hasVoted = false;
                for (let i = 0; i < totalVoter; i++) {
                    const voterAddress = await Campaign.voterIndex(i, { from: WalletAddress });
                    const Voter = await Campaign.voters(voterAddress, { from: WalletAddress });
                    votersList.push({
                        address: voterAddress,
                        voted: Number(Voter[1]) == 1 ? true : false,
                        candidate: Voter[2],
                    });


                    if (await voterAddress == ethers.getAddress(WalletAddress) && Number(Voter[1])==0 ) {
                        validVoter= true;
                    } else if (await voterAddress == ethers.getAddress(WalletAddress) && Number(Voter[1])==1 ) {
                        hasVoted = true;
                    }
                }
                setHasVoted(hasVoted)
                setValidVoter(validVoter);
                await setVoters([...votersList]);
            } catch (error) {
                // alert(error.message);
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
// console.log(winner[1]);
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
            await getCandidates(Campaign);
            await getVoters(Campaign);
        };
        getDetails();
    }, [refresh, WalletAddress, CampaignAddress, provider, data]);

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
                            {/* <p>WalletAddress: {WalletAddress}</p> */}
                            {data.campaignStatus == 2 ? 
                            <p> Winner: {data.winner}</p>
                            : null}
                            {data.winnerVoteCount != 0 ?
                                <p> Winner VoteCount: {data.winnerVoteCount}</p>
                                : null
                            }
                            <br></br>
                            {isValidVoter 
                            ? 
                            <p>You can only vote once.</p>
                            : 
                            HasVoted 
                            ? 
                            <p>You have voted.</p>
                            :
                            data.campaignStatus != 2 ?
                            <p>You are not allowed to vote.</p>
                            :null
                            }
                            <p> Candidates:</p>
                            {candidates.length != 0 ?
                                <div className="overflow-x-auto">
                                    <table className="table table-xs table-pin-rows table-pin-cols">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <td>Name</td>
                                                {data.campaignStatus == 2 ?<td>VoteCount</td>:null}
                                                {data.campaignStatus == 1 ?<td>Click the appropriate button.</td>:null}
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {candidates.map((candidate, index) => (
                                                <tr key={candidate.name}>
                                                    <th>{index + 1}</th>
                                                    <td>{candidate.name}</td>
                                                    {data.campaignStatus == 2 ? <td>{candidate.voteCount}</td> : null}
                                                    {data.campaignStatus == 1 ? isValidVoter ?
                                                    <td>
                                                        <button class="btn btn-primary" onClick={()=> makeVote(candidate.name)}>Vote</button>
                                                    </td>
                                                    :null
                                                    :null}
                                                    <th></th>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th></th>
                                                <td></td>
                                                {data.campaignStatus == 2 ? <td></td>: null}
                                                {data.campaignStatus == 1 ? <th></th>: null}
                                                <th></th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                                : null}
                            <br></br>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CampaignDetail;