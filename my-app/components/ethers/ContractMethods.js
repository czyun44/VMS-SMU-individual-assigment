import { ethers, formatEther } from "ethers";


export const deployContract = async (ABI, Bytecode, parameters, provider) => {
    if (provider) {
        const signer = await provider.getSigner();
        const ContractFactory = await new ethers.ContractFactory(ABI, Bytecode, signer);
        const deployedContract = await ContractFactory.deploy(...parameters);
        await deployedContract.waitForDeployment();
//console.log("Contract deployed to: ", await deployedContract.target);
        return await deployedContract;
    }
};

export const EditContract = async (ABI, Bytecode, parameters, provider, methodName) => {
    if (provider){
        const signer = await provider.getSigner();
        const ContractFactory = await new ethers.BaseContract(ABI, Bytecode, signer);
        const deployedContract = await ContractFactory.attach(address);
    }
};