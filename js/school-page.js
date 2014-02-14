$(function() {

//OBJECT DEFINITIONS

//MAIN CODE ---- to run on load

  var schoolCode = JSON.parse(localStorage["clicked-item"]).toString();

  var schoolProfileObject= getFullObject(schoolCode);
  var schoolProfileSource = $("#school-profile").html();
  var schoolProfileTemplate = Handlebars.compile(schoolProfileSource);

  var profileElement = schoolProfileTemplate(schoolProfileObject);
  
  $("#profile-container").text("");
  $("#profile-container").append(profileElement);


});