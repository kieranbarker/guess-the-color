;(function () {

  'use strict';

  //
  // Variables
  //

  var app = new Reef(document.querySelector('#app'), {
    data: {
      colors: getColors(),
      answer: null
    },
    template: function (props) {
      return (
        '<p class="hex">' +
          '<code>' + props.answer + '</code>' +
        '</p>' +
        '<div class="swatches">' + props.colors.map(function (color) {
          return '<button style="background: ' + color + ';"></button>';
        }).join('') + '</div>'
      );
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

  /**
   * Choose a random color as the answer
   * @returns {String} A random six-digit hex value
   */
  function chooseColor () {
    var colors = Reef.clone(app.data.colors);

    shuffle(colors);

    return colors[0];
  }

  /**
   * Element.matches() polyfill (simple version)
   * https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
   */
  if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
  }

  //
  // Inits & Event Listeners
  //

  app.data.answer = chooseColor();

  app.render();

  app.elem.addEventListener('click', function (event) {
    if (!event.target.matches('.swatches button')) return;
    console.log('hello');
  });

  console.log(app.data.colors, app.data.answer);

})();