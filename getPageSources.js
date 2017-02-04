function getUserText(document_root) {
	var pArray = document.querySelectorAll('div.md > p');
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
 
// pass the function you want to call at 'window.onload', in the function defined above
window.onload = onWindowLoad;

// document.querySelectorAll('form.toggle.remove-button');
// document.querySelectorAll('form.toggle.remove-button > [value=removed]');