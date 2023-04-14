chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  var activeTab = tabs[0];
  console.log(activeTab);
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener((msg) => {
    // Handle message however you want
  });
});
