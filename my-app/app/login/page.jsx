'use client'
import { useEtherProvider } from '@/context/provider';
import { useState } from 'react';
import { ethers } from 'ethers';
import profile from '../../components/contracts/profile';
import { useRouter } from 'next/navigation';

const ProfileABI = profile.abi;
const Profilebytecode = profile.bytecode;

const Login = () => {
    const router = useRouter();
    let {provider, WalletAddress, setLoggedIn, profileAddress, setProfileAddress} = useEtherProvider();

    const handleProfile = async () => {
        const ProfileContract = await new ethers.Contract(profileAddress, profile.abi, provider);
        console.log(await ProfileContract.isOwner({from: WalletAddress}));
        console.log(await WalletAddress);
        if (await ProfileContract.isOwner({from: WalletAddress})) {
            setLoggedIn(true);
            router.push('/');
        }
    };
    return (
        <div className="container mx-auto flex">
            <div className="w-full"></div>
            <div className=" form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">What is your profile address?</span>
                    
                </label>
                
                <input 
                type="text" 
                value={profileAddress}
                onChange={(event) => 
                    setProfileAddress(event.target.value)
                }
                placeholder="0x121...." 
                className="input input-bordered w-full max-w-xs" />
                {/* <label className="label">
                    <span className="label-text-alt">Bottom Left label</span>
                </label> */}
                <button className="btn" onClick={handleProfile}>Login</button>
                <button className="btn" onClick={handleProfile}>Sign up</button>
            </div>
            <div className="w-full"></div>
        </div>
    );
};

export default Login;