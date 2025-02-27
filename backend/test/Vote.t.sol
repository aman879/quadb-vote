// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Vote} from "../src/Vote.sol";

contract VoteTest is Test {
    Vote public vote;

    address owner = makeAddr("owner");
    address newOwner = makeAddr("newOwner");

    address candidate1 = makeAddr("candidate1");
    address candidate2 = makeAddr("candidate2");
    address candidate3 = makeAddr("candidate3");

    address voter = makeAddr("voter");

    address[] voters;

    event OwnerSet(address indexed oldOwner, address indexed newOwner);
    event VoterRegistered(address indexed voter);
    event Voted(address indexed voter, address indexed candidate);

    function setUp() public {
        vm.prank(owner);
        vote = new Vote();

        for (uint256 i = 0; i < 10; i++) {
            voters.push(makeAddr(string(abi.encodePacked("voter", i))));
            vm.prank(voters[i]);
            vote.registerVoter();
        }
    }

    // function to add candidates
    function addCandidate() public {
        vm.startPrank(owner);
        vote.addCandidate("Aman", candidate1);
        vote.addCandidate("Joe", candidate2);
        vm.stopPrank();
    }

    // Check if the contract owner is correct
    function testOwner() public view {
        assertEq(vote.getOwner(), owner);
    }

    // Test ownership transfer
    function testChangeOwner() public {
        vm.prank(owner);
        vote.changeOwner(newOwner);
        assertEq(vote.getOwner(), newOwner);
    }

    // Ensure the owner change event is emitted
    function test_owner_change_event() public {
        vm.prank(owner);
        vm.expectEmit(true, true, false, false);
        emit OwnerSet(owner, newOwner);
        vote.changeOwner(newOwner);
    }

    // Ensure only the owner can change ownership
    function test_non_owner_cant_change_owner() public {
        vm.prank(candidate1);
        vm.expectRevert("Only the owner can perform this action");
        vote.changeOwner(candidate1);
    }

    // Ensure candidates are added correctly
    function testAddCandidate() public {
        addCandidate();
        vm.startPrank(owner);
        (uint256 id1, address addr1, string memory name1, uint256 voteCount1) = vote.candidatesById(0);
        vm.stopPrank();
        assertEq(id1, 0);
        assertEq(addr1, candidate1);
        assertEq(name1, "Aman");
        assertEq(voteCount1, 0);
    }

    // Ensure non-owners cannot add candidates
    function test_non_owner_cannot_add_candidate() public {
        vm.startPrank(voter);
        vm.expectRevert("Only the owner can perform this action");
        vote.addCandidate("Charlie", candidate3);
        vm.stopPrank();
    }

    // Ensure candidate IDs increment correctly
    function test_increasing_candidate_id() public {
        addCandidate();
        vm.startPrank(owner);
        (uint256 id1, , , ) = vote.candidatesById(0);
        (uint256 id2, , , ) = vote.candidatesById(1);
        vm.stopPrank();
        assertEq(id1, 0);
        assertEq(id2, 1);
    }

    // Ensure candidate name and address cannot be empty
    function test_candidate_name_and_address_cannot_be_empty() public {
        vm.startPrank(owner);
        vm.expectRevert("Candidate name cannot be empty");
        vote.addCandidate("", candidate1);
        vm.expectRevert("Candidate address cannot be zero");
        vote.addCandidate("Aman", address(0));
        vm.stopPrank();
    }

    // Ensure unregistered voters cannot vote
    function test_unregitered_voter() public {
        addCandidate();
        vm.startPrank(voter);
        vm.expectRevert("You are not registered to vote");
        vote.vote(0);
        vm.stopPrank();
    }

    // Ensure voter registration event is emitted
    function testRegisterEvent() public {
        vm.startPrank(voter);
        vm.expectEmit(true, false, false, false);
        emit VoterRegistered(voter);
        vote.registerVoter();
        vm.stopPrank();
    }

    // Ensure votes are counted correctly
    function testVoteCount() public {        
        addCandidate();
        for (uint256 i=0; i < voters.length; i++) {
            vm.prank(voters[i]);
            if (i < 4) {
                vote.vote(0);
            } else {
                vote.vote(1);
            }
        }
        (, , , uint256 voteCount1) = vote.candidatesById(0);
        (, , , uint256 voteCount2) = vote.candidatesById(1);
        assertEq(voteCount1, 4);
        assertEq(voteCount2, 6);
    }

    // Ensure voters cannot vote for an invalid candidate
    function testInvalidCandidate() public {
        addCandidate();
        vm.startPrank(voter);
        vote.registerVoter();
        vm.expectRevert("Invalid candidate ID");
        vote.vote(2);
        vm.stopPrank();
    }

    // Ensure voters cannot vote twice
    function testDoubleVoting() public {
        addCandidate();
        vm.startPrank(voter);
        vote.registerVoter();
        vote.vote(0);
        vm.expectRevert("You have already voted");
        vote.vote(1);
        vm.stopPrank();
    }

    // Ensure voting event is emitted
    function testVoteEvent() public {
        addCandidate();
        vm.startPrank(voter);
        vote.registerVoter();
        vm.expectEmit(true, true, false, false);
        emit Voted(voter, candidate1);
        vote.vote(0);
        vm.stopPrank();
    }

    // Ensure votes persist in storage
    function testVotePersists() public {
        addCandidate();
        vm.startPrank(voter);
        vote.registerVoter();
        vote.vote(0);
        vm.stopPrank();
        (, , , uint256 voteCount) = vote.candidatesById(0);
        assertEq(voteCount, 1);
    }
}
