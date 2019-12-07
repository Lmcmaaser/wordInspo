// request url: https://www.dictionaryapi.com/api/v3/references/thesaurus/json/umpire?key=your-api-key

'use strict';

// put your own value below!
const apiKey = 'cf8a4365-58c4-4c84-8501-49e65418abc2'; 
const baseUrl = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/';

function eventSubmit() {
    $('form').submit(event => {
      event.preventDefault();
      console.log('submitEvent ran');
      const kWord = $('#js-keyword').val();
      const type = $('input:checked').val();
      getParks(kWord);
    });
}

function formatQueryParams(params) {
  const queryParams = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryParams.join('&');
}

function getParks(kWord) {
    const params = {
      Keyword: kWord,
    };
    const queryString = formatQueryParams(params)
    const url = baseUrl + queryString + '?' +'key=' + apiKey
    console.log(queryString);
    console.log(url);
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then(responseJson => displayResults(responseJson))
      .catch(err => {
        $('#js-definition').text(`Something went wrong: ${err.message}`);
    });
}

function displayResults(responseJson) {
  console.log(responseJson);
  $('#js-definition').empty();
    $('#js-definition').append(
        `<h2>Definition</h2>
        <p>${meta.id}</p>
        <p>${meta.def.dt}</p>`
    )};
    $('#js-keyword').val('');
    $('#input:checked').val('');
};

$(eventSubmit);