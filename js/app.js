;(function () {

  'use strict';

  //
  // Variables
  //

  // Create the Reef component
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
   * Get the HTML for a color swatch
   * @param {String} color The current color
   */
  function getSwatchHTML (color) {
    return '<button data-color="' + color + '" style="background: ' + color + ';"></button>';
  }

  /**
   * Get the HTML for game play
   * @param   {Object} props The current state/data
   * @returns {String}       An HTML string
   */
  function getGameHTML (props) {
    return (
      '<p class="hex">' +
        '<code>' + props.answer + '</code>' +
      '</p>' +
      '<p>Click on a swatch to make your guess!</p>' +
      '<div class="swatches">' +
        props.colors.map(getSwatchHTML).join('') +
      '</div>'
    );
  }

  /**
   * Get the template for the UI
   * @param   {Object} props The current state/data
   * @returns {String}       An HTML string
   */
  function template (props) {
    // If the user has won, show the win screen
    if (props.win) {
      return getWinHTML();
    }

    // Otherwise, show the game screen
    return getGameHTML(props);
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

    for (var i = 1; i <= 6; i++) {
      // Shuffle the hex values
      shuffle(hex);

      // Append the first hex value to the string
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

    for (var i = 1; i <= 3; i++) {
      colors.push(createColor());
    }

    return colors;
  }

  /**
   * Choose a random color as the answer
   * @returns {String} A random six-digit hex value
   */
  function chooseColor () {
    // Clone the colors array
    var colors = Reef.clone(app.data.colors);

    // Shuffle the new array
    shuffle(colors);

    // Return the first color from the shuffled array
    return colors[0];
  }

  /**
   * Render the UI with the initial data
   */
  function start () {
    app.data.colors = getColors();
    app.data.answer = chooseColor();
    app.data.win = false;
  }

  /**
   * Take the user's turn
   * @param {Object} event The Event object 
   */
  function takeTurn (event) {
    // Get the color that was clicked
    var color = event.target.getAttribute('data-color');
    if (!color) return;

    // Get the index of the color in the colors array
    var index = app.data.colors.indexOf(color);
    if (index < 0) return;

    // If the color was right, show win screen
    if (color === app.data.answer) {
      app.data.win = true;
      return;
    }

    // Otherwise, keep playing
    alert('Try again!');
    app.data.colors.splice(index, 1);
  }

  /**
   * Reset the game
   * @param {Object} event The Event object
   */
  function reset (event) {
    // If this wasn't a reset button, do nothing
    if (!event.target.hasAttribute('data-reset')) return;

    // Reset the game
    start();
  }

  /**
   * Handle click events
   * @param {Object} event The Event object
   */
  function handleClick (event) {
    // Take the user's turn when a color swatch is clicked
    takeTurn(event);

    // Reset the game when a reset button is clicked
    reset(event);
  }


  //
  // Inits & Event Listeners
  //

  // Start the game
  start();

  // Handle click events
  app.elem.addEventListener('click', handleClick);

})();