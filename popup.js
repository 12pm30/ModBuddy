console.log("popup.js");

var tabid;

// function doInCurrentTab(tabCallback) {
//     chrome.tabs.query({
//         lastFocusedWindow: true, 
//         active: true 
//     }, function (tabArray) { 
//         tabCallback(tabArray[0]); 
//     });
// }

function scroll_to_id(event){
  var element_id = event.target.id;
  console.log("scroll_to_id: " + element_id);

  console.log(tabid);

            console.log("sending scroll command");
            chrome.tabs.sendMessage(tabid,{
                type: "scroll",
                element_id: element_id
            })
}

function popupMessageHandler(request, sender)
{
    if (request.type === "to_popup"){
        var arrayFlaggedPosts = request.arrayFlaggedPosts;
        var arrayPostStatistics = request.arrayPostStatistics;
        var arrayRawPosts = request.arrayRawPosts;
        var tabUrl = request.tabUrl;
        tabid = request.tabid;
        console.log(tabid)
        for (var i = 0; i < arrayRawPosts.length; i++){
            if (arrayFlaggedPosts[i]){
                var html_text = "<input type=\"checkbox\" name=\"flag_group[]\" id=cb\"" + i + "\" />";
                //var html_text = "<OPTION id=" + i + ">";
                //html_text += "<a style=\"color:black;text-decoration: none\" href=\"" + tabUrl + "/#" + i + "\">";
                html_text += "<a name=my_check id=\"" + i + "\" style=\"color:black;text-decoration: none\" >";
                // html_text += "<font size=\"3\">";
                html_text += arrayRawPosts[i].substring(0, 35);
                html_text += "...";
                // html_text += "</font>";
                html_text += "</a>";
                html_text += "<br />";
				        //html_text += "</OPTION>";
                //html_text += "<option disabled=\"disabled\">----------------</option>";;
                console.log(html_text);
                document.getElementById('comments').innerHTML += html_text;
            }
        }
        document.getElementById("comments").addEventListener("click", scroll_to_id);

    }
}

function select_all_cb(event){
    var element = event.target;
    var strUser = element.options[element.selectedIndex].value;
    var comment_array = document.querySelectorAll('input');
    for (var i = 0; i < comment_array.length; i++){
        if (strUser === "Select All"){
            comment_array[i].checked=true
        }
        else if (strUser === "Select None"){
            comment_array[i].checked=false
        }
    }
}

function onWindowLoad()
{
    chrome.runtime.onMessage.addListener(popupMessageHandler);
    document.getElementById("All").addEventListener("change", select_all_cb);
    console.log("sending from_popup message");
    chrome.runtime.sendMessage({
                type: "from_popup"
        })
}


window.onload = onWindowLoad;

//////////////////////////////////////////////////////////////////////////////////////////////////////////
//window.alert("Hello world!");
/*
	Dropdown with Multiple checkbox select with jQuery - May 27, 2013
	(c) 2013 @ElmahdiMahmoud
	license:   http://www.opensource.org/licenses/mit-license.php
*/

$(".dropdown dt a").on('click', function() {
  $(".dropdown dd ul").slideToggle('fast');
});

$(".dropdown dd ul li a").on('click', function() {
  $(".dropdown dd ul").hide();
});

function getSelectedValue(id) {
  return $("#" + id).find("dt a span.value").html();
}

$(document).bind('click', function(e) {
  var $clicked = $(e.target);
  if (!$clicked.parents().hasClass("dropdown")) $(".dropdown dd ul").hide();
});


$('.mutliSelect input[type="checkbox"]').on('click', function() {

  var title = $(this).closest('.mutliSelect').find('input[type="checkbox"]').val(),
    title = $(this).val() + ",";

  if ($(this).is(':checked')) {
    var html = '<span title="' + title + '">' + title + '</span>';
    $('.multiSel').append(html);
    $(".hida").hide();
  } else {
    $('span[title="' + title + '"]').remove();
    var ret = $(".hida");
    $('.dropdown dt a').append(ret);

  }
});
