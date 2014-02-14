$(function() {
//OBJECT DEFINITIONS

  
  var loadRandomResults = function(){
    //Renders the result title and 3 random schools on load
    $(".query").remove();
    $(".result-item").remove();

    var randomTitleText = "some of the schools you can help NOW!";
    var randomResultTitle = resultTitleTemplate({desc: randomTitleText});

    $(".results").prepend(randomResultTitle);
    $(".results").append(getResult("random"));
    $(".results").append(getResult("random"));
    $(".results").append(getResult("random"));

    return false
  };


  var loadSearchResults = function(searchText, searchProperty, filterObject){
     /*
      Renders your search results
      searchText = text entered in search field by user
      searchProperty = object property on which to search
    */
    $(".query").remove();
    $(".result-item").remove();

    $.each($("#filter-bar input"), function(index, value){
        $(value).val("");
      });
    $("#filter-bar").show();

    var searchTitleText = "results for "+searchText;
    var searchResultTitle = resultTitleTemplate({desc: searchTitleText});

    $(".results").prepend(searchResultTitle);
    

    var resultArray = getResult(searchText, searchProperty, filterObject);
    console.log()

    if (resultArray.length>10) {
      //Adds pagination if the search results are long
      if ($(".pagination [data-page]").length===0) {loadPagination(resultArray);};

      var startIndex = page*10;
      var endIndex = startIndex+11;
      var pageArray = resultArray.slice(startIndex, endIndex);
      
      page++;
      $(".pagination").find("[data-page='{0}']".supplant([page])).toggleClass("active");

      $.each(pageArray, function(index, value){
        $("#filter-bar").after(value);
      });
    }
    else{
      $.each(resultArray, function(index, value){
        $("#filter-bar").after(value);
      });
    }

  };

  var getResult = function(searchText, searchProperty, filterObject){
  /*
    Creates DOM elements for results
    Single argument "random" will return single random element
    Passing in your search arguments and it will return an array of elements that match your search.
    Returns single DOM element or array of elements
  */
  if(searchText==="random"){
    var randomIndex = Math.floor(Math.random()*geocodedSchoolData.length);
    var randomItemElement = resultItemTemplate(getFullObject(geocodedSchoolData[randomIndex]["BCode"]));

    return randomItemElement;
  }

  else{
    var matchArray = filter(geocodedSchoolData, function(item){
      var found = item[searchProperty].toLowerCase().indexOf(searchText.toLowerCase());
      return found!==(-1);
    });

    var matchElements = map(matchArray, function(item){
      return resultItemTemplate(getFullObject(item.BCode));
    });
    
    if(filterObject){
      matchElements = filterResults(filterObject, matchElements);
    };

    return matchElements;
  };
  
};


  var loadPagination = function(resultsArray) {
    var pageNumObject = {};
    var paginationSource = $("#pagination").html();
    var paginationTemplate = Handlebars.compile(paginationSource);

    for (var i = 0; i < Math.ceil(resultsArray.length/10); i++) {
      pageNumObject[i+1]=(i+1);
    };

    var paginationElement = paginationTemplate({pageNum: pageNumObject});
    $(".pagination .prev-arrow").after(paginationElement);
    $(".pagination").show();
  };

  var filterResults = function(filterObject, results) {

    return filter(results, function(item){
      var schoolCode = $(item).attr("data-id");
      var itemObject = getFullObject(schoolCode);

      var poverty = Boolean( ((filterObject["poverty-min"] ? parseInt(filterObject["poverty-min"]) : 0) <= parseInt(itemObject.zipPercent.poverty))&&(parseInt(itemObject.zipPercent.poverty)<= (filterObject["poverty-max"] ? parseInt(filterObject["poverty-max"]) : 9999999)) );
      var food = Boolean( ((filterObject["food-min"] ? parseInt(filterObject["food-min"]) : 0) <= parseInt(itemObject.zipPercent.foodAid))&&(parseInt(itemObject.zipPercent.foodAid)<= (filterObject["food-max"] ? filterObject["food-max"] : 9999999)) );
      var income = Boolean( ((filterObject["income-min"] ? parseInt(filterObject["income-min"]) : 0) <= parseInt(itemObject.zipEstimate.medianIncome))&&(parseInt(itemObject.zipEstimate.medianIncome)<= (filterObject["income-max"] ? filterObject["income-max"] : 9999999)) );i
      var rank = Boolean( ((filterObject["rank-min"] ? parseInt(filterObject["rank-min"]) : 0) <= parseInt(itemObject.school.Rank))&&(parseInt(itemObject.school.Rank)<= (filterObject["rank-max"] ? parseInt(filterObject["rank-max"]) : 9999999)) );
      var lunchCost = Boolean( ((filterObject["lunchCost-min"] ? parseInt(filterObject["lunchCost-min"]) : 0) <= parseInt(itemObject.otherStats.lunchCost))&&(parseInt(itemObject.otherStats.lunchCost)<= (filterObject["lunchCost-max"] ? filterObject["lunchCost-max"] : 9999999)) );
      var accounts = Boolean( ((filterObject["negAccounts-min"] ? parseInt(filterObject["negAccounts-min"]) : 0) <= parseInt(itemObject.otherStats.negAccounts))&&(parseInt(itemObject.otherStats.negAccounts)<= (filterObject["negAccounts-max"] ? filterObject["negAccounts-max"] : 9999999)) );
      var raised = Boolean( ((filterObject["percentRaised-min"] ? parseInt(filterObject["percentRaised-min"]) : 0) <= parseInt(itemObject.otherStats.percentRaised*100))&&(parseInt(itemObject.otherStats.percentRaised*100)<= (filterObject["percentRaised-max"] ? filterObject["percentRaised-max"] : 9999999)) );

      return (poverty&&food&&income&&rank&&lunchCost&&accounts&&raised);
    });
    
  };



//MAIN CODE ---- to run on load
  var resultTitleSource = $("#result-title").html();
  var resultTitleTemplate = Handlebars.compile(resultTitleSource);

  var resultItemSource = $("#result-item").html();
  var resultItemTemplate = Handlebars.compile(resultItemSource);

  var page = 0;
  var searchInput="";
  var searchProp="";

  $(".pagination").hide();
  loadRandomResults();
  localStorage["clicked-item"] = JSON.stringify("");


//CLICK HANDLERS
  $("#search-button").on("click", function(){

    searchInput = $(this).closest(".input-group").find("input").val();
    searchProp = "BName"
    loadSearchResults(searchInput, searchProp);

  });

  $("#select-state").on("change", function(){

    searchInput = $(this).val();

    $(this).find("[selected='selected']").removeAttr("selected");
    $(this).attr("selected", "selected");

    searchProp = "State";
    loadSearchResults(searchInput, searchProp);
  });

  $(document).on("click", ".result-item", function(){

    var schoolId = $(this).attr("data-id");
    localStorage["clicked-item"] = JSON.stringify(schoolId);

    window.location = "school-page.html";
    return false;
  });

  $(document).on("click", ".pagination [data-page]", function(){
   
    page=$(this).attr("data-page")-1;
    $(".result-item").remove();
    $(".pagination [data-page]").removeClass("active");
    loadSearchResults(searchInput, searchProp);

  });

  $(document).on("click", ".prev-arrow", function(){

    page=Math.max(page-2,0);
    $(".result-item").remove();
    $(".pagination [data-page]").removeClass("active");
    loadSearchResults(searchInput, searchProp);

  });

  $(document).on("click", ".next-arrow", function(){
    
    $(".pagination [data-page]").removeClass("active");
    loadSearchResults(searchInput, searchProp);

  });

  $(document).on("click", "#filter-update", function(){

    var filterElements = $(this).closest("#filter-bar").find("input");
    var filterObject = {};
    for (var i = 0; i < filterElements.length; i++) {
      var name = $(filterElements[i]).attr("id");
      var value = $(filterElements[i]).val();

      filterObject[name] = value;
    };
    
    loadSearchResults(searchInput, searchProp, filterObject);
  });

});


