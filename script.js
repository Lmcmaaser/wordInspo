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
    const type = $('input:checked').val();
    getWords(keyWord, type);
  });
};

function formatQueryParams(params) {
  const queryParams = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryParams.join('&');
};

function getWords(keyWord, type) {
  //const query = formatQueryParams(search)
  console.log('getWords ran');
  const url = baseUrl + keyWord + '?' +'key=' + apiKey
  console.log(keyWord);
  console.log(url);
  console.log(type);
  
  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson, keyWord, type))
    //.then(responseJson => console.log(responseJson))
    .catch(err => {
      $('#js-results').text(`Something went wrong: ${err.message}`);
  });
};

//display definition
function displayResults(responseJson, keyWord, type) { //function displayResults(responseJson, keyWord, type)
  console.log('displayResults ran');
  console.log(type);
  console.log(responseJson);
  console.log(responseJson.length)
  $('#js-results').empty();
  $('#js-cloud').empty();
  for (let i = 0; i < responseJson.length; i++) {
    if (keyWord === responseJson[i].meta.id) { 
      let option = responseJson[i]
      $('#js-results').append(
        `<a id="word-cloud"> </a>
        <h2>Word Cloud:</h2>
        <div id="chartdiv"></div>
        <a id="definition"> </a>
        <h2>Definition</h2>
        <p>${option.meta.id}</p>
        <p>${option.shortdef}</p>` //<p>${responseJson[i].meta.syns}</p>
      ) // works
      synsData(option, type);
    } 
  }
  $('#js-keyword').val('');
  $('#input:checked').val('');
};

//set up word cloud data 
function synsData(option, type) {
  if (type == "syns") {
    console.log('synsData ran');
    let input = option.meta.syns;
    console.log(input); //input is an array of arrays
    for (let i = 0; i < input.length; i++) {
      let concat = input[i].flat();
      console.log(concat);
      /*for (let i = 0; i < concat.length; i++) {
        let concatAgain = concat[i].flat();
        console.log(concatAgain)
      }*/
      am4core(concat);
    }
  } else if (type == "ants") {
    console.log('antsData ran');
    let input = option.meta.ants;
    console.log(input); //input is an array of arrays
    for (let i = 0; i < input.length; i++) {
      let concat = input[i].flat();
      console.log(concat);
    }
  }
};

//create word cloud
function am4core(concat) {
  console.log('plugin ran');
  
  let chart = am4core.create("chartdiv", am4plugins_wordCloud.WordCloud ); 
  let series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());
  let data = [];
  data.push(concat);
  console.log(data);
  //add data
  series.data = data

  series.dataFields.word = "tag";
  series.dataFields.value = "weight"; 
  series.colors = new am4core.ColorSet();
  series.colors.passOptions = {};
}; 
$(eventSubmit);