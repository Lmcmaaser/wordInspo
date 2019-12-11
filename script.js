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
  for (let i = 0; i < responseJson.length; i++) {
    if (keyWord === responseJson[i].meta.id) { 
      let option = responseJson[i];
      $('#js-results').append(
        `<a id="word-cloud"> </a>
        <h2>Word Cloud:</h2>
        <div id="chartdiv"></div>
        <a id="definition"> </a>
        <h2>Definition</h2>
        <p>${option.meta.id}</p>
        <p>${option.shortdef}</p>` //<p>${responseJson[i].meta.syns}</p>
      ) // works
      wordData(option, type);
    } 
  }
  $('#js-keyword').val('');
  $('#input:checked').attr('checked', false);
};

//create word cloud
function wordCloudGenerator(concat) {
  console.log('plugin ran');
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
    console.log('synsData ran');
    let input = option.meta.syns;
    console.log(input); //input is an array of arrays
    let concat = input.flat();
    console.log(concat);
    wordCloudGenerator(concat);
  } else if (type == "ants") {
    console.log('antsData ran');
    let input = option.meta.ants;
    console.log(input); //input is an array of arrays
    let concat = input.flat();
    console.log(concat);
    wordCloudGenerator(concat);
  }
};


$(eventSubmit);


/*const feelings =  ["content", "contented", "gratified", "pleased", "satisfied"] 

const things = feelings.map((feeling, index) => {
  return {
   tag: feeling,
   index: index + 1,
  }
});

ex. series.data = [
        {
            "tag": "Breaking News",
            "weight": 60
        }, {
            "tag": "Environment",
            "weight": 80
        }, {
            "tag": "Politics",
            "weight": 90
        }, {
            "tag": "Business",
            "weight": 25
        }, {
            "tag": "Lifestyle",
            "weight": 30
        }, {
            "tag": "World",
            "weight": 45
        }, {
            "tag": "Sports",
            "weight": 160
        }, {
            "tag": "Fashion",
            "weight": 20
        }, {
            "tag": "Education",
            "weight": 78
        }
    ];*/