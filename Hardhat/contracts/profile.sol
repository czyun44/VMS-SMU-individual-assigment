// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

/**
 * Author: Chua Zhi Yun
 * Date: 16/07/2023
 *
 */
 contract profile{
    address walletAddress;
    string public name;
    string public email;
    
    constructor(string memory _name, string memory _email){
        //Intitialize owner of contract to yourself
        walletAddress = msg.sender;
        name = _name;
        email = _email; 
    }

    modifier onlyOwner{
        require(msg.sender == walletAddress, "Only ContractOwner can do this.");
        _;
    }

    function setProfile(string memory _name, string memory _email) public
        onlyOwner 
    {
        name = _name;
        email = _email;
    }

    function isOwner() public view returns(bool){
        return msg.sender == walletAddress;
    }

    
 }