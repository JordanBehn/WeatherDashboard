//get current moment
var mom = moment().format("dddd, MMMM Do YYYY");
$("#currentDay").text(mom);
//render previously searched buttons
renderCityButtons()

//on click of button run api call
$("#search").click(function() {
    //takes in input city, runs forecast
    let cityInput = $("#cityInput").val();
    renderForecast(cityInput);
    //saves city name in list of previous searches
    let savedCities = JSON.parse(window.localStorage.getItem("cities")) || [];
    console.log($("#cityInput").text())
    savedCities.push($("#cityInput").val());
    window.localStorage.setItem("cities", JSON.stringify(savedCities));
    //remove buttons and render them from list
    renderCityButtons()
})

function renderForecast(cityInput) {
    //openweather api query for input city
    //apikey = "87f0c9d5a9813668cae2ebe11bcb2972";
    let queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=87f0c9d5a9813668cae2ebe11bcb2972";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        //store important info about today's weather
        let city = response.city.name;
        let temp = response.list[0].main.temp;
        let humidity = response.list[0].main.humidity;
        let wind = response.list[0].wind.speed;
        let weatherIcon = response.list[0].weather[0].icon;
        //display weather info
        $('#city').text(city);
        $('#todayIcon').html("<image src='https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png'>");
        $('#temp').text("Temperature: " + temp);
        $('#humidity').text("Humidity: " + humidity);
        $('#wind').text("Windspeed: " + wind);
        //get lat and long for uv index, call uv index
        lat = response.city.coord.lat;
        long = response.city.coord.lon;

        let uvURL = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=87f0c9d5a9813668cae2ebe11bcb2972";
        $.ajax({
                url: uvURL,
                method: "GET"
            }).then(function(UVresponse) {
                // console.log(UVresponse.value);
                $("#uv-index").text("UV index: " + UVresponse.value);
                //add class based on severity of uv index
                $('#uv-index').removeClass();
                if (UVresponse.value >= 8) {
                    $('#uv-index').addClass('severe')
                } else if (UVresponse.value >= 5) {
                    $('#uv-index').addClass('high')
                } else if (UVresponse.value >= 3) {
                    $('#uv-index').addClass('med')
                } else {
                    $('#uv-index').addClass('low')
                }
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
        for (i = 1; i < 6; i++) {
            //make div for each day, starting with i = 1 because we aren't interested in current day
            let dayDiv = $("<day-" + i + " class='col-2' id=day-" + i + ">");
            $(".days").append(dayDiv);
            //increment date
            dayInc = moment().date(currentDate + i).format("MM/DD");

            let tempMax = (fiveDayresponse.daily[i].temp.max);
            let tempMin = (fiveDayresponse.daily[i].temp.min);
            let hum = (fiveDayresponse.daily[i].humidity);
            let icon = (fiveDayresponse.daily[i].weather[0].icon);
            //add date, icon, temp, humidity
            $("#day-" + i).append("<h2>" + dayInc + "</h2>");
            $("#day-" + i).append("<image src='https://openweathermap.org/img/wn/" + icon + "@2x.png'>");
            $("#day-" + i).append("<p>High of " + tempMax + " F</p>");
            $("#day-" + i).append("<p>Low of " + tempMin + " F</p>");
            $("#day-" + i).append("<p>Humidity: " + hum + "%</p>");

        }
    })
}

function renderCityButtons() {
    $("#previousSearches").html('')
    var cityBtns = JSON.parse(window.localStorage.getItem("cities")) || [];
    //for each city in local storage, create and append button
    for (var i = 0; i < cityBtns.length; i++) {
        var btnDiv = $("<div>");
        var btn = $("<button>");
        btn.addClass("city-btn btn-primary col");
        btn.attr("name", cityBtns[i]);
        btn.text(cityBtns[i]);
        btnDiv.append(btn);
        $("#previousSearches").append(btnDiv);
    }
}
//on city button click, get forecast for that city
$(".city-btn").click(function() {
    renderForecast($(this).attr("name"));
})