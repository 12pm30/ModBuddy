function update_badge()
{
    chrome.tabs.query({
        active: true,               // Select active tabs
        lastFocusedWindow: true     // In the current window
    }, function(array_of_Tabs) {
        // Since there can only be one active tab in one active window, 
        //  the array has only one element
        var activeTabId = array_of_Tabs[0].id;
        var active_tab_string = activeTabId.toString();
        chrome.browserAction.setBadgeText({text:active_tab_string, tabId:activeTabId});
    });
}

// update badge on page load
update_badge();

// Set listeners to update badge on page change
chrome.tabs.onUpdated.addListener(update_badge);
chrome.tabs.onActivated.addListener(update_badge);

// chrome.browserAction.setBadgeBackgroundColor();