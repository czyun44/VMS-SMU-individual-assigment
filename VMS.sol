// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

/** 
 * Author: Chua Zhi Yun
 * Date: 18/06/2023
 * 
 */
 contract VMS {
    address contractOwner;

    struct Voter {
        bool isValid;  // if true, this person is suitable to vote candidate
        bool voted;  // if true, that person already voted
        string  candidate;
    }

    mapping(address => Voter) public voters;

    struct Candidate {
        bool isValid; 
        uint voteCount;  // if true, that person already voted
    }
    mapping(string => Candidate) public candidates;
    mapping (uint => string) public candidateIndex;
    uint public totalcandidates = 0; 

    enum State { Initiated, VoteStarted, VoteEnded} State public state;
    string private winner;

    constructor(){
        //Intitialize owner of contract to yourself
        contractOwner = msg.sender;
    }

    modifier inState(State _state) {
		require(state == _state,"You cannot do this on this state.");
		_;
	}

    modifier onlyOwner{
        require(msg.sender == contractOwner, "Only ContractOwner can do this.");
        _;
    }

    modifier onlyVoter{
        require(voters[msg.sender].isValid, "You are not eligible to vote.");
        _;
    }

    function addVoters(address _voter) public
        onlyOwner 
        inState(State.Initiated)
    {
        require(
            !voters[_voter].isValid,
            "The voter has already been added."
        );
        voters[_voter].isValid = true;
    }

    function addCandidate(string memory _candidateName) public
        onlyOwner 
        inState(State.Initiated)
    {
        require(!candidates[_candidateName].isValid, "The candidate has already been added"); //If there exists a name in the list, this will be true but it will say false because of the !
        candidates[_candidateName].isValid = true;
        candidates[_candidateName].voteCount = 0;
        candidateIndex[totalcandidates] = _candidateName;
        totalcandidates++;
    }

    function beginVoting() public 
        onlyOwner 
        inState(State.Initiated)
    {
        state = State.VoteStarted;
    }

    function makeVote(string memory _candidateName) public 
        onlyVoter
        inState(State.VoteStarted)
    {
        require(!voters[msg.sender].voted, "You can only vote once");
        require(candidates[_candidateName].isValid, "Invalid Candidate.");
        candidates[_candidateName].voteCount++;
        voters[msg.sender].voted = true;
        voters[msg.sender].candidate = _candidateName;
    }

    function stopVote() public 
        onlyOwner
        inState(State.VoteStarted)
    {
        state = State.VoteEnded;

        string memory highest = candidateIndex[0];
        for (uint p = 1; p < totalcandidates; p++) {
            if(candidates[candidateIndex[p]].voteCount > candidates[highest].voteCount){
                highest = candidateIndex[p];
            }
        }

        winner = highest;
    }
    
    function finalwinner() public view
        returns(string memory winnername_, uint voteCount_)
    {
        winnername_ = winner;
        voteCount_ = candidates[winner].voteCount;
    }
    
}