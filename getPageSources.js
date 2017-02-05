function getUserText(document_root) {
    // Gets names of threads and comments
	var pArray = document.querySelectorAll('a.title.may-blank.loggedin, div.md > p');
	var textArray = [];
	for (var i = 0; i < pArray.length; i++)
	{
		pArray[i].setAttribute("id",i.toString());
		textArray.push(pArray[i].innerHTML);
	}
	return textArray;	
}

function onWindowLoad(){
    chrome.runtime.sendMessage({
		type: "raw_posts",
        userTextArray: getUserText(document)
    });
}

function message_callback(request, sender) {
	if (request.type === "highlight"){
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
	else if (request.type === "scroll"){
		console.log("In scroll handler");
		var element_id = request.element_id;
		var y = document.getElementById(element_id).offsetTop;
		window.scroll(0, y);
	}
}

chrome.runtime.onMessage.addListener(message_callback);
 
// pass the function you want to call at 'window.onload', in the function defined above
window.onload = onWindowLoad;

// document.querySelectorAll('form.toggle.remove-button');
// document.querySelectorAll('form.toggle.remove-button > [value=removed]');