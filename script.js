//get current moment
var mom = moment().format("dddd, MMMM Do YYYY");
$("#currentDay").text(mom);
//on click of button run api call
$("#search").click(function() {
    let cityInput = $("#cityInput").val();

    renderForecast(cityInput);
})

function renderForecast(cityInput) {
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
        lat = response.city.coord.lat;
        long = response.city.coord.lon;

        let uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=87f0c9d5a9813668cae2ebe11bcb2972";
        $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(UVresponse) {
                // console.log(UVresponse.value);
                $("#uv-index").text("UV index: " + UVresponse.value);
            })
            //run renderFiveDay
        renderFiveDay(lat, long)
    })

}

function renderFiveDay(lat, long) {
    //empty forecast html
    $(".days").html("");
    let currentDate = moment().date();
    //query for daily weather info
    let fiveDayURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + long + "&units=imperial&appid=87f0c9d5a9813668cae2ebe11bcb2972";
    console.log(fiveDayURL);
    $.ajax({
        url: fiveDayURL,
        method: "GET"
    }).then(function(fiveDayresponse) {
        console.log(fiveDayresponse);

        for (i = 1; i < 6; i++) {
            //make div for each day, starting with i = 1 because we aren't interested in current day
            let dayDiv = $("<day-" + i + " id=day-" + i + ">");
            $(".days").append(dayDiv);
            //increment date
            dayInc = moment().date(currentDate + i).format("MM/DD");

            let tempMax = (fiveDayresponse.daily[i].temp.max);
            let tempMin = (fiveDayresponse.daily[i].temp.min);
            let hum = (fiveDayresponse.daily[i].humidity);
            let icon = (fiveDayresponse.daily[i].weather[0].icon);
            //add date, icon, temp, humidity
            $("#day-" + i).append("<h2>" + dayInc + "</h2>");
            $("#day-" + i).append("<p>High of " + tempMax + " degrees</p>");
            $("#day-" + i).append("<p>Low of " + tempMin + " degrees</p>");
            $("#day-" + i).append("<p>Humidity: " + hum + "</p>");
            $("#day-" + i).append("<image src='http://openweathermap.org/img/wn/" + icon + "@2x.png'>");

        }
    })
}

// let currentDate = moment().date();
// console.log(moment().date());
// console.log(currentDate + 1);
// currentDate++;
// console.log(moment().date(currentDate).format("MM/DD"))