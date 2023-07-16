// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

/**
 * Author: Chua Zhi Yun
 * Date: 13/07/2023
 *
 */
contract voterContractLists {
    address contractOwner;
    enum VoterStatus { Verification, Approved, Rejected } 
    VoterStatus public voter_state;

    mapping (address=>VoterStatus) voters;
    mapping (uint=>address) votersId;
    uint public totalVoters = 0;

    mapping (uint=>address) campaignsId;
    uint public totalCampaigns = 0;

    constructor(){
        //Intitialize owner of contract to yourself
        contractOwner = msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender == contractOwner, "Only ContractOwner can do this.");
        _;
    }

    modifier onlyVoter{
        require(voters[msg.sender] == VoterStatus.Approved, "You are not eligible to vote.");
        _;
    }

    function VoterJoin() public
    {
        require(
            voters[msg.sender] != VoterStatus.Verification,
            "You have already been added."
        );
        if (voters[msg.sender] != VoterStatus.Rejected && voters[msg.sender] != VoterStatus.Approved){
            voters[msg.sender] = VoterStatus.Verification;
        } else {
            revert("You have already been approved or rejected.");
        }
    }

    function approvedVoter(address _voter) public
        onlyOwner 
    {
        require(
            voters[_voter] == VoterStatus.Verification,
            "The voter has already been added."
        );
        voters[_voter] = VoterStatus.Approved;
    }

    function removeVoters(address _voter) public
        onlyOwner 
    {
        require(
            voters[_voter] == VoterStatus.Approved,
            "The voter has already been removed."
        );
        voters[_voter] = VoterStatus.Rejected;
    }

    function getVoterStatus(address _voter) public view returns (VoterStatus) {
        return voters[_voter];
    }

    function getVoterStatus() public view returns (VoterStatus) {
        return voters[msg.sender];
    }
    
    function addCampaign(address _CampaignContractAddress) public
        onlyOwner
    {
        campaignsId[totalCampaigns] = _CampaignContractAddress;
        totalCampaigns++;
    }
    


}
