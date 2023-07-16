// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.8.18;

/**
 * Author: Chua Zhi Yun
 * Date: 16/07/2023
 *
 */
 contract profile{
    address walletAddress;
    string name;
    string email;
    string phone;
    
    constructor(string memory _name, string memory _email, string memory _phone){
        //Intitialize owner of contract to yourself
        walletAddress = msg.sender;
        name = _name;
        email = _email;
        phone = _phone;
    }

    modifier onlyOwner{
        require(msg.sender == walletAddress, "Only ContractOwner can do this.");
        _;
    }

    function setProfile(string memory _name, string memory _email, string memory _phone) public
        onlyOwner 
    {
        name = _name;
        email = _email;
        phone = _phone;
    }

    
 }