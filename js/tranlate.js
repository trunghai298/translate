async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

// getAccessTokenBtn.addEventListener("click", async () => {
//   const tab = await getCurrentTab();

//   await chrome.scripting.executeScript({
//     func: showCookiesForTab,
//     target: {
//       tabId: tab.id,
//     },
//     world: "MAIN",
//   });
// });

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

  if (accessToken) {
    let h2 = document.createElement("h2");
    let content = document.createTextNode("access-token: " + accessToken);
    h2.appendChild(content);
    console.log(h2);
    accessTokenh2.appendChild(h2);
  }
}
async function showCookiesForTab(tabs) {
  //get the first tab object in the array
  const tab = await getCurrentTab();
  //get all cookies in the domain
  let gettingAllCookies = chrome.cookies.getAll({ url: tab.url });
  alert("get cookie");

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

// //get active tab to run an callback function.
// //it sends to our callback an array of tab objects
// function getActiveTab() {
//   return chrome.tabs.query({ currentWindow: true, active: true });
// }
// getActiveTab().then(showCookiesForTab);

const translateBtn = document.getElementById("tranlate-btn");
const text = document.getElementById("text-input");

document.addEventListener("DOMContentLoaded", function () {
  translateBtn.addEventListener("click", async () => {
    var http = new XMLHttpRequest();
    var urlv1 = "https://translate.googleapis.com/translate_a/single";
    // var url = "https://translation.googleapis.com/language/translate/v2";
    var paramsv1 = `client=gtx&sl=auto&tl=vi&dt=t&q=${text.value}`;
    // var params = `q=${request.value}&target=en&key=AIzaSyCHUCmpR7cT_yDFHC98CZJy2LTms-IwDlM`;
    http.open("GET", urlv1 + "?" + paramsv1, true);

    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    http.onreadystatechange = function () {
      //Call a function when the state changes.
      if (http.readyState === 4 && http.status === 200) {
        const textTranslated = JSON.parse(http.responseText)[0][0][0];
        document.getElementById("text-translated").value = textTranslated;
      }
    };
    http.send(paramsv1);
  });
});
