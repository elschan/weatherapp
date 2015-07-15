$(function(){


  $('#enter-city').click( function(e) {
    e.preventDefault();
    $('#results_of_cities').empty();
    $('.glyphicon').css('opacity', '.2');
    var entered_city = $('#search-city').val();

    $.ajax ({
      url: "http://autocomplete.wunderground.com/aq?query=" + entered_city,
      dataType: 'jsonp',
      jsonp: 'cb',
      success: function(e){
        var found_cities = e.RESULTS;
        found_cities = dedupArray(found_cities);
        for(var i = 0; i < found_cities.length; i++) {
          $('<a></a><br>')
            .attr("id", found_cities[i].zmw)
            .addClass("city")
            .text(found_cities[i].name)
            .appendTo('#results_of_cities')
            .click(getWeather);
        };
      }
    })
  });
  var dedupArray = function(array) {
    var new_array = [];
    var zmw_record = [];
    for (var i = 0; i < array.length; i++) {
      if (zmw_record.indexOf(array[i].zmw) == -1 ) {
        new_array.push(array[i]);
        zmw_record.push(array[i].zmw)
      }
    }
    return new_array;
  }
  
  function getWeather() {
    $('.glyphicon').css('opacity', '.2');
    var where_weather = this.id;
    $(this).addClass('clicked-city');
    $.ajax({
      url: "http://api.wunderground.com/api/66f9f4aa4c22b606/forecast/q/zmw:" + where_weather + ".json",
      dataType: 'jsonp',
      success: function(weather) {
        console.log('weather', weather.forecast);
        $('#weather').text(' '+weather.forecast.simpleforecast.forecastday[0].conditions+' '+weather.forecast.simpleforecast.forecastday[0].date.pretty+' ')
        var weatherResult = weather.forecast.simpleforecast.forecastday[0].conditions;
        imageDerivedFromWeather(weatherResult);
      }
    });
  }
  var imageDerivedFromWeather = function(weatherResult) {
    var w = weatherResult.toLowerCase();
    checkRain(w);
    checkClear(w);
    checkSnow(w);
    checkThunder(w);
  }

  var checkRain = function(w) {
    if (w.indexOf("storm") != -1 || w.indexOf("rain") != -1 || w.indexOf("cloud") != -1){
      $("#rain").css('opacity', '1');
      $("#phrase").text('You may want to bring an umbrella today...');
      console.log('1');
    };
  }
  var checkClear = function(w) {
    if (w.indexOf("clear") != -1) {
      $("#sunglass").css('opacity', '1');
      $("#phrase").text('Seems clear to me!');
      console.log('2');
    };
  }

  var checkSnow = function(w) {
    if (w.indexOf("snow") != -1 || w.indexOf("blizzard") != -1){
      $("#snow").css('opacity', '1');
      $("#phrase").text('Dress warm! It could be chilly.');
      console.log('3');
    };
  }

  var checkThunder = function(w) {
    if (w.indexOf("thunder") != -1 || w.indexOf("lightning") != -1){
      $("#lightning").css('opacity', '1');
      $("#phrase").text('Avoid trees. Enough said.');
      console.log('4');
    };
  }
});