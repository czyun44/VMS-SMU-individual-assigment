'use client'
import { useEtherProvider } from "@/context/provider";

export const NavBar = () => {
    const {LoggedIn, setLoggedIn} = useEtherProvider();
    return (
        <div className="navbar bg-base-100">
            <div className="flex-1">
                <a href="/" className="btn btn-ghost normal-case text-xl">VMS</a>
            </div>
            <div className="flex-none">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Link</a></li>
                    <li>
                        <details>
                            <summary>
                                Parent
                            </summary>
                            <ul className="p-2 bg-base-100">
                                <li><a>Link 1</a></li>
                                <li><a>Link 2</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <a href="login">{LoggedIn ? "Log out": "Login"}</a>
                    </li>
                </ul>
            </div>
        </div>
    );
};