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
    let savedCities = [];

    // Listen for search button click
    $("#search-btn").on("click", function () {
        event.preventDefault();
        // On click search for city
        if ($("#search").val().trim() !=="") {
            city = $("#search").val().trim();
        }
        todayWeather();
    })

    // Listen for add city button click
    function addCity() {
        $("#past-searches").prepend($("<button>").attr("type", "button").attr("data-city", city).addClass(list-group-item, list-group-action, text-muted, past).text(city));
        $("#search").val("");
    }

    // Listen for clear city button click and clear stored cities from local storage
    $("#clear").on("click", function () {
        localStorage.clear();
        savedCities = [];
        $("#past-searches").empty();
        city = "Concord";
    })
    // Load local storage
    function loadCities() {
        let storedCities = JSON.parse(localStorage.getItem("cities"));
        if (storedCities !== null) {
            savedCities = storedCities;
            // function to loop through list of stored sities and render
        }
        else {
            city = "Concord";
            // function to check if city has been searched for before
        }
    }
    // Check to see if city has been searched for before

    // Get today's weather
    function todayWeather() {
        let apiCurrent = "https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial";
    }

    // Show five day forcast
    function getFiveDay() {
        let apiFiveDay = "https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely,current&appid=${apiKey}&units=imperial";

    }
    
    // Call functions to load stored cities and get today's weather
    loadCities();
    todayWeather();

})