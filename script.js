//get current moment
var mom = moment().format("dddd, MMMM Do YYYY, h:mm:ss a");
$("#currentDay").text(mom);
//on click of button run api call
$("#search").click(function() {
    let cityInput = $("#cityInput").val();
    let apikey = "87f0c9d5a9813668cae2ebe11bcb2972";
    let queryURL = "http://api.openweathermap.org/data/2.5/forecast?q=" + cityInput + "&units=imperial&appid=" + apikey;
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        console.log(response)
        let city = response.city.name;
        let temp = response.list[0].main.temp;
        let humidity = response.list[0].main.humidity;
        let wind = response.list[0].wind.speed;
        //get lat and long for uv index, call uv index
        let lat = response.city.coord.lat;
        let long = response.city.coord.lon;
        console.log(lat);
        console.log(long);
        let uvURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=" + apikey;
        $.ajax({
            url: uvURL,
            method: "GET"
        }).then(function(UVresponse) {
            console.log(UVresponse.value);
            $("#uv-index").text("UV index: " + UVresponse.value);
        })
    })
})