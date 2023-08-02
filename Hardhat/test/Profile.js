const { loadFixture } = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("profile", function () {
    async function deployContract() {
        const name = "profile";
        const email = "test@gmail.com";

        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();

        const Profile = await ethers.getContractFactory("profile");
        const profile = await Profile.deploy(name, email);
        await profile.waitForDeployment();

        return { profile, name, email };
    }

    it("Should set the right name ", async function () {
        const { profile, name, email } = await loadFixture(deployContract);
        expect(await profile.name()).to.equal(name);
        
    });
    it("Should set the right email ", async function () {
        const { profile, name, email } = await loadFixture(deployContract);
        expect(await profile.email()).to.equal(email);
    });
    
    it("Should change the profile", async function () {
        const { profile, name, email } = await loadFixture(deployContract);
        const newName = "newName";
        const newEmail = "newEmail@yahoo.com";
        await profile.setProfile(newName, newEmail);
        expect(await profile.name()).to.equal(newName);
        expect(await profile.email()).to.equal(newEmail);
    }
    );
});