import ext from "./utils/ext";

var getVideoURLs = () => {
	let urls = [...document.querySelectorAll('iframe')].map(c => [...c.contentWindow.document.querySelectorAll('video[src]')]).flat()

	let findParentWithAttr = function (item, attr) {
		while (item.parentNode && !item[attr]) {
			item = item.parentNode;
		}
		return item[attr];
	}

	urls = urls.map(itm => ({ src: itm.src, title: findParentWithAttr(itm, 'title') }))

	return urls;
}

function onRequest(request, sender, sendResponse) {
	if (request.action === 'process-page') {
		sendResponse(getVideoURLs())
	}
}

ext.runtime.onMessage.addListener(onRequest);