function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
  console.log("injected");
}

injectScript(chrome.runtime.getURL("js/content.js"), "body");

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  console.log(request);
});

let extensionPort;
const setupFunction = () => {
  extensionPort = chrome.runtime.connect({ name: "hi" });
  console.log("port: ", extensionPort);
  extensionPort.onDisconnect.addListener(onDisconnectListener);
};

const onDisconnectListener = () => {
  const lastError = chrome.runtime.lastError;

  extensionPort.onDisconnect.removeListener(onDisconnectListener);

  if (lastError) {
    setTimeout(setupFunction, 1000);
  }
};

setupFunction();
