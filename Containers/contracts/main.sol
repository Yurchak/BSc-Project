pragma solidity ^0.4.0;


contract Main {

    // Platform user object
    struct User {
        string name;
        uint inventory;
    }

    mapping(address => User) users; // map a unique address to an individual user
    address[] public userList; // put the unique addresses in an array for external access

    // Create a new user
    function createUser(address _address, string _name, uint _inventory) public {
        users[_address].name = _name;
        users[_address].inventory = _inventory;
    
        userList.push(_address) - 1;
    }

    // Retrieve list of all users
    function getUsers() view public returns (address[]) {
        return userList;
    }

    function getUserByAddress(address _address) view public returns (string Name, uint Inventory) {
        return (users[_address].name, users[_address].inventory);
    }

    // ----------------------------------------------------------------------------------------------

    // Container unit object
    struct Unit {
        address owner; // container owner
        address renter; // container renter
        string serial; // container serial number
        string location; // container location
        string category; // container type (i.e. reefer)
        bool availability;  // if true, the container is available
    }

    mapping(uint => Unit) units; // map a unique id for each Unit object
    uint[] public unitList; // enumerate the keys to the mapping

    //Import unit with all its parameters

    function importUnit(
        address _owner,
        // address _renter, 
        string _serial, string _location, string _category, bool _availability) public {
        uint _id = unitList.length;
        units[_id].owner = _owner;
        // units[_id].renter = _renter;
        units[_id].serial = _serial;
        units[_id].location = _location;
        units[_id].category = _category;
        units[_id].availability = _availability;

        unitList.push(_id); 
    }    

    //Retrieve list of all units
    function getAllUnits() public view returns (uint[]) {
        return unitList;
    }

    // Retrieve a specific unit by id
    function getUnitByID(uint _id) view public returns (address Owner, address Renter, string Serial_Number, string Location, string Category, bool Availability) {
        return (units[_id].owner, units[_id].renter, units[_id].serial, units[_id].location, units[_id].category, units[_id].availability);
    }

// Change owner
    function handoverUnit(uint _id, address _renter) public {
        units[_id].renter = _renter;
        //units[_id].availability = false;
        users[_renter].inventory += 1;
        users[units[_id].owner].inventory -= 1;
    }
}