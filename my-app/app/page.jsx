import Link from "next/link";
export default function Home() {
    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Hello there</h1>
                    <p className="py-6">Welcome to VMS.</p>
                    <p className="py-6">Please select the following that best describe you: </p>
                    <div className="flex w-full">
                        <div className="grid h-20 flex-grow place-items-center">
                            <Link className="btn btn-primary" href = 'Voter' >For Voter</Link>
                        </div>
                        <div className="divider divider-horizontal">OR</div>
                        <div className="grid h-20 flex-grow place-items-center">
                            <Link className="btn btn-secondary" href="Organiser">For Organiser</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};