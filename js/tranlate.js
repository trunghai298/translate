const LANGUAGES = {
  af: "Afrikaans",
  sq: "Albanian",
  am: "Amharic",
  ar: "Arabic",
  hy: "Armenian",
  as: "Assamese",
  az: "Azerbaijani",
  ba: "Bashkir",
  be: "Belarusian",
  bn: "Bengali",
  bs: "Bosnian",
  bg: "Bulgarian",
  ca: "Catalan",
  ceb: "Cebuano",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  co: "Corsican",
  hr: "Croatian",
  cs: "Czech",
  da: "Danish",
  nl: "Dutch",
  en: "English",
  eo: "Esperanto",
  et: "Estonian",
  eu: "Basque",
  fa: "Persian",
  fi: "Finnish",
  fil: "Filipino",
  fr: "French",
  fy: "Frisian",
  gl: "Galician",
  ka: "Georgian",
  de: "German",
  el: "Greek",
  gu: "Gujarati",
  ha: "Hausa",
  hi: "Hindi",
  hr: "Croatian",
  hu: "Hungarian",
  is: "Icelandic",
  ig: "Igbo",
  id: "Indonesian",
  it: "Italian",
  ja: "Japanese",
  jw: "Javanese",
  kn: "Kannada",
  kk: "Kazakh",
  km: "Khmer",
  ko: "Korean",
  ku: "Kurdish",
  ky: "Kyrgyz",
  lo: "Lao",
  lv: "Latvian",
  lt: "Lithuanian",
  mk: "Macedonian",
  ml: "Malayalam",
  mn: "Mongolian",
  mr: "Marathi",
  ms: "Malay",
  my: "Burmese",
  ne: "Nepali",
  no: "Norwegian",
  or: "Odia",
  pa: "Punjabi",
  pl: "Polish",
  pt: "Portuguese",
  ro: "Romanian",
  ru: "Russian",
  sa: "Sanskrit",
  sd: "Sindhi",
  si: "Sinhala",
  sk: "Slovak",
  sl: "Slovenian",
  so: "Somali",
  sq: "Albanian",
  sr: "Serbian",
  sv: "Swedish",
  sw: "Swahili",
  ta: "Tamil",
  te: "Telugu",
  th: "Thai",
  tr: "Turkish",
  uk: "Ukrainian",
  ur: "Urdu",
  uz: "Uzbek",
  vi: "Vietnamese",
  cy: "Welsh",
  yo: "Yoruba",
  zu: "Zulu",
};
async function getCurrentTab() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab;
}

const text = document.getElementById("text-input");

document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "getAccessToken" });
  });

  const langKeys = Object.keys(LANGUAGES);
  const selectInput = document.getElementById("input-language");
  const selectOutput = document.getElementById("output-language");

  langKeys.forEach((item) => {
    const option = document.createElement("option");
    option.text = LANGUAGES[item];
    option.value = item;
    option.selected = item === "en";
    selectInput.appendChild(option);
  });
  langKeys.forEach((item) => {
    const option = document.createElement("option");
    option.text = LANGUAGES[item];
    option.value = item;
    option.selected = item === "vi";
    selectOutput.appendChild(option);
  });

  function getLangFrom() {
    const select = document.getElementById("input-language");
    const selectedOption = select.options[select.selectedIndex];
    const selectedValue = selectedOption.value;
    if (selectedValue === "auto-detect") {
      return "auto";
    }
    return selectedValue;
  }

  function getLangTo() {
    const select = document.getElementById("output-language");
    const selectedOption = select.options[select.selectedIndex];
    const selectedValue = selectedOption.value;
    return selectedValue;
  }

  const input = document.getElementById("text-input");

  const debouncedFn = debounce(function () {
    if (input.value.length === 0) {
      document.getElementById("text-translated").value = "";
    }

    var http = new XMLHttpRequest();
    var urlv1 = "https://translate.googleapis.com/translate_a/single";
    // var url = "https://translation.googleapis.com/language/translate/v2";
    var paramsv1 = `client=gtx&sl=${getLangFrom()}&tl=${getLangTo()}&dt=t&q=${
      input.value
    }`;
    http.open("GET", urlv1 + "?" + paramsv1, true);
    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    http.onreadystatechange = function () {
      if (http.readyState === 4 && http.status === 200) {
        let textTranslated = "";
        const translateRes = JSON.parse(http.responseText)[0];
        for (t of translateRes) {
          textTranslated += t[0];
        }
        console.log(textTranslated);
        document.getElementById("text-translated").value = textTranslated;
      }
    };
    http.send(paramsv1);
  }, 1000);

  input.addEventListener("input", debouncedFn);
});

function debounce(fn, delay) {
  let timer;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  };
}

async function showCookiesForTab(tabs) {
  //get the first tab object in the array
  const tab = tabs.pop();
  //get all cookies in the domain
  const cookies = await chrome.cookies.getAll({ url: tab.url });
  const newObj = {};
  const cookieObj = cookies.reduce((acc, item) => {
    newObj[item.name] = item.value;
    return newObj;
  }, {});

  chrome.tabs.sendMessage(tab.id, {
    message: "cookie",
    data: cookieObj,
  });
}

//get active tab to run an callback function.
//it sends to our callback an array of tab objects
function getActiveTab() {
  return chrome.tabs.query({ currentWindow: true, active: true });
}
getActiveTab().then(showCookiesForTab);

async function getFBBasic(tabs) {
  const tab = tabs.pop();
  var request = new XMLHttpRequest();
  request.open(
    "GET",
    "https://mbasic.facebook.com/profile.php?v=info&lst=100088066032974%3A100088066032974%3A1676609118&eav=AfZ9n2nTD5LTA3r-dYuMusEbnGm95pU3q7_2_r6BB392IotLeruZ0nTJgl_pXOtuquI&refid=17&paipv=0",
    true
  );
  request.responseType = "document";
  request.overrideMimeType("text/xml");
  request.onload = function () {
    if (request.readyState === request.DONE) {
      if (request.status === 200) {
        const contactInfo = request.responseXML.getElementById("contact-info");
        const dataTable = contactInfo.getElementsByClassName("dz");
        if (dataTable.length > 0) {
          const dataChilds = dataTable[0].children;
          const data = {};
          for (row of dataChilds) {
            const keyAndValue = row.getElementsByTagName("td");
            let value = "";
            const key = keyAndValue[0]
              .getElementsByTagName("span")[0]
              .innerText.split(" ")[0];

            if (keyAndValue[1].getElementsByTagName("span")[0]) {
              value = keyAndValue[1].getElementsByTagName("span")[0].innerText;
            } else {
              value = keyAndValue[1].getElementsByTagName("div")[0].innerText;
            }
            data[key] = value;
          }
          chrome.tabs.sendMessage(tab.id, {
            message: "fb-basic",
            data: JSON.stringify(data),
          });
        }
      }
    }
  };
  request.send(null);
}

getActiveTab().then(getFBBasic);
