// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Vote {
    /**
     * @title Voting Contract
     * @notice A simple voting contract where an owner can add candidates, 
     *         voters can register, and registered voters can cast a vote.
     */

    /// @notice Structure to store candidate data
    struct Candidate {
        uint256 id;         /// Candidate's ID
        address addr;       /// Candidate's wallet address
        string name;        /// Candidate's name
        uint256 voteCount;  /// Total votes received
    }

    address private owner;      /// Address of the contract owner
    uint256 public numberOfCandidates;  /// Total number of candidates registered

    /// @notice Event emitted when owner change the owner of contract
    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    
    /// @notice Event emitted when a voter registers successfully
    event VoterRegistered(address indexed voter);
    
    /// @notice Event emitted when a voter vote
    event Voted(address indexed voter, address indexed candidate);

    // **Mappings for contract data storage**
    
    /// @notice Maps a candidate ID to the their Candidate struct
    mapping(uint256 => Candidate) public candidatesById;

    /// @notice Maps a voter's address to a boolean indicating whether they are registered
    mapping(address => bool) public registeredVoters;

    /// @notice Maps a voter's address to a boolean indicating whether they have voted already
    mapping(address => bool) public hasVoted;

    // **Modifiers for access control**
    
    /// @dev Ensures that only the contract owner can execute certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action");
        _;
    }

    /// @dev Ensures that only registered voters can execute certain functions
    modifier onlyRegisteredVoters() {
        require(registeredVoters[msg.sender], "You are not registered to vote");
        _;
    }

    /// @notice Contract constructor, sets the deployer as the owner
    constructor() {
        owner = msg.sender;
    }

    /**
     * @notice Registers a voter to participate in the voting process.
     * @dev Ensures that a voter is not already registered before allowing registration.
     * @custom:error "You are already registered" - Thrown if the voter is already registered.
     * @custom:event VoterRegistered - Emitted when a voter successfully registers.
     */
    function registerVoter() external {
        require(!registeredVoters[msg.sender], "You are already registered");
        registeredVoters[msg.sender] = true;
        emit VoterRegistered(msg.sender);
    }

    /**
     * @notice Adds a new candidate to the election.
     * @dev Only the contract owner can add candidates.
     * @param _name The name of the candidate.
     * @param _addr The Ethereum address of the candidate.
     * @custom:error "Candidate name cannot be empty" - Thrown if the candidate name is empty.
     * @custom:error "Candidate address cannot be zero" - Thrown if the candidate address is invalid.
     */
    function addCandidate(string memory _name, address _addr) external onlyOwner {
        require(bytes(_name).length > 0, "Candidate name cannot be empty");
        require(_addr != address(0), "Candidate address cannot be zero");

        candidatesById[numberOfCandidates] = Candidate({
            id: numberOfCandidates,
            addr: _addr,
            name: _name,
            voteCount: 0
        });

        numberOfCandidates++;
    }

    /**
     * @notice Allows a registered voter to vote for a candidate.
     * @dev Ensures that the voter is registered and has not already voted.
     * @param candidateId The ID of the candidate the voter wants to vote for.
     * @custom:error "Invalid candidate ID" - Thrown if the candidate ID is out of range.
     * @custom:error "You have already voted" - Thrown if the voter has already cast a vote.
     * @custom:event Voted - Emitted when a voter successfully casts their vote.
     */
    function vote(uint256 candidateId) external onlyRegisteredVoters {
        require(candidateId < numberOfCandidates, "Invalid candidate ID");
        require(!hasVoted[msg.sender], "You have already voted");

        candidatesById[candidateId].voteCount++;
        hasVoted[msg.sender] = true;
        emit Voted(msg.sender, candidatesById[candidateId].addr);
    }

    /**
     * @notice Transfers ownership of the contract to a new address.
     * @dev Only the current owner can execute this function.
     * @param newOwner The address of the new owner.
     * @custom:error "New owner cannot be the zero address" - Thrown if the zero address is provided.
     * @custom:event OwnerSet - Emitted when the ownership is transferred.
     */
    function changeOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner cannot be the zero address");
        emit OwnerSet(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @notice Returns the address of the current contract owner.
     * @return The Ethereum address of the owner.
     */
    function getOwner() external view returns (address) {
        return owner;
    }
}
