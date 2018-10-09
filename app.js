// Initial array of stocks
const stocksList = ['FB', 'AAPL', 'TSLA', 'GOOG', 'AMZN', 'MSFT'];

var validationList = new Array;
$.ajax({
  url: 'https://api.iextrading.com/1.0/ref-data/symbols',
  method: 'GET'
}).then(function (symbolList) {
  validationList = symbolList;
  console.log(validationList[0].symbol);
  return validationList;
});




const displayStockInfo = function () {

  const stock = $(this).attr('data-name');
  const queryURL = `https://api.iextrading.com/1.0/stock/${stock}/batch?types=quote,logo,news&range=1m&last=10`;

  // Creates AJAX call for the specific stock button being clicked
  $.ajax({
    url: queryURL,
    method: 'GET'
  }).then(function (response) {
    $('#stocks-view').html(`<table class="table">
    <thead class="thead-dark text-center">
      <tr>
        <th scope="col">Company Name</th>
        <th scope="col">Logo</th>
        <th scope="col">Symbol</th>
        <th scope="col">Price</th>
      </tr>
    </thead>`);
    $('.table').append(`<tbody class="text-center">
    <tr>
      <th class="align-middle" scope="row">${response.quote.companyName}</th>
      <td class="align-middle"><img class="rounded img-fluid" src='${response.logo.url}'</td>
      <td class="align-middle">${response.quote.symbol}</td>
      <td class="align-middle">${response.quote.latestPrice}</td>
    </tr>`);

    /* $('.companyName').html(`<h2>Company Name</h2> <p class="align-middle"> ${response.quote.companyName}</p>`)
     $('.companySymbol').html(`<h2>Symbol</h2> <p class="align-middle"> ${response.quote.symbol}</p>`)
     $('.companyLogo').html(`<h2>Logo</h2> <img class="img-fluid" src='${response.logo.url}'>`)
     $('.companyPrice').html(`<h2>Stock Price</h2> <p class="align-middle">${response.quote.latestPrice}</p>`)
     */
    $('#linksList').html('<h2> Links Related to Company Stock </h2>');
    for (let i = 0; i < 10; i++) {
      $('#linksList').append(`<a href= '${response.news[i].url}'>${response.news[i].headline} </a> </br>`);
    }
  });

}

// Function for displaying stock data
const render = function () {

  // Deletes the stocks prior to adding new stocks
  // (this is necessary otherwise you will have repeat buttons)
  $('#buttons-view').empty();

  // Loops through the array of stocks
  for (let i = 0; i < stocksList.length; i++) {

    // Then dynamicaly generates buttons for each stock in the array
    // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
    let newButton = $('<button>');

    // Adds a class of stock to our button
    newButton.addClass('stock');
    newButton.addClass('btn btn-primary');

    // Added a data-attribute
    newButton.attr('data-name', stocksList[i]);

    // Provided the initial button text
    newButton.text(stocksList[i]);

    // Added the button to the buttons-view div
    $('#buttons-view').append(newButton);
  }
}

// This function handles events where one button is clicked
const addButton = function (event) {

  // event.preventDefault() prevents the form from trying to submit itself.
  // We're using a form so that the user can hit enter instead of clicking the button if they want
  event.preventDefault();

  let verify = false;
  // This line will grab the text from the input box
  const stock = $('#stock-input').val().trim().toUpperCase();
  for (let i = 0; i < validationList.length; i++) {
    if (stock === validationList[i].symbol) {

      // The stock from the textbox is then added to our array
      verify = true;
      stocksList.push(stock);

      // Deletes the contents of the input
      $('#stock-input').val('');
    } else {
      $('#stock-input').val('');
    }
    // calling render which handles the processing of our stock array
  }
  if (verify === false) {
    alert("Please enter a valid stock symbol");
  }
  render();
}

// Event listener for #add-stock button
$('#add-stock').on('click', addButton);

// Adding click event listeners to all elements with a class of "stock"
$('#buttons-view').on('click', '.stock', displayStockInfo);

// Calling the renderButtons function to display the intial buttons
render();