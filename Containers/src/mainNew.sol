pragma solidity ^0.4.17;

contract Main {
    address S1 = 0xca35b7d915458ef540ade6068dfe2f44e8fa733c;
    address P1 = 0x14723a09acff6d2a60dcdf7aa4aff308fddc160c;
    address H1 = 0x4b0897b0513fdc7c541b6d9d7e929c4e5364d2db;
    address D1 = 0x583031d1113ad414f02576bd6afabfb302140225;
    
    address S2 = 0xdd870fa1b7c4700f2bd7f44238821c26f7392148;
    address P2 = 0x9910710c751619d8f997a79d2ecf97e084dfd6e0;
    address H2 = 0x25b38c665bf3d3887aa0ea651146c7220d5a31f1;
    address D2 = 0x80399ded0e33715fc7f1af44e31243990753d213;
    
    struct Unit { // OPTIMIZE FOR MEMORY
        string serial;
        string cat;
        string location;
    }
    
    Unit[] public units;
    
    mapping (uint => address) public unitToOwner;
    mapping (uint => address) public unitToCustodian;
    mapping (address => uint) private ownerUnitCnt;
    
    function initTestUnit() external {
        uint id = units.push(Unit("MSCZ0656513", "dry", "Singapore"));
        unitToOwner[id] = D1;
        ownerUnitCnt[D1]++;
        unitToCustodian[id] = D1;

    }
    
}