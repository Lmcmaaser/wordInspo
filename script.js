//style scroll nav function
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "5px 10px";
  } else {
      document.getElementById("navbar").style.padding = "20px 10px";
  } 
};

//call to DictionaryAPI
// example request url: https://www.dictionaryapi.com/api/v3/references/thesaurus/json/umpire?key=your-api-key

'use strict';

const apiKey = 'cf8a4365-58c4-4c84-8501-49e65418abc2'; 
const baseUrl = 'https://www.dictionaryapi.com/api/v3/references/thesaurus/json/';

function eventSubmit() {
  $('form').submit(event => {
    event.preventDefault();
    console.log('submitEvent ran');
    const keyWord = $('#js-keyword').val();
    //const speech = $('input:checked').val();
    //const type = $('input:checked').val();
    getWords(keyWord);
  });
};

function formatQueryParams(params) {
  const queryParams = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryParams.join('&');
};

function getWords(keyWord) {
  //const query = formatQueryParams(search)
  const url = baseUrl + keyWord + '?' +'key=' + apiKey
  console.log(keyWord);
  console.log(url);
  
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayDefinition(responseJson, keyWord)) //, anychart(responseJson)) 
    //.then(responseJson => console.log(responseJson))
    .catch(err => {
      $('#js-definition').text(`Something went wrong: ${err.message}`);
  });
}

//display definition
function displayDefinition(responseJson, keyWord) {
  console.log(keyWord);
  console.log(responseJson);
  console.log(responseJson.length)
  $('#js-definition').empty();
  for (let i = 0; i < responseJson.length; i++)
    if (keyWord === responseJson[i].meta.id) {
      $('#js-definition').append(
        `<a id="definition"> </a>
          <h2>Definition:</h2>
          <p>${responseJson[i].meta.id}</p>
          <p>${responseJson[i].shortdef}</p>`
      );
    }
    
  $('#js-keyword').val('');
  $('#input:checked').val('');
};

$(eventSubmit);

//create word cloud
function anychart(responseJson) {
  let data = [
    //example data{"x": "word", "value": 0, category: "synonym"}
  ];
  let chart = anychart.tagCloud(data);
  $('#js-definition').empty();
  for (let i = 0; i < allOptions.options.length; i++) {
    $('.insert-option').append(
      `<section id="js-cloud">
        <a id="word-cloud"> </a>
        <h2>Word Cloud:</h2>
        
      </section>`)};

// set a chart title
chart.title('15 most spoken languages')
// set an array of angles at which the words will be laid out
chart.angles([0])
// enable a color range
chart.colorRange(true);
// set the color range length
chart.colorRange().length('80%');

// display the word cloud chart
chart.container("container");
chart.draw();
};
