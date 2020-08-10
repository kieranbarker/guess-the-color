;(function () {

  'use strict';

  //
  // Variables
  //

  var app = new Reef('#app', {
    data: {},
    template: function (props) {
      return 'It works!';
    }
  });

  //
  // Functions
  //

  //
  // Inits & Event Listeners
  //

  app.render();

})();