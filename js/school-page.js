$(function() {

//OBJECT DEFINITIONS
  var getFullObject = function(schoolCode) {
    //takes a school's BCode and returns an new object with the school object as well as the corresponding zip code objects
    var schoolObject = matchValue(geocodedSchoolData, "BCode", schoolCode);
    var myZip = schoolObject.zip;
    var zipObject = matchValue(demoData, "zip", myZip);

    var fullObject = {
      school: schoolObject,
      zipEstimate: zipObject[0],
      zipPercent: zipObject[1]
    };

    return fullObject
  };

//MAIN CODE ---- to run on load

  var schoolCode = JSON.parse(localStorage["clicked-item"]).toString();

  var schoolProfileObject= getFullObject(schoolCode);
  var schoolProfileSource = $("#school-profile").html();
  var schoolProfileTemplate = Handlebars.compile(schoolProfileSource);

  var profileElement = schoolProfileTemplate(schoolProfileObject);
  
  $("#profile-container").text("");
  $("#profile-container").append(profileElement);
  console.log(schoolProfileObject);


});