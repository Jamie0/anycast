import ext from "./utils/ext";
import storage from "./utils/storage";

var popup = document.getElementById("app");
storage.get('color', function(resp) {
  var color = resp.color;
  if(color) {
    popup.style.backgroundColor = color
  }
});

var template = (data) => {
  var json = JSON.stringify(data);
  return (`
  <div class="site-description">
    <h3 class="title">${data.title}</h3>
    <button data-item='${json}' id="save-btn" class="btn btn-primary">Cast</button>
  </div>
  `);
}
var renderMessage = (message) => {
  var displayContainer = document.getElementById("display-container");
  displayContainer.innerHTML = `<p class='message'>${message}</p>`;
}

var renderBookmark = (data) => {
  var displayContainer = document.getElementById("display-container")
  if(data && data.length) {
    var tmpl = data.map(template);
    displayContainer.innerHTML = tmpl;  
  } else {
    renderMessage("No castable videos were detected on this page")
  }
}

ext.tabs.query({active: true, currentWindow: true}, function(tabs) {
  var activeTab = tabs[0];
  chrome.tabs.sendMessage(activeTab.id, { action: 'process-page' }, renderBookmark);
});

popup.addEventListener("click", function(e) {
  if(e.target && e.target.matches("#save-btn")) {
    e.preventDefault();
    var data = e.target.getAttribute("data-item");

    storage.get('device', function ({ device }) {
      ext.runtime.sendMessage({ action: "cast", data: data, device }, function(response) {
        if(response && response.action === "saved") {
          renderMessage("Video sent to TV!");
        } else {
          renderMessage("There was an error: " + (response.error));
        }
      })
    })

  }
});

var optionsLink = document.querySelector(".js-options");
optionsLink.addEventListener("click", function(e) {
  e.preventDefault();
  ext.tabs.create({'url': ext.extension.getURL('options.html')});
})
