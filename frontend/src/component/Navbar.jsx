import React, { useContext } from 'react';
import { Web3Context } from '../context/Web3Provider';
import { useVote } from '../hooks/useVote';

function Navbar({onRouteChange, route}) {
    const { account, connectWallet } = useContext(Web3Context);
    const { owner } = useVote();

    const isOwner = owner && account?.toLowerCase() === owner.toLowerCase();


    const truncateAddress = (address) => {
        return address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "Connect Wallet";
    };

    return (
        <div className="p-5 m-3 rounded-xl mt-auto bg-zinc-200">
            <ul className="flex gap-10 items-center">
                {["QuadB", "vote", "leaderboard"].map((item, index) => (
                    <li
                        key={index}
                        onClick={() => onRouteChange(item)}
                        className={`py-2 px-5 rounded-3xl transition-all duration-300 ease-in-out 
                            ${route === item 
                                ? "bg-amber-400"
                                : ""
                            }
                            ${index === 0
                                ? "mr-auto font-bold text-3xl cursor-pointer"
                                : "mx-5 cursor-pointer text-xl hover:bg-amber-400 hover:scale-110 capitalize"
                            }`}
                    >
                        {item}
                    </li>
                ))}

                {account && isOwner && (
                    <li
                        onClick={() => onRouteChange("addCandidate")}
                        className={`mx-5 cursor-pointer text-xl py-2 px-5 rounded-3xl hover:bg-amber-400 hover:scale-110 transition-all duration-300 ease-in-out ${route === "addCandidate" ? "bg-amber-400" : ""}`}
                    >
                        Add Candidate
                    </li>
                )}

                <li
                    onClick={connectWallet}
                    className={`ml-auto font-semibold text-xl text-gray-800 transition-all duration-500 transform scale-100 
                        ${account ? isOwner ? "bg-amber-200 hover:scale-90 " : "hover:scale-90 bg-amber-50 hover:bg-amber-400" : "hover:scale-110 bg-amber-400 hover:bg-amber-50"} 
                        rounded-full px-5 py-3 cursor-pointer min-w-[180px] text-center flex items-center justify-center`}
                >
                    {truncateAddress(account)}
                </li>
            </ul>
        </div>
    );
}

export default Navbar;
