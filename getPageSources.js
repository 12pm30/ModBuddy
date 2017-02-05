function getUserText(document_root) {
    // Gets names of threads and comments
	var pArray = document.querySelectorAll('a.title.may-blank.loggedin, div.md > p');
	var textArray = [];
	for (var i = 0; i < pArray.length; i++)
	{
		textArray.push(pArray[i].innerHTML);
	}
	return textArray;	
}

function onWindowLoad(){
    chrome.runtime.sendMessage({
        userTextArray: getUserText(document)
    });
}

function message_callback(request, sender) {
    var arrayFlaggedPosts = request.arrayFlaggedPosts;
	var arrayPostStatistics = request.arrayPostStatistics;

	var pArray = document.querySelectorAll('a.title.may-blank.loggedin, div.md > p');
	for (var i = 0; i < pArray.length; i++)
	{
		if (arrayFlaggedPosts[i]){
			// console.log(pArray[i]);
			pArray[i].setAttribute("style","background-color:yellow");
		}
	}
}

chrome.runtime.onMessage.addListener(message_callback);
 
// pass the function you want to call at 'window.onload', in the function defined above
window.onload = onWindowLoad;

// document.querySelectorAll('form.toggle.remove-button');
// document.querySelectorAll('form.toggle.remove-button > [value=removed]');