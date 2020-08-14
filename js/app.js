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
   * Get the HTML for an error message
   * @returns {String} An HTML string
   */
  function getErrorHTML () {
    return "<p>Sorry, there was a problem. Please try again later.</p>"
  }

  /**
   * Get the HTML for a win
   * @returns {String} An HTML string
   */
  function getWinHTML () {
    return (
      '<h2 class="thumbs-up">Correct!</h2>' +
      '<button data-reset>Play Again</button>'
    );
  }

  /**
   * Get the HTML for a color swatch
   * @param {String} color The current color
   */
  function getSwatchHTML (color) {
    return (
      '<button data-color="' + color.hex + '" style="background: ' + color.hex + ';">' +
        '<span class="visually-hidden">' + color.name + '</span>' +
      '</button>'
      );
  }

  /**
   * Get the HTML for game play
   * @param   {Object} props The current state/data
   * @returns {String}       An HTML string
   */
  function getGameHTML (props) {
    return (
      '<p class="hex">' +
        '<span class="visually-hidden">Hex value: </span>' +
        '<code>' + props.answer.hex + '</code>' +
      '</p>' +
      '<p class="instructions">Click on a swatch to make your guess!</p>' +
      '<p class="warning" style="' + (props.mistake ? 'visibility: visible;' : '') + '">Try again!</p>' +
      '<div class="swatches" tabindex="-1">' +
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
    // If there was an error getting the colors, show a message
    if (props.error) {
      return getErrorHTML();
    }

    // If the user has won, show the win screen
    if (props.win) {
      return getWinHTML();
    }

    // Otherwise, show the game screen
    return getGameHTML(props);
  }

  /**
   * Get the JSON data from a Fetch request
   * @param   {Object} response The response to the request
   * @returns {Object}          The JSON data OR a rejected promise
   */
  function getJSON (response) {
    return response.ok ? response.json() : Promise.reject(response);
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
   * Set the component data
   * @param {Object} data The data from the colors.json file
   */
  function setData (data) {
    // Three random colors
    app.data.colors = shuffle(data).slice(0, 3);

    // One of the random colors
    app.data.answer = chooseColor();

    // Whether the user has won
    app.data.win = false;

    // Whether the user has made a mistake
    app.data.mistake = false;

    // Whether there was an error getting the colors
    app.data.error = false;
  }

  /**
   * Handle errors in the Fetch chain
   */
  function handleError () {
    app.data.error = true;
  }

  /**
   * Render the UI with the initial data
   */
  function start () {
    fetch('data/colors.json')
      .then(getJSON)
      .then(setData)
      .catch(handleError);
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
    var index = app.data.colors.findIndex(function (value) {
      return value.hex === color;
    });

    // If the color was correct, show the win screen
    if (color === app.data.answer.hex) {
      app.data.win = true;
      return;
    }

    // Otherwise, let the user know they've made a mistake
    app.data.mistake = true;

    // Hide the mistake message after 2 seconds
    setTimeout(function () {
      app.data.mistake = false;
    }, 2000);

    // Remove the color that was clicked
    app.data.colors.splice(index, 1);

    // Return focus to the grid
    event.target.parentElement.focus();
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

  // Render the UI with the initial data
  start();

  // Handle click events
  app.elem.addEventListener('click', handleClick);

})();