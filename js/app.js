;(function () {

  'use strict';

  //
  // Variables
  //

  var app = new Reef('#app', {
    data: {
      colors: getColors()
    },
    template: function (props) {
      return 'It works!';
    }
  });

  //
  // Functions
  //

  /**
   * Randomly shuffle an array
   * https://stackoverflow.com/a/2450976/1293256
   * @param   {Array} array The array to shuffle
   * @returns {Array}       The shuffled array
   */
  function shuffle (array) {
    var currentIndex = array.length;
    var temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  /**
   * Create a random color value
   * https://vanillajstoolkit.com/helpers/createcolor/
   * @returns {String} A random six-digit hex value
   */
  function createColor () {
    var hex = ['a', 'b', 'c', 'd', 'e', 'f', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    var color = '#';

    for (var i = 0; i < 6; i++) {
      // Shuffle the hex values
      shuffle(hex);

      // Append first hex value to the string
      color += hex[0];
    }

    return color;
  }

  /**
   * Get three random colors
   * @returns {Array} Three random colors
   */
  function getColors () {
    var colors = [];

    for (var i = 1; i < 4; i++) {
      colors.push(createColor());
    }

    return colors;
  }

  //
  // Inits & Event Listeners
  //

  app.render();

  console.log(app.data.colors);

})();