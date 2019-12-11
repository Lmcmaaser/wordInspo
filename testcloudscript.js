function am4core() {
    //am4core.useTheme(am4themes_animated);
    // Create chart instance
    var chart = am4core.create("chartdiv", am4plugins_wordCloud.WordCloud ); 

    var series = chart.series.push(new am4plugins_wordCloud.WordCloudSeries());

    // Add data
    series.data = [
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
    ];

    series.dataFields.word = "tag";
    series.dataFields.value = "weight"; 
    series.colors = new am4core.ColorSet();
    series.colors.passOptions = {};

};

$(am4core);



