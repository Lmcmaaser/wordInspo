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
      $('#js-results').text(`Something went wrong: word not found.`); //${err.message}
  });
};

//display definition
function displayResults(responseJson, keyword, type) { 
  $('#js-results').empty();
  let i = 0; 
  let option = responseJson[i];
  $('#js-results').append(
    `<a id="word-cloud"> </a>
    <h2>Word Cloud:</h2>
    <div id="chartdiv"></div>
    <a id="definition"> </a>
    <h3>Definition: ${option.meta.id}</h3>
    <ol>
      <li>${option.shortdef[0]}</li>
      <li>${option.shortdef[1]}</li>
      <li>${option.shortdef[2]}</li>
    </ol>`
  );
  wordData(option, type);
  $('#js-keyword').val('');
  $('input[name="type"]').prop('checked', false);
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
  if (type == "syns") {
    let input = option.meta.syns;
    let concat = input.flat();
    wordCloudGenerator(concat);
  } else if (type == "ants") {
    let input = option.meta.ants;
    let concat = input.flat();
    wordCloudGenerator(concat);
  }
};

$(eventSubmit);