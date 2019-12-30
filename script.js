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
    const keyWord = $('#js-keyword').val();
    const type = $('input:checked').val();
    getWords(keyWord, type);
  });
};

function getWords(keyWord, type) {
  const url = baseUrl + keyWord + '?' +'key=' + apiKey
  
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, keyWord, type))
    .catch(err => {
      console.log(err.message);
      //$('#js-results').text(`${err.message}`);
      if (err.message === "Cannot read property 'id' of undefined") {
        $('#js-results').text(`${keyWord} not found, try a different word!`);
      }
      else if (err.message === "Cannot read property 'meta' of undefined"){
        $('#js-results').text(`${keyWord} not found, WordInspo only accepts words found in Merriam-Webster's Collegiate® Thesaurus.`);
      }
      else {
        $('#js-results').text(`WordInspo failed, check your internet connection and try again later.`);
      }
      $('#js-keyword').val('');
      $('input[name="type"]').prop('checked', false);
  });
};

//display definition
function displayResults(responseJson, keyword, type) { 
  console.log(responseJson);
  $('#js-results').empty();
  let i = 0; 
  let option = responseJson[i];
  $('#js-results').append(
    `<a id="word-cloud"> </a>
    <h2>Word Cloud:</h2>
    <div id="chartdiv"></div>
    <a id="definition"> </a>
    <h3>Definition: ${option.meta.id}</h3>
    <ol class="insert-definition">
    </ol>`
  );
  displayShortdef(option)
  wordData(option, type);
  $('#js-keyword').val('');
  $('input[name="type"]').prop('checked', false);
};

function displayShortdef(option) {
  for (let i = 0; i < option.shortdef.length; i++) {
    $('.insert-definition').append(
      `<li>${option.shortdef[i]}</li>`
    )
  }
};

//create word cloud
function wordCloudGenerator(concat) {
  let chart = am4core.create("chartdiv", am4plugins_wordCloud.WordCloud ); 
  let series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
  //add data
  series.data = [];
  for (let i = 0; i < concat.length; i++) {
    series.data.push({
      "tag": concat[i],
      "weight": Math.random() * 100
    });
  };
  series.dataFields.word = "tag";
  series.dataFields.value = "weight"; 
  series.colors = new am4core.ColorSet();
  series.colors.passOptions = {};
}; 

//set up word cloud data 
function wordData(option, type) {
  if (type === "syns") {
    let input = option.meta.syns;
    let concat = input.flat();
    wordCloudGenerator(concat);
  } else if (type === "ants") {
    let input = option.meta.ants;
    let concat = input.flat();
    wordCloudGenerator(concat);
  }
};

$(eventSubmit);