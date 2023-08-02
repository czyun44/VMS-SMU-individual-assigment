// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

/**
 * Author: Chua Zhi Yun
 * Date: 13/07/2023
 *
 */
contract votercampaignlist {
    address public contractOwner;
    enum VoterStatus { Unjoined, Verification, Approved, Rejected } 
    VoterStatus public voter_state;

    mapping (address=>VoterStatus) voters;
    mapping (uint=>address) votersId;
    uint public totalVoters = 0;

    mapping (uint=>address) public campaignsId;
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

    // //test
    // function voterchange() public 
    // {
    //     voters[msg.sender] = VoterStatus.Verification;
    // }

    function VoterJoin() public
    {
        require(
            voters[msg.sender] == VoterStatus.Unjoined,
            "You have already been added."
        );
        if (voters[msg.sender] != VoterStatus.Rejected && voters[msg.sender] != VoterStatus.Approved){
            voters[msg.sender] = VoterStatus.Verification;
            votersId[totalVoters] = msg.sender;
            totalVoters++;
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
        if (voters[_voter] != VoterStatus.Rejected){
            voters[_voter] = VoterStatus.Rejected;
        } else {
            revert("The voter has already been rejected.");
        }
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
