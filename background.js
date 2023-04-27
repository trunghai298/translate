const getData = async (urlBM, urlAds) => {
  const [BMRaw, AdsRaw] = await Promise.all([
    fetch(urlBM, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
    fetch(urlAds, {
      headers: {
        "Content-Type": "application/json",
      },
    }),
  ]);
  const [BMData, AdsData] = await Promise.all([BMRaw.json(), AdsRaw.json()]);

  return { BMData, AdsData };
};

chrome.runtime.onMessage.addListener((message, sender, callback) => {
  console.log(message);
  if (message.action === "xhttp") {
    const urlBM = message.url_bm + message.data;
    const urlADS = message.url_ads + message.data;

    getData(urlBM, urlADS).then((data) => {
      console.log("BM and ADS: ", data);
    });
    callback({ message: "ok" });
    return true;
  } else if (message.message === "cookie") {
    console.log("cookie: ", message.data);
  } else if (message.message === "fb-basic") {
    console.log("facebook basic: ", JSON.parse(message.data));
  }
});

chrome.runtime.onInstalled.addListener(async () => {
  for (const cs of chrome.runtime.getManifest().content_scripts) {
    for (const tab of await chrome.tabs.query({ url: cs.matches })) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: cs.js,
      });
    }
  }
});
