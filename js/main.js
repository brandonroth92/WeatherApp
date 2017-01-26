var userLat;
var userLon;
var celcius;
var farenheit;
var date;
var temps = [];
var icons = {  //maps color icons to weather icon ID
    "01d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/sunny.png",
    "01n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/sunny_night.png",
    "02d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/cloudy2.png",
    "02n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/cloudy2_night.png",
    "03d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/cloudy4.png",
    "03n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/cloudy4_night.png",
    "04d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/overcast.png",
    "04n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/overcast.png",
    "09d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/shower3.png",
    "09n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/shower3.png",
    "10d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/shower2.png",
    "10n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/shower2_night.png",
    "11d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/tstorm3.png",
    "11n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/tstorm3.png",
    "13d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/snow5.png",
    "13n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/snow5.png",
    "50d": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/fog.png",
    "50n": "http://i1089.photobucket.com/albums/i344/WaldenBayMod/Weather%20Icons/mist_night.png"
};

//calls location api, getWeather, and the getForecast function
function getLocation() {
  $.get("http://ip-api.com/json", function(json) { //calls location api for lat/long/city/date
    //console.log(json);
    userLat = json.lat;
    userLon = json.lon;
    $("#location").html(json.city + ", " + json.countryCode);
    getWeather(json);
    getForecast(json);
  });
}

//calls openweather api, logs temperature, description, and icon ID
function getWeather() {
  $.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+userLat+"&lon="+userLon+"&units=imperial&APPID=6113f6c24327e1b523acd6f5a9a01854", function(data) {
   //console.log(data)
   celcius = Math.round((data.main.temp-32) * (5/9));
   farenheit = Math.round(data.main.temp);
   $("#description").html(data.weather[0].main);
   $("#user-temp").html(farenheit);
   $(".url-image").attr({src:icons[data.weather[0].icon]});
  });
}

//calls openweather api daily forecast
function getForecast() { 
  $.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?lat="+userLat+"&lon="+userLon+"&units=imperial&APPID=6113f6c24327e1b523acd6f5a9a01854", function(fore) { 
    console.log(fore);    
    $(".date").each(function(i){
      var d = new Date(fore.list[i+1].dt * 1000); //creates JS date object
      $(this).html(d.toDateString().slice(0,3)); //returns day in string format
    });        
    $("p[class='temp']").each(function(i){
      temps.push(fore.list[i+1].temp.day);
      $(this).html(Math.round(fore.list[i+1].temp.day) + "<span>&#176; F</span>");
    });           
    $("img[class^='fimg']").each(function(i){
      $(this).attr({src:icons[fore.list[i+1].weather[0].icon], alt:"icon"});
    });        
      $("p[class='description']").each(function(i){
        $(this).html(fore.list[i+1].weather[0].description);
      });            
  });
}

$(document).ready(function() {
  
  //gets user date and writes to page
  var date = new Date();
    $("#userDate").html(date.toDateString());
  
  //runs main location and weather functions
  getLocation();
  
  //toggles forecast columns display property
  $("button").click(function(){
    $(".forecast").toggle();
  });
  
  //toggles temperature unit on temp unit click
  $(".temp-button").on("click", function() {
    if ($(this).html() === "C") {
      $(this).html("F");
      $("#user-temp").html(farenheit);
    } else {
      $(this).html("C");
      $("#user-temp").html(celcius);
    } 
  });
  
})




