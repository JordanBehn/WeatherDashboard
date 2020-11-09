//get current moment
var mom = moment().format("dddd, MMMM Do YYYY");
$("#currentDay").text(mom);
//on click of button run api call
$("#search").click(function() {
    let cityInput = $("#cityInput").val();

    renderToday(cityInput);
    renderFiveDay(cityInput);
})

function renderToday(cityInput) {
    //apikey = "87f0c9d5a9813668cae2ebe11bcb2972";
    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=87f0c9d5a9813668cae2ebe11bcb2972";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        //store important info about today's weather
        console.log(response)
        let city = response.city.name;
        let temp = response.list[0].main.temp;
        let humidity = response.list[0].main.humidity;
        let wind = response.list[0].wind.speed;
        let weatherIcon = response.list[0].weather[0].icon;
        console.log(weatherIcon);
        //display weather info
        $('#city').text(city);
        $('#temp').text("Temperature: " + temp);
        $('#humidity').text("Humidity: " + humidity);
        $('#wind').text("Windspeed: " + wind);
        //get lat and long for uv index, call uv index
        let lat = response.city.coord.lat;
        let long = response.city.coord.lon;

        let uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=87f0c9d5a9813668cae2ebe11bcb2972";
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(UVresponse) {
            // console.log(UVresponse.value);
            $("#uv-index").text("UV index: " + UVresponse.value);
        })
    })
}

function renderFiveDay(cityInput) {
    $(".days").html("")
    let currentDate = moment().date();
    for (i = 1; i < 6; i++) {
        //make div for each day
        let dayDiv = $("<day-" + i + " id=day-" + i + ">");
        $(".days").append(dayDiv);
        //increment date
        dayInc = moment().date(currentDate + i).format("MM/DD");
        //query for weather info
        //api.openweathermap.org/data/2.5/forecast/daily?q={city name}&cnt={cnt}&appid={API key}

        let fiveDayURL = "http://api.openweathermap.org/data/2.5/forecast/daily?q=" + cityInput + "&cnt=6&appid=87f0c9d5a9813668cae2ebe11bcb2972";
        console.log(fiveDayURL);
        $.ajax({
                url: fiveDayURL,
                method: "GET"
            }).then(function(fiveDayresponse) {
                // console.log(fiveDayresponse);
            })
            //add date, icon, temp, humidity
        $("#day-" + i).append("<h2>" + dayInc + "</h2");
    }
}
// let currentDate = moment().date();
// console.log(moment().date());
// console.log(currentDate + 1);
// currentDate++;
// console.log(moment().date(currentDate).format("MM/DD"))