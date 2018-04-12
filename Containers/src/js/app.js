whitelistedOwners = [];
blacklistedOwners = [];
//blacklistedOwners.push("0x2FC596B7a7987c65E62A0eF670551e2cad7bDA");
//blacklistedOwners.push("0x332bDdEC4Ab1375b9cE9C2b4c3DA5A0A0FFcC6");

desiredTypes = [];
desiredTypes.push('Dry storage');
desiredTypes.push('Flat rack');
desiredTypes.push('Refrigerated');


App = {
    web3Provider: null,
    contracts: {},
  
    init: function() {
      // Load containers.
      $.getJSON('../containers.json', function(data) {
        var containerRow = $('#containerRow');
        var containerTemplate = $('#containerTemplate');

        for (i = 0; i < data.length; i ++) {
          //data = data.sort(function(a,b) {return parseFloat()})
            if (desiredTypes.includes(data[i].type) === true
            && blacklistedOwners.includes(data[i].owner) !== true) {
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



  initWeb3: function() {

    // Is there an injected web3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
    // If no injected web3 instance is detected, fall back to Ganache
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {

    $.getJSON('Rent.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var RentArtifact = data;
      App.contracts.Rent = TruffleContract(RentArtifact);
    
      // Set the provider for our contract: Link our contract to the node within Metamask, so we can interact with it through Metamask.
      App.contracts.Rent.setProvider(App.web3Provider);
    
      // Use our contract to retrieve and mark the rented containers
      return App.markRented();
    });

    return App.bindEvents();
  },

  // Listen to the events on the web. If someone clicks button 'rent', initialize handleRent function
  bindEvents: function() {
    $(document).on('click', '.btn-rent', App.handleRent);
  },

  //////////////////////////////////////////////
  markRented: function(users, account) {
    var rentInstance;

    // what's the point of having both rentInstance and instance?
    App.contracts.Rent.deployed().then(function(instance) {
      rentInstance = instance;

      return rentInstance.getUsers.call();
    })
    
    .then(function(users) {
      for (i = 0; i < users.length; i++) {
        if (users[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-container').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    })

    .catch(function(err) {
      console.log(err.message);
    });

  },

  handleRent: function(event) {
    event.preventDefault();

    // Looks up the ID of the target container (event = click)
    var containerId = parseInt($(event.target).data('id'));

    var rentInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Rent.deployed().then(function(instance) {
        rentInstance = instance;

        // Execute rent as a transaction by sending account
        return rentInstance.rentContainer(containerId, {from: account});
      }).then(function(result) {
        return App.markRented();
      }).catch(function(err) {
        console.log(err.message);
      });
      
    });
    
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
