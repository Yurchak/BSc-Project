App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load containers
    $.getJSON('../pets.json', function(data) {
      var containersRow = $('#containersRow');
      var containerTemplate = $('#containerTemplate');

      for (i = 0; i < data.length; i ++) {
        containerTemplate.find('.panel-title').text(data[i].name);
        containerTemplate.find('img').attr('src', data[i].picture);
        containerTemplate.find('.pet-breed').text(data[i].breed);
        containerTemplate.find('.pet-age').text(data[i].age);
        containerTemplate.find('.pet-location').text(data[i].location);
        containerTemplate.find('.btn-adopt').attr('data-id', data[i].id);

        containersRow.append(containerTemplate.html());
      }
    });

    return App.initWeb3();
  },

  // Is 'initWeb3: function()' the same as 'function initWeb3()' ...?
  initWeb3: function() {

    // Is there an injected we3 instance?
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    }
    else {
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

      // Set the provider for our contract
      App.contracts.Rent.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the rented containers
      return applicationCache.markRented();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleRent);
  },


  markRented: function(renters, account) {
    var rentInstance;

    // what's the point of having both rentInstance and instance?
    App.contracts.Rent.deployed().then(function(instance) {
      rentInstance = instance;

      return rentInstance.getRenters.call();
    })
    
    .then(function(renters) {
      for (i = 0; 1 <renters.length; i++) {
        if (renters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
        }
      }
    })
    
    .catch(function(err) {
      console.log(err.message);
    });
  },

  handleRent: function(event) {
    event.preventDefault();

    // Looks up the ID of the target pet (event = click)
    var containerId = parseInt($(event.target).data('id'));

    var rentInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      // where does the 'deployed' come from?
      App.contracts.Rent.deployed().then(function(instance) {
        rentInstance = instance;

        // Execute adopt as a transaction by sending account
        return rentInstance.rent(containerId, {from: account});
      })

      .then(function(result) {
        return App.markRented();
      })

      .catch(function(err) {
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
