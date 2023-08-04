'use client'
import { useEtherProvider } from "@/context/provider";
import Link from "next/link";

export const NavBar = () => {
    const {LoggedIn, setLoggedIn} = useEtherProvider();
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <Link href={"/"} className="btn btn-ghost normal-case text-xl">VMS</Link>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><Link href={"/Voter"} >Voter</Link></li>
                    <li><Link href={"/Organiser"}>Organiser</Link></li>
                    <li>
                        <Link href={'login'}>{LoggedIn ? "Log out": "Login"}</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};