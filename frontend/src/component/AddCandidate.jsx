import React, { useState } from 'react';
import { useVote } from '../hooks/useVote';
import { toast } from 'react-toastify';

function AddCandidate() {
    const { addCandidate } = useVote();
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name || !address) {
            alert("Please fill in both fields!");
            return;
        }

        toast.info("Candidate tx submitted", {
            position: "top-right",
            pauseOnFocusLoss: false,
            pauseOnHover: false,
        });

        setLoading(true);

        await addCandidate(name, address);

        setLoading(false);
        setName('');
        setAddress('');
    };

    return (
        <div className='flex flex-col items-center justify-center gap-10 mt-10'>
            <div className="flex flex-col items-center p-5 bg-gray-800 w-1/2 h-[450px] rounded-2xl text-white shadow-2xl shadow-amber-100">
                <h1 className="text-3xl font-bold uppercase text-gray-200">Add Candidates</h1>
                <div className="flex flex-col gap-10 items-center justify-center w-full h-full">

                    <div className="flex bg-gray-700 w-1/2 rounded-xl text-2xl">
                        <p className="py-2 px-5 mr-2 bg-amber-50 text-gray-900 font-semibold rounded-xl">Name</p>
                        <input
                            type="text"
                            value={name}
                            placeholder='Enter candidate name'
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-transparent text-gray-200 focus:outline-none"
                            disabled={loading}
                        />
                    </div>

                    <div className="flex bg-gray-700 w-[700px] rounded-xl text-2xl">
                        <p className="py-2 px-5 mr-2 bg-amber-50 text-gray-900 font-semibold rounded-xl capitalize">Address</p>
                        <input
                            type="text"
                            value={address}
                            placeholder='Enter candidate address'
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full bg-transparent text-gray-200 focus:outline-none"
                            disabled={loading}
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className={`text-2xl px-5 py-2 font-semibold rounded-3xl transition-all duration-500 transform scale-100 hover:scale-110 ${
                            loading 
                                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                : 'bg-amber-500 text-gray-900 hover:bg-amber-300 cursor-pointer'
                        }`}
                    >
                        {loading ? 'Submitting...' : 'Submit'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AddCandidate;
