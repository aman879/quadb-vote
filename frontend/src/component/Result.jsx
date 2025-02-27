import React from 'react';
import { useVote } from '../hooks/useVote';

function Result() {
  const { candidates } = useVote(); //get candidate data

  const sortedCandidates = candidates ? [...candidates].sort((a, b) => b.voteCount - a.voteCount) : [];

  return (
    <div className="flex flex-col items-center justify-center gap-10 mt-10">
      <h1 className="text-3xl font-bold text-amber-400 uppercase">Leaderboard</h1>

      <div className="w-full max-w-2xl p-5 rounded-2xl shadow-lg">

        <div className="flex justify-between text-amber-50 font-semibold text-lg px-4 py-3 rounded-t-2xl">
          <span className="w-1/3 text-center pr-16">Rank</span>
          <span className="w-1/3 text-center">Candidate</span>
          <span className="w-1/3 text-center pl-16">Votes</span>
        </div>

        <div className="flex flex-col gap-2">
          {sortedCandidates.length > 0 ? (
            sortedCandidates.map((candidate, index) => (
              <div
                key={candidate.id}
                className="flex bg-gray-700 w-full rounded-xl text-2xl items-center justify-center transition-all duration-300 ease-in-out hover:scale-106 mb-2"
              >
                <p className="py-2 px-5 mr-2 bg-amber-50 text-gray-900 font-semibold rounded-xl w-1/4 text-center">
                  {index + 1}
                </p>
                <p className="w-1/2 text-gray-200 text-center">{candidate.name}</p>
                <p className="w-1/4 text-center text-gray-200">{candidate.voteCount}</p>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-400 py-3">No candidates available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Result;
