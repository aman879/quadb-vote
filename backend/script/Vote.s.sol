// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {Vote} from "../src/Vote.sol";

contract CounterScript is Script {
    Vote public vote;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        vote = new Vote();

        vm.stopBroadcast();
    }
}
