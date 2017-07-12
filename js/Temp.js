 $contentLoadTriggered = false;
 $("#mainDiv").scroll(
     function() {
         if ($("#mainDiv").scrollTop() >= ($("#wrapperDiv").height() -
                 $("#mainDiv").height()) &&
             $contentLoadTriggered == false) {
             $contentLoadTriggered = true;
             $.ajax({
                 type: "POST",
                 url: "LoadOnScroll.aspx/GetDataFromServer",
                 data: "{}",
                 contentType: "application/json; charset=utf-8",
                 dataType: "json",
                 async: true,
                 cache: false,
                 success: function(msg) {
                     $("#wrapperDiv").append(msg.d);
                     $contentLoadTriggered = false;
                 },
                 error: function(x, e) {
                     alert("The call to the server side failed. " +
                         x.responseText);
                 }
             });
         }
     })