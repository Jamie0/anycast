import ext from "./utils/ext";
import storage from "./utils/storage";

var radioButtons = document.querySelectorAll(".devices input[type=radio]");
var device;

storage.get('device', function(resp) {
	device = resp.device;
	var option;
	if (device) {
		option = document.querySelector(`.devices input[value="${device}"]`);
	} else {
		option = document.querySelector('.devices input[type=radio]')
	}

	option.setAttribute("checked", "checked");
});

window.refresh = () => fetch('http://127.0.0.1:5207/devices', { method: 'POST' }).then(s => s.json()).then(devices => {
	let base = document.querySelector('.devices.radio-group');
	base.innerHTML = '';
	for (var dev of devices) {
		let label = document.createElement('label')
		let el = document.createElement('input')
		el.type = 'radio';
		el.name = 'device';
		el.value = dev.host;
		label.appendChild(el);
		label.appendChild(document.createTextNode(dev.name))

		base.appendChild(label);

		if (el.value == device) {
			el.checked = 'checked';
		}
	}
})

refresh();

radioButtons.forEach(function(el) {
	el.onclick =function(e) {
		var value = this.value;
		storage.set({ device: value })
	}
})