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
    let { provider, WalletAddress, setLoggedIn, profileAddress, setProfileAddress } = useEtherProvider();

    const handleProfile = async () => {
        const ProfileContract = await new ethers.Contract(profileAddress, profile.abi, provider);
        console.log(await ProfileContract.isOwner({ from: WalletAddress }));
        console.log(await WalletAddress);
        if (await ProfileContract.isOwner({ from: WalletAddress })) {
            setLoggedIn(true);
            router.push('/');
        }
    };

    const handleSignup = async () => {
        router.push('/signup');
    };
    return (
        <div className="">
            <div className="hero min-h-screen bg-base-200">
                <div className="hero-content flex-col lg:flex-row">
                    <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <div className="card-body">
                            <div className="form-control">
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

                            </div>
                            <div className="form-control mt-6">
                                <button className="btn" onClick={handleProfile}>Login</button>
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn" onClick={handleSignup}>Sign up</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;