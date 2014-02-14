$(function() {
//OBJECT DEFINITIONS

  
  var loadRandomResults = function(){
    //Renders the result title and 3 random schools on load
    $(".query").remove();
    $(".result-item").remove();

    var randomTitleText = "some of the schools you can help NOW!";
    var randomResultTitle = resultTitleTemplate({desc: randomTitleText});

    $(".results").append(randomResultTitle);
    $(".results").append(getResult("random"));
    $(".results").append(getResult("random"));
    $(".results").append(getResult("random"));

    return false
  };

  var getResult = function(searchText, searchProperty){
    /*
      Creates DOM elements for results
      Single argument "random" will return single random element
      Passing in your search arguments and it will return an array of elements that match your search.
      Returns single DOM element or array of elements
    */
    if(searchText==="random"){
      var randomIndex = Math.floor(Math.random()*geocodedSchoolData.length);
      var randomItem = resultItemTemplate(geocodedSchoolData[randomIndex]);

      return randomItem;
    }

    else{
      var matchArray = filter(geocodedSchoolData, function(item){
        var found = item[searchProperty].toLowerCase().indexOf(searchText.toLowerCase());
        return found!==(-1);
      });

      var matchElements = map(matchArray, function(item){
        return resultItemTemplate(item);
      });

      return matchElements;
    };
    
  };

  var loadSearchResults = function(searchText, searchProperty){
     /*
      Renders your search results
      searchText = text entered in search field by user
      searchProperty = object property on which to search
    */
    $(".query").remove();
    $(".result-item").remove();

    var searchTitleText = "results for "+searchText;
    var searchResultTitle = resultTitleTemplate({desc: searchTitleText});

    $(".results").prepend(searchResultTitle);

    var resultArray = getResult(searchText, searchProperty);

    if (resultArray.length>10) {
      //Adds pagination if the search results are long
      if ($(".pagination [data-page]").length===0) {loadPagination(resultArray);};

      var startIndex = page*10;
      var endIndex = startIndex+11;
      var pageArray = resultArray.slice(startIndex, endIndex);
      
      page++;
      $(".pagination").find("[data-page='{0}']".supplant([page])).toggleClass("active");

      $.each(pageArray, function(index, value){
        $(".results").append(value);
      });
    }
    else{
      $.each(resultArray, function(index, value){
        $(".results").append(value);
      });
    }
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

});


