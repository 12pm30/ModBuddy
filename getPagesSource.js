// @author Rob W <http://stackoverflow.com/users/938089/rob-w>
// Demo: var serialized_html = DOMtoString(document);

function getUserText(document_root) {
	var pArray = document.querySelectorAll('div.md > p');
	var textArray = [];
	for (var i = 0; i < pArray.length; i++)
	{
		textArray.push(pArray[i].innerHTML);
		console.log(textArray[i]);
	}
	return textArray;	
}

chrome.runtime.sendMessage({
    userTextArray: getUserText(document)
});