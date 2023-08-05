# Voting Management System v2.0.0

## Description
A voting management system that enables users to vote for their favorite candidate in an election. 
The smart contract would handle vote casting, tallying, and result reporting.
Features: 
- Add specified Voters 
- Vote Casting
- Vote Start and end state
- vote Tallying


**Project Requirements:**
Your project should meet the following requirements:

1. Use Solidity to create a smart contract that demonstrates the use of variables, functions, and events.
2. Use Remix to compile and deploy your smart contract to a test network such as Goerli or Sepolia.
3. **Optional:** Compile and deploy your smart contract using Hardhat.
4. Write a detailed README file that explains how to deploy and test your smart contract and includes a description of your project and any relevant information.

**Prerequisite:**
Check that you have Metamask installed and have Goerli or Sepolia test network setup. You need to have 2 or more account to testrun.
Ensure that you have sufficient funds on the multiple wallet accounts to deploy the contract. 

## Using Remix Etheruem to compile and deploy
I will be going through the process of compile the smart contract and deploy the smart contracts on the remix ethereum. 

**Compile on Remix:**

1. Go to https://remix.ethereum.org/
2. Go to File Explorer on remix and upload and open up VMS.sol found in this repository.
3. On the left side menu, look for the **Solidity Compiler** icon and navigate to it.
4. Ensure that the compiler version is *0.8.18*. 
5. Click the **Compile VMS.sol** button to compile the contract.

**Deploy contract on Remix:**

1. On the left side menu, look for the **Deploy & run transactions** icon and navigate to it.
2. Change the environment to *Injected Provider - MetaMask*.
3. Click Next and then Connect on the prompt by the MetaMask.
4. Next, check that you have at least 3 accounts to test run and you are on Sepolia or Goerli Testnet. 
5. Check that the contract is VMS
6. Click the deploy button. Note of the current account on Metamask, it will be the **contractOwner**.  

**Test run contract(Votingcampaign.sol):**
Do note for each step, if there is a prompt by the MetaMask, make sure you confirm the transaction by clicking the confirm button. 

1. Keep a lookout for the contract that you deployed.
2. Now that the contract has been deployed, you can start adding candidates by 
   - Write the candidate name at field beside the **addCandidate** Button. 
   - Click **addCandidate** to add. 
   - Repeat the steps for other candidates.
   - Check that the total no. of candidates is correct by looking at the **totalcandidate** button. 
3. Next, we will add the voters that are eligible to vote. 
   - Find out and take note of the wallet address of the voters that are going to vote in this contract. 
   - Copy and paste the wallet address of the first voter at the field beside **addVoters** button.
   - Click **addVoters** to add.
   - Repeat the steps for other voters. 
   - Check that the voters are valid by entering the wallet address of that voter in the field beside the **voters** button. 
4. Now that candidates and voters are added, we begin the voting by clicking **beginVoting** button.
    - Do note that once voting starts, contract owner are not allowed to add candidates or voters.

5. We will simulate the voting process by the voters. 
   - Change to the wallet of the first voter via the MetaMask, connect if prompted. 
   - Enter the name of the voters at the field beside the **makeVote** button.
   - Click **makeVote** to vote.
   - Repeat the steps for the rest of the voters. 
   - Do note that voters are only allowed to vote once. An error will be prompted if they try to vote again. 
   - Do also note that other accounts that are not specified by the contractOwner will not be able to vote as well.

6. Once voting is completed, switch back to the contractOwner wallet and stop the voting by clicking the **stopVote** button.
    - Do note that once voting stops, voters are not allowed to vote.

7. Click the **finalwinner** button to display the name of the winner. You can also find how many votes he has in this field.

## License
GNU GENERAL PUBLIC LICENSE
