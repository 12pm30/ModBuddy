console.log("popup.js");
function popupMessageHandler(request, sender)
{
	var URL = '';
	chrome.tabs.query({'active': true, 'lastFocusedWindow': true},
   function(tabs){
      URL = tabs[0].url.toString();
   });

	console.log(URL);
    if (request.type === "to_popup"){
        var arrayFlaggedPosts = request.arrayFlaggedPosts;
        var arrayPostStatistics = request.arrayPostStatistics;
        var arrayRawPosts = request.arrayRawPosts;
        for (var i = 0; i < arrayRawPosts.length; i++){
            if (arrayFlaggedPosts[i]){
                var html_text = "<OPTION id=" + i + "><a href=" + URL + "/#" + i + ">";
                html_text += arrayRawPosts[i].substring(0, 35);
                html_text += "..."
				html_text += "</a></OPTION>";
                html_text += "<option disabled=\"disabled\">----------------</option>";
                var comment_section = document.querySelector('#comments');
                comment_section.insertAdjacentHTML('beforeend', html_text);
            }
        }
    }
}

function sendContentRequest()
{
    console.log("sending from_popup message");
    chrome.runtime.sendMessage({
                type: "from_popup"
        })
}

chrome.runtime.onMessage.addListener(popupMessageHandler);

window.onload = sendContentRequest;

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
