// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
//The base URL should look like the following:
//     https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}.
//API call using city name, state code, country code-->
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}-->
//API key c7454d856275732eafa834406c0b2f1a-->
$(function () {
    // variables
    const apiKey = "c7454d856275732eafa834406c0b2f1a";
    let city;
    let weather;
    let weatherID;
    let lat;
    let lon;
    let savedCities = [];

    // Listen for search button click
    $("#search-btn").on("click", function () {
        event.preventDefault();
        // On click search for city
        if ($("#search").val().trim() !== "") {
            city = $("#search").val().trim();
        }
        todayWeather();
    })

    $("#past-searches").on("click", "past", function () {
        event.preventDefault();
        city = $(this).attr("data-city");
        todayWeather();
    })

    // Listen for add city button click
    function addCity() {
        $("#past-searches").prepend($("<button>").attr("type", "button").attr("data-city", city).addClass("past, list-group-item, list-group-action, text-muted").text(city));
        $("#search").val("");
    }

    // Listen for clear city button click and clear stored cities from local storage
    $("#clear").on("click", function () {
        localStorage.clear();
        savedCities = [];
        $("#past-searches").empty();
        city = "Concord";
        todayWeather();
    })

    // Load local storage
    function loadCities() {
        let storedCities = JSON.parse(localStorage.getItem("cities"));
        if (storedCities !== null) {
            savedCities = storedCities;
            cityRender();
        }
        else {
            city = "Concord";
            pastSearches();
        }
    }

    function cityRender () {
        for (let i = 0; i < savedCities.length; i++) {
            city = savedCities[i];
            addCity();
        }
    }

    // Check to see if city has been searched for before
    function pastSearches () {
        if ($('#past-searches button[data-city="${city}"]').length) {
            $("#search").val("");
        }
        else {
            addCity();
            savedCities.push(city);
            localStorage.setItem("cities", JSON.stringify(savedCities));
        }
    }

    // Get today's weather
    function todayWeather() {
        let apiCurrent = `https://api.openweathermap.org/data/2.5/forecast?q={city name}&appid={apiKey}&units=imperial`;
        $.ajax({
            url: apiCurrent,
            method: "GET",
            error: function () {
                alert("City not found. Check spelling.");
                $("#search").val("");
            }
        }).then(function (response) {
            pastSearches();
            weatherID = response.weather[0].id;
            decodeWeatherID();

            $("#city").text(response.name);
            $("#temp").text('${response.main.temp} F');
            $("#hum").text('${response.main.humidity} %');
            $("#wind").text('${response.wind.speed} MPH');
            $("#today-img").attr("src", "./assets/img/${weather}.png").attr("alt", weather);

            lat = response.coord.lat;
            lon = response.coord.lon;

            getFiveDay();
        })
    }

    // Show five day forcast
    function getFiveDay() {
        let apiFiveDay = `https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon&exclude=hourly,minutely,current&appid=${apiKey}&units=imperial`
        $.ajax({
            url: apiFiveDay,
            method: "GET"
        }).then(function (response) {
            for (let i = 0; i < 5; i++) {
                let unixTime = response.daily[i].dt;
                $('#day${i}').text(moment.unix(unixTime).format('l'));
                $('#temp${i}').text('${response.daily[i].temp.day} F');
                $('#hum${i}').text('${response.daily[i].humidity} %');
                weatherID = response.daily[i].weather[0].id;
                decodeWeatherID();
                $('#img${i}').attr("src", "./assets/img/${weather}.png").attr("alt", weather);
            }
        })
    }
    
    function decodeWeatherID() {
        switch (true) {
            case (weatherID > 199 && weatherID < 299):
                weather = "Thunderstorm";
                break;
            case (weatherID > 299 && weatherID < 599):
                weather = "Rain";
                break;
            case (weatherID > 599 && weatherID < 699):
                weather = "Snow";
                break;
            case (weatherID > 699 && weatherID < 799):
                weather = "Atmostphere";
                break;
            case (weatherID === 800):
                weather = "Clear";
                break;
            case (weatherID > 800):
                weather = "Clouds";
                break;
        }
    }
    // Call functions to load stored cities and get today's weather
    loadCities();
    todayWeather();

})