import { ethers } from "ethers";
import { Web3Context } from "../context/Web3Provider";
import { useCallback, useContext, useEffect, useState } from "react";
import { address, abi } from "../contract/contract.json";
import { toast } from "react-toastify";

const VOTE_CONTRACT_ADDRESS = address;  // Store the contract address
const VOTE_ABI = abi;  // Store the contract ABI

// Custom hook to interact with the voting smart contract
export const useVote = () => {
    const { provider, account } = useContext(Web3Context);  // Get the provider and user account from Web3 context
    const [contract, setContract] = useState(null);  // State to store the contract instance
    const [candidates, setCandidates] = useState([]);  // State to store the list of candidates
    const [owner, setOwner] = useState(null);  // State to store the contract owner
    const [isRegistered, setIsRegistered] = useState(false);  // State to check if the user is registered
    const [hasVoted, setHasVoted] = useState(false);  // State to check if the user has voted

    // Set up the contract instance when the provider is available
    useEffect(() => {
        const setupContract = async () => {
            if (provider) {
                const signer = await provider.getSigner();
                const voteContract = new ethers.Contract(VOTE_CONTRACT_ADDRESS, VOTE_ABI, signer);
                setContract(voteContract);
            }
        };
        setupContract();
    }, [provider]);

    // Fetch contract owner
    const fetchOwner = useCallback(async () => {
        if (!contract) return;
        try {
            const owner = await contract.getOwner();
            setOwner(owner);
        } catch (e) {
            toast.error("Error fetching owner:", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        }
    }, [contract]);

    // Fetch the list of candidates from the contract
    const fetchCandidates = useCallback(async () => {
        if (!contract) return;
        try {
            const numCand = await contract.numberOfCandidates();
            const candList = [];
            for (let i = 0; i < numCand; i++) {
                const candidate = await contract.candidatesById(i);
                candList.push({
                    id: candidate.id.toString(),
                    addr: candidate.addr,
                    name: candidate.name,
                    voteCount: candidate.voteCount.toString(),
                });
            }
            setCandidates(candList);
        } catch (e) {
            toast.error("Error fetching candidates:", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        }
    }, [contract]);

    // Check if the user is registered as a voter
    const checkRegistration = useCallback(async () => {
        if (!contract || !account) return;
        try {
            const registered = await contract.registeredVoters(account);
            setIsRegistered(registered);
        } catch (e) {
            toast.error("Error checking registration:", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        }
    }, [contract, account]);

    // Check if the user has already voted
    const checkHasVoted = useCallback(async () => {
        if (!contract || !account) return;
        try {
            const isVoted = await contract.hasVoted(account);
            setHasVoted(isVoted);
        } catch (e) {
            toast.error("Error checking if user voted:", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        }
    }, [contract, account]);

    // Function to add a new candidate
    const addCandidate = async (_name, _addr) => {
        if (!contract) return;
        try {
            const tx = await contract.addCandidate(_name, _addr);
            await tx.wait();  // Wait for the transaction to be confirmed

            toast.success("Candidate added successfully", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });

            await fetchCandidates(); // Refresh the candidate list
        } catch (e) {
            toast.error(`Error adding candidate: ${e}`, {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
            console.log(e);
        }
    };

    // Function to register the user as a voter
    const registerVoter = async () => {
        if (!contract) return;
        try {
            const tx = await contract.registerVoter();
            await tx.wait();

            toast.success("Successfully registered!", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
            setIsRegistered(true);  // Update state to indicate registration
        } catch (e) {
            toast.error(`Registration failed: ${e}`, {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        }
    };

    // Function to vote for a candidate
    const vote = async (candidateId) => {
        if (!contract) return;
        try {
            const tx = await contract.vote(candidateId);
            await tx.wait();
            setHasVoted(true);  // Mark user as voted
            await fetchCandidates();  // Refresh candidate list
            await checkHasVoted();  // Check user's voting status

            toast.success("Voted!!", {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        } catch (e) {
            toast.error(`Voting failed:${e}`, {
                position: "top-right",
                pauseOnFocusLoss: false,
                pauseOnHover: false,
            });
        }
    };

    // Fetch necessary contract details when the contract is set or the account changes
    useEffect(() => {
        if (contract) {
            fetchOwner();
            fetchCandidates();
            checkRegistration();
            checkHasVoted();
        }
    }, [contract, account, fetchOwner, fetchCandidates, checkRegistration, checkHasVoted]);

    return { candidates, owner, isRegistered, hasVoted, registerVoter, addCandidate, vote };
};
