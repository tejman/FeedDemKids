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
      zipPercent: zipObject[1],
      otherStats: randomOtherStats(),
    };

    return fullObject
  };

  var randomOtherStats = function() {
    var stats = {
      teacher: {},
      student: {},
      feedback: {}
    };

    var foodArray = ["Chicken Nuggets", "Cheese Pizza","Pepperoni Pizza", "Salisbury Steak", "Tater Tots", "Pasta", "PB&J", "Chocolate Chip Cookies", "Soft Pretzels", "Chicken Sandwich", "Hot Dogs", "Burgers", "Grilled Cheese"]

    stats.negAccounts = Math.floor(Math.random()*40);
    stats.avgBalance = Math.floor(Math.random()*20)
    stats.totalBalance = stats.negAccounts*stats.avgBalance;
    stats.percentRaised = Math.random()*0.9;
    stats.percentHeight = (stats.percentRaised*156).toFixed(0);
    stats.totalRaised = stats.totalBalance*stats.percentRaised;
    stats.currentBalance = stats.totalBalance-stats.totalRaised;
    stats.lunchCost = (Math.random()*1.5).toFixed(2);

    stats.teacher.name = Faker.Name.findName();
    stats.teacher.grade = Math.floor(Math.random()*6);
    stats.teacher.phrase = Faker.Company.catchPhrase();
    stats.teacher.desc = "Teacher Of The Month - February 2014";

    stats.student.name = Faker.Name.findName();
    stats.student.grade = Math.floor(Math.random()*6);
    stats.student.food = Faker.random.array_element(foodArray);
    stats.student.desc = "This kid is smart as hell";
    
    return stats;
  };

//MAIN CODE ---- to run on load

  var schoolCode = JSON.parse(localStorage["clicked-item"]).toString();

  var schoolProfileObject= getFullObject(schoolCode);
  var schoolProfileSource = $("#school-profile").html();
  var schoolProfileTemplate = Handlebars.compile(schoolProfileSource);

  var profileElement = schoolProfileTemplate(schoolProfileObject);
  
  $("#profile-container").text("");
  $("#profile-container").append(profileElement);


});