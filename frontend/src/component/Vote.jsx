import React, { useState } from 'react';
import { useVote } from '../hooks/useVote';

function Vote() {
  const { candidates, isRegistered, hasVoted, registerVoter, vote } = useVote();
  const [loadingRegister, setLoadingRegister] = useState(false);
  const [loadingVote, setLoadingVote] = useState(false);

  const truncateAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`;

  const handleRegister = async () => {
    if (hasVoted) return; // Prevent register if already voted
    setLoadingRegister(true); // for loading when regitering
    await registerVoter();
    setLoadingRegister(false);
  };
  
  const handleVote = async (candidateId) => {
    setLoadingVote(true); // for loading when voting
    await vote(candidateId);
    setLoadingVote(false);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-10">
      <h1 className="text-3xl font-bold text-amber-400 uppercase">Candidates</h1>

      <button
        onClick={handleRegister}
        disabled={loadingRegister || hasVoted}
        className={`bg-amber-500 text-gray-900 font-semibold px-6 py-2 rounded-3xl transition-all ${loadingRegister || hasVoted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-300 cursor-pointer'
          }`}
      >
        {hasVoted ? 'Already Voted' : loadingRegister ? 'Registering...' : 'Register as a Voter'}
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {candidates && candidates.length > 0 ? (
          candidates.map((candidate) => (
            <div
              key={candidate.id}
              className="bg-gray-800 text-white p-5 rounded-2xl shadow-lg w-[300px] flex flex-col items-center"
            >
              <h2 className="text-2xl font-bold text-amber-300">{candidate.name}</h2>
              <p className="text-lg mt-2">
                <span className="font-semibold">Address:</span>{' '}
                <span className="text-gray-400">{truncateAddress(candidate.addr)}</span>
              </p>

              {isRegistered && !hasVoted && (
                <button
                  onClick={() => handleVote(candidate.id)}
                  disabled={loadingVote}
                  className={`mt-3 bg-amber-500 text-gray-900 font-semibold px-5 py-2 rounded-3xl transition-all cursor-pointer ${loadingVote ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-300'
                    }`}
                >
                  {loadingVote ? 'Voting...' : 'Vote'}
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-xl">No candidates available</p>
        )}
      </div>
    </div>
  );
}

export default Vote;
