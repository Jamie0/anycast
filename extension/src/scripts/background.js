import ext from "./utils/ext";

ext.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
		(async function () {
			if (request.action === "cast") {
				let { src: url, title } = JSON.parse(request.data);

				try {
					url = (await fetch(url, { redirect: 'follow', method: 'HEAD' })).url || url;
				} catch (e) {}

				try {
					await fetch('http://localhost:8001/play?' + new URLSearchParams({
						url,
						title,
						device: request.device, 
						headers: JSON.stringify({ 'User-Agent': navigator.userAgent })
					}), {
						method: 'POST'
					});

					sendResponse({ action: "success" });
				} catch (e) {
					sendResponse({ action: "fail", error: String(e && e.message || e) });
				}
			}
		})()
		return true;
	}
);