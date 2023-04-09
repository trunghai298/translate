const getAccessTokenBtn = document.getElementById("getAccessToken");

async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

getAccessTokenBtn.addEventListener("click", async () => {
  const tab = await getCurrentTab();

  await chrome.scripting.executeScript({
    func: getAccessToken,
    target: {
      tabId: tab.id,
    },
    world: "MAIN",
  });
});

function getAccessToken() {
  var source = "<html>";
  source += document.getElementsByTagName("html")[0].innerHTML;
  source += "</html>";
  //now we need to escape the html special chars, javascript has escape
  //but this does not do what we want
  source = source.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  //now we add <pre> tags to preserve whitespace
  source = "<pre>" + source + "</pre>";

  const findingAccessToken1 = source.split("accessToken");
  const findingAccessToken2 = findingAccessToken1[2]?.split(`\"`);
  const accessToken = findingAccessToken2[2];

  let accessTokenh2 = document.getElementById("access-token");
  navigator.clipboard.writeText(accessToken).then(
    function () {
      console.log("Async: Copying to clipboard was successful!");
    },
    function (err) {
      console.error("Async: Could not copy text: ", err);
    }
  );
  if (accessToken) {
    let h2 = document.createElement("h2");
    let content = document.createTextNode("access-token: " + accessToken);
    h2.appendChild(content);
    console.log(h2);
    accessTokenh2.appendChild(h2);
  }
}
function showCookiesForTab(tabs) {
  //get the first tab object in the array
  let tab = tabs.pop();

  //get all cookies in the domain
  let gettingAllCookies = chrome.cookies.getAll({ url: tab.url });
  gettingAllCookies.then((cookies) => {
    let cookieList = document.getElementById("cookie-list");

    if (cookies.length > 0) {
      //add an <li> item with the name and value of the cookie to the list
      for (let cookie of cookies) {
        let li = document.createElement("li");
        let content = document.createTextNode(
          cookie.name + ": " + cookie.value
        );
        li.appendChild(content);
        cookieList.appendChild(li);
      }
    }
  });
}

//get active tab to run an callback function.
//it sends to our callback an array of tab objects
function getActiveTab() {
  return chrome.tabs.query({ currentWindow: true, active: true });
}
getActiveTab().then(showCookiesForTab);
