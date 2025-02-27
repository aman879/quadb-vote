import React from 'react';

function Home({onRouteChange}) {
    const content = "Experience secure and transparent voting with blockchain";

    return (
        <div className="flex items-center justify-center p-5 rounded-2xl">
            <div className="flex flex-col text-center text-6xl rounded-2xl p-5 px-10 m-5">
                {content.split(" ").map((word, index) => (
                    <h1 
                        key={index} 
                        className={`capitalize transition-all duration-300 leading-17 font-bold ${
                            index % 2 !== 0 ? "text-amber-400 transition-all duration-300 transform scale-90 hover:scale-100 cursor-pointer" : "text-white"
                        }`}
                    >
                        {word}
                    </h1>
                ))}
            </div>

            <div className="w-[4px] h-32 bg-gray-400 rounded-lg mx-5"></div>

            <div className="bg-amber-400 ml-10 text-4xl p-5 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-100">
                <button 
                    onClick={() => onRouteChange("vote")}
                    className="cursor-pointer font-medium text-white transition-all duration-300 transform scale-100 hover:scale-110  px-5 py-3">
                    Explore Voting
                </button>
            </div>
        </div>
    );
}

export default Home;
