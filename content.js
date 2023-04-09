function injectScript(file_path, tag) {
  var node = document.getElementsByTagName(tag)[0];
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
  console.log("injected");
}

injectScript(chrome.runtime.getURL("content.js"), "body");
chrome.runtime.sendMessage({ message: "getCookie" }, (response) => {
  console.log("response", response);
  if (response.message === "success") {
    console.log("success receive msg from bg");
  }
});
