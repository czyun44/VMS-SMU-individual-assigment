const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("campaign", function () {
    async function deployContract() {
        const name = "campaign";
        const description = "This is a description";
        const startDateTime = 1620000000;
        const endDateTime = 1620000000;

        // Contracts are deployed using the first signer/account by default
        const [owner, voter1, voter2, voter3] = await ethers.getSigners();

        const Campaign = await ethers.getContractFactory("votingcampaign");
        const campaign = await Campaign.deploy(name, description, startDateTime, endDateTime);
        await campaign.waitForDeployment();
        return { campaign, name, description, startDateTime, endDateTime };
    }
    it ("Should set the right variable", async function () {
        const { campaign, name, description, startDateTime, endDateTime } = await loadFixture(deployContract);
        expect(await campaign.campaignName()).to.equal(name);
        expect(await campaign.campaignDescription()).to.equal(description);
        expect(await campaign.campaignStartDateTime()).to.equal(startDateTime);
        expect(await campaign.campaignEndDateTime()).to.equal(endDateTime);
    });

    async function addCandidate(campaign) {
        const candidateNameList = ["candidate1", "candidate2", "candidate3", "candidate4", "candidate5"]
        for (let i = 0; i < candidateNameList.length; i++) {
            await campaign.addCandidate(candidateNameList[i]);
        }
        return candidateNameList;
    }

    it ("Should add 5 candidate", async function () {
        const { campaign, name, description, startDateTime, endDateTime } = await loadFixture(deployContract);
        const candidateNameList = await addCandidate(campaign);
        for (let i = 0; i < candidateNameList.length; i++) {
            const candidate = candidateNameList[i];
            expect(await campaign.candidateIndex(i)).to.equal(candidate);
            const candidateInfo = await campaign.candidates(candidate);
            expect(candidateInfo.isValid).to.equal(true);
            expect(candidateInfo.voteCount).to.equal(0);
        }
    });

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
    it ("Should add 4 voter", async function () {
        const { campaign, name, description, startDateTime, endDateTime } = await loadFixture(deployContract);
        const candidateNameList = await addCandidate(campaign);
        const voterList = await addVoter(campaign);
        
        
        for (let i = 0; i < voterList.length; i++) {
            const voter = voterList[i].address;
            const voterInfo = await campaign.voters(voter);
            expect(voterInfo.isValid).to.equal(true);
            expect(voterInfo.voted).to.equal(false);
            expect(voterInfo.candidate).to.equal('');
        }

        // check if for failed voter
        const [owner] = await ethers.getSigners();
        // console.log(owner.address);
        const voterInfo = await campaign.voters(owner.address);
        expect(voterInfo.isValid).to.equal(false);
        expect(voterInfo.voted).to.equal(false);
        expect(voterInfo.candidate).to.equal('');
    });

    async function vote(campaign, voterList, candidateNameList) {
        for (let i = 0; i < voterList.length; i++) {
            const voter = voterList[i];
            const candidate = candidateNameList[i];
            await campaign.connect(voter).makeVote(candidate);
        }
    }

    it ("Begin voting, Should vote for 4 voter", async function () {
        const { campaign, name, description, startDateTime, endDateTime } = await loadFixture(deployContract);
        const candidateNameList = await addCandidate(campaign);
        const voterList = await addVoter(campaign);
        await campaign.beginVoting();
        await vote(campaign, voterList, candidateNameList);
        for (let i = 0; i < voterList.length; i++) {
            const voter = voterList[i];
            const candidate = candidateNameList[i];
            const voterInfo = await campaign.voters(voter);
            expect(voterInfo.isValid).to.equal(true);
            expect(voterInfo.voted).to.equal(true);
            expect(voterInfo.candidate).to.equal(candidate);
        }
    });

    it ("End voting, Should vote for 2 voter with 1 winner", async function () {
        const { campaign, name, description, startDateTime, endDateTime } = await loadFixture(deployContract);
        const candidateNameList = await addCandidate(campaign);
        const voterList = await addVoter(campaign);
        await campaign.beginVoting();

        // vote first voter
        let voter = voterList[0];
        let candidate = candidateNameList[0];
        await campaign.connect(voter).makeVote(candidate);

        // vote second voter, 3 votes winner
        candidate = candidateNameList[1];
        for (let i = 1; i < 4; i++) {
            voter = voterList[i];
            await campaign.connect(voter).makeVote(candidate);
        }

        await   campaign.stopVote();
        for (let i = 0; i < voterList.length; i++) {
            const voter = voterList[i];
            const voterInfo = await campaign.voters(voter);
            expect(voterInfo.isValid).to.equal(true);
            expect(voterInfo.voted).to.equal(true);
        }
        const result = await campaign.finalwinner();
        expect(result.winnername_).to.equal(candidate);
        expect(result.voteCount_).to.equal(3);
        expect(await campaign.state()).to.equal(2);
    });




});
