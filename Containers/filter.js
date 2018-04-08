`Filter containers in order?
> sort by proximity?

Filter search by:
* type
- price
> location based on stated nearest port.
* owner
- last-maintained`


whitelistedOwners = [];
whitelistedOwners.push("0x2FC596B7a7987c65E62A0eF670551e2cad7bDA");
whitelistedOwners.push("0x332bDdEC4Ab1375b9cE9C2b4c3DA5A0A0FFcC6");

desiredTypes = [];
desiredTypes.push('Dry storage');
desiredTypes.push('Flat rack');
desiredTypes.push('Refrigerated');

var location = []
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

var locationXY = []
locationXY.push((31.2304, 121.4737));
locationXY.push((1.3521, 103.8198));
locationXY.push((25.2048, 55.2708));
locationXY.push((51.9244, 4.4777));
locationXY.push((34.0522, -118.2437));
locationXY.push((53.5511, 9.9937));
locationXY.push((40.7128, -74.0060));
locationXY.push((39.4699, -0.3763));
locationXY.push((35.6895, 139.6917));
locationXY.push((19.0760, 72.8777));

startLocation = "Mumbai";
startXY = locationXY[location.indexOf(startLocation)];

var distances = [];
for (i=0; i < location.length; i ++) {
    a = Math.abs(locationXY[i][0] - startXY[0]);
    b = Math.abs(locationXY[i][1] - startXY[1]);
    distances.push(Math.sqrt(a**2 + b**2))
}



App = {
    web3Provider: null,
    contracts: {},
  
    init: function() {
      // Load containers.
      $.getJSON('../containers.json', function(data) {
        var containerRow = $('#containerRow');
        var containerTemplate = $('#containerTemplate');
        
        for (i = 0; i < data.length; i ++) {
            if (desiredTypes.includes(data[i].type) === true
            && whitelistedOwners.includes(data[i].owner) === true) {
                containerTemplate.find('.panel-title').text(data[i].serial);
                containerTemplate.find('img').attr('src', data[i].picture);
                containerTemplate.find('.container-type').text(data[i].type);
                containerTemplate.find('.container-location').text(data[i].location);
                containerTemplate.find('.btn-rent').attr('data-id', data[i].id);
        
                containerRow.append(containerTemplate.html())
            }
            ;
        }
      });
  
      return App.initWeb3();
    },

}


// Original

// App = {
//     web3Provider: null,
//     contracts: {},
  
//     init: function() {
//       // Load containers.
//       $.getJSON('../containers.json', function(data) {
//         var containerRow = $('#containerRow');
//         var containerTemplate = $('#containerTemplate');
//         for (i = 0; i < data.length; i ++) {
//                 containerTemplate.find('.panel-title').text(data[i].serial);
//                 containerTemplate.find('img').attr('src', data[i].picture);
//                 containerTemplate.find('.container-type').text(data[i].type);
//                 containerTemplate.find('.container-location').text(data[i].location);
//                 containerTemplate.find('.btn-rent').attr('data-id', data[i].id);
        
//                 containerRow.append(containerTemplate.html())
//             ;
//         }
//       });
  
//       return App.initWeb3();
//     },
// }