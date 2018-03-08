//Create an object to handle the parameters of the search
var paramObject = {
    searchTerm : '&fq=sports&page=0',
    setSearchTerm : function(term){
      //If the term is not empty and exists, set the obect to the term
      this.searchTerm = term != null && term != ''? this.searchTerm + term : null;
    },
    beginDate: '&begin_date=',
    setBeginDate: function(year){
        this.beginDate = year != null && year != ''? this.beginDate + year + '0101' : null;
    },
    endDate : '&end_date=',
    setEndDate: function(year){
        this.endDate = year != null && year != ''? this.endDate + year + '0101' : null;
    },
    limit : 10,
    setLimit: function(limit){
        this.limit = limit != null && limit != ''? limit : 10;
    },
};

//Create an object to handle the api requests
var requestObject = {
    api_key : '&api-key=8938b688f68e46318cfe7d6e16a91478',
    baseURL : 'https://api.nytimes.com/svc/search/v2/articlesearch.json?q=new+york+times&page=0&sort=newest',
    setURL : function(paramObject){
        return this.baseURL +  paramObject.searchTerm + paramObject.beginDate + paramObject.endDate +  this.api_key;
    }
    
};

function retrieveArticles(parameters){
    //set the request object
    theURL = requestObject.setURL(parameters);
    $.ajax({
        url: theURL,
        method: "GET"
    }).done(function(response){
        
        // return arrays for processing
        displayArticles(response.response.docs);
    });
}

function displayArticles(theArticleArray){
    //create div container for article and text
     
    $('#well-section').empty();

    console.log(paramObject.limit);
    for(var i = 0; i < paramObject.limit; i++){
        var theDiv = $('<div>');
        var theHeadline = $('<h2>');
        var theLink = $('<a>');

        var theSpan = $('<span>');
        theSpan.text((i+1));
        //theSpan.append(" " + theArticleArray[i].snippet);
        theLink.append(theSpan);
        theLink.attr('href', theArticleArray[i].web_url.replace(/\s+/g, ''));
        theLink.attr('target','_blank');
        theLink.append(" " + theArticleArray[i].snippet);
        var theByLine = $('<h3>');
        theByLine.text(theArticleArray[i].byline.original);
        theHeadline.append(theLink);
        theDiv.append(theHeadline);
        theDiv.append(theByLine);

        if((i + 1)%2===0){
            theDiv.addClass("evenClass");
            theLink.addClass("evenClass");
            theSpan.addClass("evenSpan");
        }else{
            theSpan.addClass("oddSpan");
        }

        //finally attach to DOM
        $('#well-section').append(theDiv);

    }

}

function clearAll(){
   // Reacts to clear button by clearing all input values
   $('#search-term').val('');
   $('#start-year').val('')
   $('#end-year').val('')
   $('#num-records-select').val(5)
   initializeParamObject();
}

function initializeParamObject(){
  // Resets object to origina parameters
  paramObject.searchTerm = '&fq=sports&page=0';
  paramObject.beginDate = '&begin_date=';
  paramObject.endDate = '&end_date='
  paramObject.limit = 10;
 }


//Instruct jQuery to wait until document is loaded and all 
// events have been bound
$(document).ready(function(){
  //In the search term, listen for keydown.  If the key is pressed enable search
  // and clear buttons
  $('#clear-all').on('click', function(event){
      clearAll();
  });

  $("#run-search").on("click",function(event){
      event.preventDefault();
      initializeParamObject();
      //Get the values of the parameters and place in the paramObject
      var searchTerm = $('#search-term').val().replace(/\s+/g, "'");
      var limit = $( "#num-records-select option:selected" ).text();
      var beginYear = $('#start-year').val();
      var endYear = $('#end-year').val();

      // Build the parameter object
      paramObject.setSearchTerm(searchTerm);
      paramObject.setLimit(limit);
      paramObject.setBeginDate(beginYear);
      paramObject.setEndDate(endYear);

      //Call the function to retrieve articles
      
      retrieveArticles(paramObject);
  });

   $('#well-section').on('mouseenter','span',function(){
       //If the span is hovered over, it shakes
       $(this).effect("shake",{times:4},1000);
   });


});