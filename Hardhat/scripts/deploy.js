const { ethers } = require("hardhat");

async function addCandidate(campaign) {
    const candidateNameList = ["Bob", "James"]
    for (let i = 0; i < candidateNameList.length; i++) {
        await campaign.addCandidate(candidateNameList[i]);
    }
    return candidateNameList;
}

async function addVoter(campaign) {
    const [owner , ...tempVoterList] = await ethers.getSigners();
    const voterList = [];
    for (let i = 0; i < 4; i++) {
        await campaign.addVoters(tempVoterList[i].address);
        voterList.push(tempVoterList[i]);
    }
    // console.log(voterList);
    return voterList;
}

async function vote(campaign, voterList, candidateNameList) {
    for (let i = 0; i < voterList.length; i++) {
        const voter = voterList[i];
        const candidate = candidateNameList[i];
        await campaign.connect(voter).makeVote(candidate);
    }
}

async function deployCampaignContract() {
    const name = "campaign";
    const description = "This is a description";
    const startDateTime = 1620000000;
    const endDateTime = 1620000000;

    // Contracts are deployed using the first signer/account by default
    const [owner, voter1, voter2, voter3] = await ethers.getSigners();

    const Campaign = await ethers.getContractFactory("votingcampaign");
    const campaign = await Campaign.deploy(name, description, startDateTime, endDateTime);
    await campaign.waitForDeployment();
    const candidateNameList = await addCandidate(campaign);
    // const voterList = await addVoter(campaign);
    // await campaign.beginVoting();

    // // vote first voter
    // let voter = voterList[0];
    // let candidate = candidateNameList[0];
    // await campaign.connect(voter).makeVote(candidate);

    // // vote second voter, 3 votes winner
    // candidate = candidateNameList[1];
    // for (let i = 1; i < 4; i++) {
    //     voter = voterList[i];
    //     await campaign.connect(voter).makeVote(candidate);
    // }

    // await campaign.stopVote();

    return { campaign, name, description, startDateTime, endDateTime };

}

async function deployProfileContract() {
    const name = "profile";
    const email = "test@gmail.com";

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Profile = await ethers.getContractFactory("profile");
    const profile = await Profile.deploy(name, email);
    await profile.waitForDeployment();

    return { profile, name, email };
}
async function main() {
    const { campaign, name, description, startDateTime, endDateTime } = await deployCampaignContract();
    console.log("campaignName: ", await campaign.campaignName());
    console.log("contract: ", await campaign.target);

    const { profile, name1, email } = await deployProfileContract();
    console.log("profileName: ", await profile.name());
    console.log("contract: ", await profile.target);
}

// Call the main function and catch if there is any error
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });