`Generates and exports an array of marine container units in CSV

Choose number of containers and number of externally owned accounts.
Simulation uses 10 international ports, 5 shipping/leasing companies, and 3 basic container types.
Container ID is realistic and conforms to ISO 6346, including check digit cacompanyTableulation algorithm.`

var rwc = require('random-weighted-choice');

function pad(number, length) { // Pad numbers less than 'length' digits with leading zeroes
   
    var str = '' + number;
    while (str.length < length) {
        str = '0' + str;
    }
   
    return str;
}

function randomChoice(arr) {
    return arr[Math.floor(arr.length * Math.random())];
}

// Key inputs (JS only supports user input in browser)
var n = 12; // Number of containers to generate
var a = 10; // Number of externally owned accounts

var location = [];
location.push("Shanghai");
location.push("Singapore");
location.push("Dubai");
location.push("Rotterdam");
location.push("Los Angeles");
location.push("Hamburg");
location.push("New York");
location.push("Valencia");
location.push("Tokyo");
location.push("Mumbai");

var wl = [40, 34, 16, 14, 9, 9, 6, 5, 5, 5]; // weights by relative container traffic (2016-17)
var wlsum = wl.reduce(function (a,b) {return a+b;}, 0);

for (i = 0; i < wl.length; i++) {
    wl[i] /= wlsum // normalize weights to sum to 1
}

var locationTable = [];
for (i = 0; i < wl.length; i++) {
    locationTable.push({weight: wl[i], id: location[i]})
}

var shippingCo = [];
shippingCo.push("TRH");  // Triton
shippingCo.push("MCI");  // Maersk
shippingCo.push("CEO");  // Textainer
shippingCo.push("MSC");  // Mediterranean
shippingCo.push("STM");  // CMA-CGM

var companyWeight = [10, 8, 6, 6, 5];  // weights by relative capacity (2014)
var companyWeightSum = companyWeight.reduce(function (a,b) {return a+b;}, 0);
for (i = 0; i < companyWeight.length; i++) {
    companyWeight[i] /= companyWeightSum;
}

var companyTable = [];
for (i = 0; i < companyWeight.length; i++) {
    companyTable.push({weight: companyWeight[i], id: shippingCo[i]})
}

var char2num = {  // for cacompanyTableulating check digit after generating container ID
        '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8,
        '9': 9, 'A': 10, 'B': 12, 'C': 13, 'D': 14, 'E': 15, 'F': 16, 'G': 17,
        'H': 18, 'I': 19, 'J': 20, 'K': 21, 'L': 23, 'M': 24, 'N': 25, 'O': 26,
        'P': 27, 'Q': 28, 'R': 29, 'S': 30, 'T': 31, 'U': 32, 'V': 34, 'W': 35,
        'X': 36, 'Y': 37, 'Z': 38};


var catDist = [
    {weight: 0.8, id: "U"},
    {weight: 0.1, id: "J"},
    {weight: 0.1, id: "Z"}
];


var typeDist = [
    {weight: 0.75, id: "Dry storage"},
    {weight: 0.2, id: "Flat rack"},
    {weight: 0.05, id: "Refrigerated"}
];


function Unit () {};

var n = 1000;
var a = 10;

// Generate accounts

var acc = [];
var unitsOwned = [];
var unitsUsed = [];
var alphanum = "0123456789ABCDEFabcdef"
for (i = 0; i < a; i++) {
    var address = "0x";
    while (address.length < 40) {
            address += alphanum[Math.floor(Math.random() * alphanum.length)];
    }
    acc.push(address);
    unitsOwned.push(0);
    unitsUsed.push(0);
}

// Generate units
var units = []
for (i = 0; i < n; i++) {
    var self = new Unit();
    self.index = i;

    var id0 = rwc(companyTable);
    var id1 = rwc(catDist);
    var id2 = pad(Math.floor(Math.random()*90000) + 10000,6);
    self.id = id0 + id1 + id2
    // check digit algorithm
    idarr = self.id.split("");
    var iterator = idarr.entries();
    var total = 0;
    for (let e of iterator) {
        total += (char2num[e[1]] * 2**e[0])
    }
    total2 = Math.floor(total/11) * 11
    checkDigit = (total - total2) % 10
    self.id += String(checkDigit) // append check digit, completing unit ID

    self.type = rwc(typeDist);

    if (self.type == "Dry storage") {
        self.picture = "images/dry.jpg";
    }

    if (self.type == "Flat rack") {
        self.picture = "images/flatRack.jpg";
    }

    if (self.type == "Refrigerated") {
        self.picture = "images/reefer.jpg";
    }
    
    self.location = rwc(locationTable);
    iOwner = Math.floor(acc.length * Math.random())
    self.owner = acc[iOwner];
    unitsOwned[iOwner]++;
    // iUser = Math.floor(acc.length * Math.random())
    self.user = acc[iOwner];
    unitsUsed[iOwner]++;

    units.push(self)

}
const fs = require("fs");

let data = JSON.stringify(units, null, 2);
fs.writeFileSync("units.json", data);

for (i = 0; i < acc.length; i++) {
    console.log("Account", acc[i], "currently owns", unitsOwned[i], "units and uses", unitsUsed[i], "units");
}
// David test comment push !!!