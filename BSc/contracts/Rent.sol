pragma solidity ^0.4.17;

contract Rent {

    address[16] public accounts;

    // Renting a container
    function rent(uint containerID) public returns (uint) {
        require(containerID >= 0 && containerID <= 15);

        accounts[containerID] = msg.sender;

        return containerID;
    }

    // Retrieving the accounts
    function getAccounts() public view returns (address[16]) {
        return accounts;
    }

}