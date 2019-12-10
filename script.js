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
    const type = $('input:checked').val();
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
  console.log('getWords ran');
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
    .then(responseJson => displayResults(responseJson, keyWord))
    //.then(responseJson => console.log(responseJson))
    .catch(err => {
      $('#js-definition').text(`Something went wrong: ${err.message}`);
  });
};

//display definition
function displayResults(responseJson, keyWord, type) {
  console.log('displayResults ran');
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
          <p>${responseJson[i].shortdef}</p>` //<p>${responseJson[i].meta.syns}</p>
      )
      if (type == "syns") {
        $('#js-cloud').empty();
        $('#js-cloud').append(
          `<a id="word-cloud"> </a>
          <h2>Word Cloud:</h2>
          <div id="chartdiv"></div>`
        );
        am4core(responseJson[i].meta.syns);
      } else if (type == "ants") {
          $('#js-cloud').empty();
          $('#js-cloud').append(
            `<a id="word-cloud"> </a>
            <h2>Word Cloud:</h2>
            <div id="chartdiv"></div>`
          );
          am4core(responseJson[i].meta.ants);
      };
    };
  $('#js-keyword').val('');
  $('#input:checked').val('');
};

//create wordcloud

function am4core (input) {
  console.log('am4core ran');
  var chart = am4core.create("chartdiv", am4plugins_wordCloud.WordCloud ); 
  var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

  let arr = []; //create an arry to hold the input
  for (let i = 0; i < input.length; i++)
    arr.push(input[i]);
  console.log(arr);

  //turn array into a list of objects
  let obj = arr.map((arr, index) => {
    return {
     tag: arr,
     weight: index + 1,
    }
  });

  console.log(obj)
  series.data = obj;

  series.dataFields.word = "tag";
  series.dataFields.value = "weight"; 
  series.colors = new am4core.ColorSet();
  series.colors.passOptions = {};
};

$(eventSubmit);

/*const feelings =  ["content", "contented", "gratified", "pleased", "satisfied"] 

const things = feelings.map((feeling, index) => {
  return {
   tag: feeling,
   index: index + 1,
  }
});*/