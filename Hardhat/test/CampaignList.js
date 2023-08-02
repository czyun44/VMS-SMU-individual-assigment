const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("votercampaignslist", function () {
    async function deploycampaignContract(name, owner) {
        const description = "This is a description";
        const startDateTime = 1620000000;
        const endDateTime = 1620000000;

        const Campaign = await ethers.getContractFactory("votingcampaign");
        const campaign = await Campaign.deploy(name, description, startDateTime, endDateTime);
        return { campaign, name, description, startDateTime, endDateTime };
    }

    it("Should create votercampaignslist contract", async function () {
        // Contracts are deployed using the first signer/account by default
        const [owner, voter1, voter2, voter3] = await ethers.getSigners();

        const VoterCampaignsList = await ethers.getContractFactory("votercampaignlist");
        const voterCampaignsList = await VoterCampaignsList.deploy();
        await voterCampaignsList.waitForDeployment();

        expect(await voterCampaignsList.contractOwner()).to.equal(owner.address);
        expect(await voterCampaignsList.totalVoters()).to.equal(0);
        expect(await voterCampaignsList.totalCampaigns()).to.equal(0);
        expect(await voterCampaignsList.voter_state()).to.equal(0);
    });
    
    it("Voters can join and approved and reject.", async function () {
        const [owner, voter1, voter2, voter3] = await ethers.getSigners();

        const VoterCampaignsList = await ethers.getContractFactory("votercampaignlist");
        const voterCampaignsList = await VoterCampaignsList.deploy();
        await voterCampaignsList.waitForDeployment();

        // Voter join

        // await voterCampaignsList.connect(voter2).voterchange();
        // console.log(await voterCampaignsList["getVoterStatus(address)"](voter2.address));
        // console.log(await voterCampaignsList.connect(voter2).getVoterStatus());
        await voterCampaignsList.connect(voter2).VoterJoin();
        // console.log(await voterCampaignsList.connect(voter2).getVoterStatus());
        // console.log(await voterCampaignsList.totalVoters());
        
        expect(await voterCampaignsList.totalVoters()).to.equal(1);
        expect(await voterCampaignsList["getVoterStatus(address)"](voter2.address)).to.equal(1);

        // Voter approve
        await voterCampaignsList.connect(owner).approvedVoter(voter2.address);
        expect(await voterCampaignsList["getVoterStatus(address)"](voter2.address)).to.equal(2);

        // Voter reject
        await voterCampaignsList.connect(owner).removeVoters(voter2.address);
        expect(await voterCampaignsList["getVoterStatus(address)"](voter2.address)).to.equal(3);
    });
    
    it("Owner can create campaigns and add to the list.", async function () {
        const [owner] = await ethers.getSigners();

        const VoterCampaignsList = await ethers.getContractFactory("votercampaignlist");
        const voterCampaignsList = await VoterCampaignsList.deploy();
        await voterCampaignsList.waitForDeployment();

        const { campaign, name } = await deploycampaignContract("campaign1", owner);
        await voterCampaignsList.connect(owner).addCampaign(await campaign.getAddress());
        expect(await voterCampaignsList.totalCampaigns()).to.equal(1);
        expect(await voterCampaignsList.campaignsId(0)).to.equal(campaign.target);
    });


});

