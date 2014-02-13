var reverseGeocode1 = function(geoData, otherData){

  var coder = new google.maps.Geocoder();
  var i = 0;

  var intervalID = setInterval(function(){
    //basically a FOR loop but with a 2sec delay per iteration
    if (i<myData["Placemark"].length) {
      var schoolId = geoData["Placemark"][i]["ExtendedData"]["Data"][0]["value"];
      var targetObj = matchValue(otherData, "BCode", schoolId);

      if (geoData["Placemark"][i]["Point"]!==undefined) {
        //Checks to see that coordinates are defined
        coord = geoData["Placemark"][i]["Point"]["coordinates"].split(",").slice(0,2).reverse();

        targetObj.gps = coord;

        var newLatLng = new google.maps.LatLng(coord[0], coord[1]);
        
        var address = coder.geocode({"latLng": newLatLng}, function(item, status){
        
          targetObj.address = item[0].address_components;
          console.log(i);
          console.log(status);

          if (targetObj["address"][4]["short_name"]==="MI") {
          //Only adds MI locations to the final data set
          finalData.push(targetObj);
          };
        });
      }
      i++;
    }
    else{clearInterval(intervalID)}
   
  }, 3000);

};

var reverseGeocode = function(geoData, otherData){

  var coder = new google.maps.Geocoder();
  var i = 0;

  var intervalID = setInterval(function(){
    //basically a FOR loop but with a 2sec delay per iteration
    if (i<myData["Placemark"].length) {
      var schoolId = geoData["Placemark"][i]["ExtendedData"]["Data"][0]["value"];

      if (geoData["Placemark"][i]["Point"]!==undefined) {
        //Checks to see that coordinates are defined
        coord = geoData["Placemark"][i]["Point"]["coordinates"].split(",").slice(0,2).reverse();
        
        finalData.push([coord[0], coord[1], schoolId]);
      }
      i++;
    }
    else{clearInterval(intervalID)}
   
  }, 0);

};

var finalData = [];

$(function() {

  

  var mapOptions = {
    center: new google.maps.LatLng(42.371103, -83.083412),
    zoom: 11
  };

  var map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

  reverseGeocode(myData, schoolData);

  localStorage["schoolDataFinal"] = JSON.stringify("");
  // localStorage["schoolDataFinal"] = JSON.stringify(finalData);

});


