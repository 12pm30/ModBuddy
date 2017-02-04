chrome.runtime.onMessage.addListener(function(request, sender){
	var userTextArray = request.userTextArray;
	var userTextString = "";
	for (var i = 0; i < userTextArray.length; i++)
	{
		userTextString += userTextArray[i];
	}
	
	message.innerText = userTextString;
});

function onWindowLoad() {
	var message = document.querySelector('#message');
	
	chrome.tabs.executeScript(null, {
		file: "getPagesSource.js"
	}, function() {
		if (chrome.runtime.lastError) {
			message.innerText = 'There was an error injecting script : \n' + chrome.runtime.lastError.message;
		}
	});
}

window.onload = onWindowLoad;

// window.alert("Hello world!");

