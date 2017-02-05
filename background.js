// Perform callback on the active tab.
function doInCurrentTab(tabCallback) {
    chrome.tabs.query({
        lastFocusedWindow: true, 
        active: true 
    }, function (tabArray) { 
        tabCallback(tabArray[0]); 
    });
}

// Updates badge on page to num_unwated_posts
function update_badge(numUnwantedPosts)
{
    doInCurrentTab( function(tab){
        if (tab){
            console.log("update_badge has tab");
            var activeTabId = tab.id;
            chrome.browserAction.setBadgeText({text:numUnwantedPosts.toString(), tabId:activeTabId});
            chrome.browserAction.setBadgeBackgroundColor({color:"#606060", tabId:activeTabId});
        }
    });
}

function flask_server_cb(){
    var responseArray=JSON.parse(this.responseText);
    var numUnwantedPosts = 0;
    var arrayFlaggedPosts = [];
    var arrayPostStatistics = [];
    for (var i = 0; i < responseArray.length; i++)
    {
        var post_data = JSON.parse(responseArray[i]);
        arrayPostStatistics.push(post_data);
        console.log(post_data);
        if ( post_data.harassingComment.true > 0.5 || 
             post_data.sentiment < 0.4 )
        {
            numUnwantedPosts++;
            arrayFlaggedPosts.push(true);
        }
        else
        {
            arrayFlaggedPosts.push(false);
        }
    }
    update_badge(numUnwantedPosts);

    doInCurrentTab( function(tab){
        if (tab){
            console.log("send message has tab");
            chrome.tabs.sendMessage(tab.id,{
                arrayFlaggedPosts: arrayFlaggedPosts,
                arrayPostStatistics: arrayPostStatistics
            })
        }
    });
}

// 
function message_callback(request, sender) {
    var userTextArray = request.userTextArray;
	var JSON_userTextArray = JSON.stringify(userTextArray);
    // Format data to send over the http request
    var formData = new FormData();
    formData.append("comment-text", JSON_userTextArray);
    formData.append("request-type", "array");
    // Send http request
    oReq.open("POST", "http://lowcost-env.fcu9igck3m.us-east-1.elasticbeanstalk.com/analyze");
    oReq.send(formData);
    formData.delete;
}

/** Main, functionless script */

/** Set listeners */
// Set listeners to update badge on page change
// chrome.tabs.onUpdated.addListener(update_badge);
// chrome.tabs.onActivated.addListener(update_badge);
// Set listener for message
chrome.runtime.onMessage.addListener(message_callback);

// Setup HTTP request object for communication with flask server
var oReq = new XMLHttpRequest();
oReq.addEventListener("load", flask_server_cb);