;(function () {

  'use strict';

  //
  // Variables
  //

  var app = new Reef(document.querySelector('#app'), {
    data: {},
    template: template
  });

  //
  // Functions
  //

  /**
   * Get the HTML for a win
   * @returns {String} An HTML string
   */
  function getWinHTML () {
    return (
      '<div class="win">' +
        '<h2>Correct!</h2>' +
        '<button data-reset>Play Again</button>' +
      '</div>'
    );
  }

  /**
   * Get the template for the UI
   * @param   {Object} props The current state/data
   * @returns {String}       An HTML string
   */
  function template (props) {
    if (props.win) {
      return getWinHTML();
    }

    return (
      '<p class="hex">' +
        '<code>' + props.answer + '</code>' +
      '</p>' +
      '<div class="swatches">' + props.colors.map(function (color) {
        return '<button data-color="' + color + '" style="background: ' + color + ';"></button>';
      }).join('') + '</div>'
    );
  }

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
   * Take the user's turn
   * @param {Object} event The Event object 
   */
  function takeTurn (event) {
    var color = event.target.getAttribute('data-color');
    if (!color) return;

    var index = app.data.colors.indexOf(color);
    if (index < 0) return;

    if (color === app.data.answer) {
      app.data.win = true;
      return;
    }

    alert('Try again!');
    app.data.colors.splice(index, 1);
  }

  function start () {
    app.data.colors = getColors();
    app.data.answer = chooseColor();
    app.data.win = false;
  }

  function reset (event) {
    if (!event.target.hasAttribute('data-reset')) return;
    start();
  }

  //
  // Inits & Event Listeners
  //

  start();

  app.elem.addEventListener('click', function (event) {
    takeTurn(event);

    reset(event);
  });

  console.log(app.data.colors, app.data.answer);

})();