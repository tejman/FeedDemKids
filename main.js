$(function() {

  var mapOptions = {
    center: new google.maps.LatLng(42.371103, -83.083412),
    zoom: 11
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"),
      mapOptions);

  var coder = new google.maps.Geocoder();

  console.log(myData["Placemark"].length);

  for (var i = 0; i < myData["Placemark"].length; i++) {
    var schoolId = myData["Placemark"][i]["ExtendedData"]["Data"][0]["value"];
    var targetObj = matchValue(schoolData, "BCode", schoolId);

    if (myData["Placemark"][i]["Point"]!==undefined) {
      coord = myData["Placemark"][i]["Point"]["coordinates"].split(",").slice(0,2).reverse();

      targetObj.gps = coord;

      var newLatLng = new google.maps.LatLng(coord[0], coord[1]);

      var address = coder.geocode({"latLng": newLatLng}, function(item){
        console.log(i);
        console.log(item);
        return item[0];
      });
    }

  };

});


