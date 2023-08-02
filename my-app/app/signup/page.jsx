'use client'
import { useEtherProvider } from '@/context/provider';
import { useState } from 'react';
import { ethers } from 'ethers';
import profile from '../../components/contracts/profile';
import { useRouter } from 'next/navigation';
import { deployContract } from '@/components/ethers/ContractMethods';

const ProfileABI = profile.abi;
const Profilebytecode = profile.bytecode;

const Signup = () => {
    const router = useRouter();
    let { provider, WalletAddress, setLoggedIn, profileAddress, setProfileAddress } = useEtherProvider();
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [modal, setModal] = useState({
        title: "Hello!",
        content: "Press ESC key or click the button below to close",
        action: "Close"
    });
    const handleProfile = async () => {
        const ProfileParameters = [name, email];
        const ProfileContract = await deployContract(profile.abi, profile.bytecode, ProfileParameters, provider);
        console.log(await ProfileContract.target);
        setModal({
            title: "Success! Your profile address is:",
            content: "Contract Address: " + await ProfileContract.target 
            + '\n\n' + "Please keep this address for future login!",
            action: "Back to Login",
            actionFunction: () => {
                router.push('/login');
            }
        });
        window.my_modal_5.showModal()
        // if (await ProfileContract.isOwner({from: WalletAddress})) {
        //     setLoggedIn(true);
        //     router.push('/');
        // }
    };
    return (
        <div className="container mx-auto flex">
            <button className="btn" onClick={()=>window.my_modal_5.showModal()}>open modal</button>
            <div className="w-full">
                <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
                    <form method="dialog" className="modal-box">
                        <h3 className="font-bold text-lg">{modal.title}</h3>
                        <p className="py-4" style={{ whiteSpace: 'break-spaces' }}>{modal.content}</p>
                        <div className="modal-action">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn" onClick={modal.actionFunction}>{modal.action}</button>
                        </div>
                    </form>
                </dialog>
            </div>
            <div className=" form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">What is your name?</span>
                </label>
                <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    placeholder=""
                    className="input input-bordered w-full max-w-xs" />

                <label className="label">
                    <span className="label-text">What is your email?</span>
                </label>
                <input
                    type="text"
                    value={email}
                    onChange={(event) =>
                        setEmail(event.target.value)
                    }
                    placeholder=""
                    className="input input-bordered w-full max-w-xs" />
                {/* <label className="label">
                    <span className="label-text-alt">Bottom Left label</span>
                </label> */}
                <button className="btn" onClick={handleProfile}>Sign up</button>
            </div>
            <div className="w-full"></div>
        </div>
    );
};

export default Signup;