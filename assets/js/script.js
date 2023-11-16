// Wrap all code that interacts with the DOM in a call to jQuery to ensure that
// the code isn't run until the browser has finished rendering all the elements
// in the html.
//The base URL should look like the following:
//     https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid={API key}.
//API call using city name, state code, country code-->
//http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}-->
//API key c7454d856275732eafa834406c0b2f1a-->

// Variables
const apiKey = "c7454d856275732eafa834406c0b2f1a";
let searchHistoryList = $('#search-history-list');
let searchCityInput = $("#search-city");
let searchCityButton = $("#search-city-button");
let clearHistoryButton = $("#clear-history");
let currentCity = $("#current-city");
let currentTemp = $("#current-temp");
let currentHumidity = $("#current-humidity");
let currentWindSpeed = $("#current-wind-speed");
let weatherContent = $("#weather-content");
let cityList = [];

// Find current date and display in title
let currentDate = moment().format('L');
$("#current-date").text("(" + currentDate + ")");

// Check if search history exists when page loads
initalizeHistory();
clearSearch();

// value added to search history
$(document).on("submit", function(event){
    event.preventDefault();

    // Grab value entered into search bar 
    let searchValue = searchCityInput.val().trim();

    weatherRequest(searchValue)
    searchHistory(searchValue);
    searchCityInput.val(""); 
});

// Clicking the search button will trigger value added to search history
searchCityButton.on("click", function(event){
    event.preventDefault();

    // Grab value entered into search bar 
    let searchValue = searchCityInput.val().trim();

    weatherRequest(searchValue)
    searchHistory(searchValue);    
    searchCityInput.val(""); 
});

// Clear the sidebar of past cities searched
clearHistoryButton.on("click", function(){
    // Empty out the  city list array
    cityList = [];
    // Update city list history in local storage
    listArray();
    
    $(this).addClass("hide");
});

// Clicking on a button in the search history sidebar populates the dashboard with city info
searchHistoryList.on("click","li.city-btn", function(event) {
    // console.log($(this).data("value"));
    let value = $(this).data("value");
    weatherRequest(value);
    searchHistory(value); 

});



// Request Open Weather API based on user input
function weatherRequest(searchValue) {
    
    // Formulate URL for AJAX api call
    let queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + searchValue + "&units=imperial&appid=" + apiKey;
    

    // Make AJAX call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response){
        currentCity.text(response.name);
        currentCity.append("<small class='text-muted' id='current-date'>");
        $("#current-date").text("(" + currentDate + ")");
        currentCity.append("<img src='https://openweathermap.org/img/w/" + response.weather[0].icon + ".png' alt='" + response.weather[0].main + "' />" )
        currentTemp.text(response.main.temp);
        currentTemp.append("&deg;F");
        currentHumidity.text(response.main.humidity + "%");
        currentWindSpeed.text(response.wind.speed + "MPH");

        let lat = response.coord.lat;
        let lon = response.coord.lon;
        let countryCode = response.sys.country;
        let forecastURL = "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=" + apiKey + "&lat=" + lat +  "&lon=" + lon;
        
        // AJAX call for 5-day forecast
        $.ajax({
            url: forecastURL,
            method: "GET"
        }).then(function(response){
 
            $('#five-day-forecast').empty();
            for (let i = 1; i < response.list.length; i+=8) {

                let forecastDateString = moment(response.list[i].dt_txt).format("L");

                let forecastCol = $("<div class='col-12 col-md-6 col-lg forecast-day mb-3'>");
                let forecastCard = $("<div class='card'>");
                let forecastCardBody = $("<div class='card-body'>");
                let forecastDate = $("<h5 class='card-title'>");
                let forecastIcon = $("<img>");
                let forecastTemp = $("<p class='card-text mb-0'>");
                let forecastHumidity = $("<p class='card-text mb-0'>");


                $('#five-day-forecast').append(forecastCol);
                forecastCol.append(forecastCard);
                forecastCard.append(forecastCardBody);

                forecastCardBody.append(forecastDate);
                forecastCardBody.append(forecastIcon);
                forecastCardBody.append(forecastTemp);
                forecastCardBody.append(forecastHumidity);
                
                forecastIcon.attr("src", "https://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                forecastIcon.attr("alt", response.list[i].weather[0].main)
                forecastDate.text(forecastDateString);
                forecastTemp.text(response.list[i].main.temp);
                forecastTemp.prepend("Temp: ");
                forecastTemp.append("&deg;F");
                forecastHumidity.text(response.list[i].main.humidity);
                forecastHumidity.prepend("Humidity: ");
                forecastHumidity.append("%");
                
            }
        });

    });

    

};

// Display and save the search history of cities
function searchHistory(searchValue) {
    // Grab value entered into search bar 
    
    // If there are characters entered into the search bar
    if (searchValue) {
        // Place value in the array of cities
        if (cityList.indexOf(searchValue) === -1) {
            cityList.push(searchValue);

            // List all of the cities in user history
            listArray();
            clearHistoryButton.removeClass("hide");
            weatherContent.removeClass("hide");
        } 
        else {
            // Remove the existing value from the array
            let removeIndex = cityList.indexOf(searchValue);
            cityList.splice(removeIndex, 1);

            // Push the value again to the array
            cityList.push(searchValue);

            // list all of the cities in user history
            listArray();
            clearHistoryButton.removeClass("hide");
            weatherContent.removeClass("hide");
        }
    }
}

// List the array into the search history sidebar
function listArray() {
    // Empty out the elements in the sidebar
    searchHistoryList.empty();
    // Repopulate the sidebar with each city in the array
    cityList.forEach(function(city){
        let searchHistoryItem = $('<li class="list-group-item city-btn">');
        searchHistoryItem.attr("data-value", city);
        searchHistoryItem.text(city);
        searchHistoryList.prepend(searchHistoryItem);
    });
    // Update city list history in local storage
    localStorage.setItem("cities", JSON.stringify(cityList));
    
}

// Grab city list string from local storage and update the city list array
function initalizeHistory() {
    if (localStorage.getItem("cities")) {
        cityList = JSON.parse(localStorage.getItem("cities"));
        let lastIndex = cityList.length - 1;
        listArray();
        // Display the last city viewed
        // if page is refreshed
        if (cityList.length !== 0) {
            weatherRequest(cityList[lastIndex]);
            weatherContent.removeClass("hide");
        }
    }
}

// Check to see if there are elements in search history sidebar in order to show clear history btn
function clearSearch() {
    if (searchHistoryList.text() !== "") {
        clearHistoryButton.removeClass("hide");
    }
}

