pragma solidity ^0.4.17;

contract Rent {
	address[16] public users;

	function rent(uint containerId) public returns (uint) {
		require(containerId >= 0 && containerId <= 15);

		users[containerId] = msg.sender;

		return containerId;
	}
		
	// Retrieving the users
	function getUsers() public view returns (address[16]) {
		return users;
	}

}