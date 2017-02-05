var numUnwantedPosts = 0;

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
function update_badge()
{
    doInCurrentTab( function(tab){
            var activeTabId = tab.id;
            chrome.browserAction.setBadgeText({text:numUnwantedPosts.toString(), tabId:activeTabId});
            chrome.browserAction.setBadgeBackgroundColor({color:"#606060", tabId:activeTabId});
        });
}

// 
function message_callback(request, sender) {
    var userTextArray = request.userTextArray;
	numUnwantedPosts = userTextArray.length;
    update_badge();
}

/** Main, functionless script */

/** Set listeners */
// Set listeners to update badge on page change
// chrome.tabs.onUpdated.addListener(update_badge);
// chrome.tabs.onActivated.addListener(update_badge);
// Set listener for message
chrome.runtime.onMessage.addListener(message_callback);

