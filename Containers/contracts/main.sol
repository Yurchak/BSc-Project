pragma solidity ^0.4.2;

contract Main {

    // System user object
    struct User {
        string name;
        uint inventory;
    }

    mapping(address => User) users; // map a unique address to an individual user
    address[] public userList; // put the unique addresses in an array for external access

    // Create a new user
    function createUser(address _address, string _name, uint _inventory) public {

        var user = users[_address];

        user.name = _name;
        user.inventory = _inventory;

        userList.push(_address) -1; 
    }

    // Retrieve list of all users
    function getUsers() view public returns (address[]) {
        return userList;
    }

    // Container unit object
    struct Unit {
        uint uID; // unique ID of a container
        address owner; // container owner
        address renter; // container renter
        bytes32 serial; // container serial number
        bytes32 location; // container location
        bytes32 category; // container type (i.e. reefer)
        bool availability;  // if true, the container is available
    }

    mapping(bytes32 => Unit) public units; // map a unique id for each Unit object
    bytes32[] public unitList; // enumerate the keys to the mapping

    // Retrieve list of all units
    function getAllUnits() public view returns (bytes32[]) {
        return unitList;
    }

    // Retrieve a specific unit by id
    function getUnit(bytes32 _id) view public returns (uint, address, address, bytes32, bytes32, bytes32, bool) {
        return (units[_id].uID, units[_id].owner, units[_id].renter, units[_id].serial, units[_id].location, units[_id].category, units[_id].availability);
    }

}
