function injectScript(file_path, tag) {
  const node = document.getElementsByTagName(tag)[0];
  const script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  script.setAttribute("src", file_path);
  node.appendChild(script);
  console.log("injected");
}

injectScript(chrome.runtime.getURL("js/content.js"), "body");
const graphQlBM =
  "https://graph.facebook.com/v14.0/me/businesses?fields=name,permitted_roles,is_disabled_for_integrity_reasons,business_invoices,created_time,verification_status,owned_ad_accounts%7Bsufunding_id,adtrust_dsl,balance,is_prepay_account,currency,account_id,account_status,partner,name,funding_source_details,amount_spent,insights.date_preset(maximum)%7Bspend%7D,adspaymentcycle%7Bthreshold_amount%7D%7D&limit=200&access_token=";
const graphQlAds =
  "https://graph.facebook.com/v12.0/me/adaccounts?limit=5000&fields=name,account_status,account_id,owner_business,created_time,next_bill_date,currency,adtrust_dsl,timezone_name,timezone_offset_hours_utc,business_country_code,disable_reason,adspaymentcycle{threshold_amount},balance,is_prepay_account,owner,all_payment_methods{pm_credit_card{display_string,exp_month,exp_year,is_verified},payment_method_direct_debits{address,can_verify,display_string,is_awaiting,is_pending,status},payment_method_paypal{email_address},payment_method_tokens{current_balance,original_balance,time_expire,type}},total_prepay_balance,insights.date_preset(maximum){spend}&access_token=";

chrome.runtime.onMessage.addListener(function (request, sender, callback) {
  console.log(request);
  if (request.message === "cookie") {
    chrome.runtime.sendMessage({ message: "cookie", data: request.data });
  }

  if (request.message === "fb-basic") {
    chrome.runtime.sendMessage({ message: "fb-basic", data: request.data });
  }

  if (request.message === "getAccessToken") {
    const accessToken = getAccessToken();
    chrome.runtime.sendMessage(
      {
        action: "xhttp",
        url_bm: graphQlBM,
        url_ads: graphQlAds,
        data: accessToken,
      },
      (response) => {
        console.log("response", response);
      }
    );
  }
});

function getAccessToken() {
  var source = "<html>";
  source += document.getElementsByTagName("html")[0].innerHTML;
  source += "</html>";
  source = source.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  source = "<pre>" + source + "</pre>";

  const findingAccessToken1 = source.split("accessToken");
  const findingAccessToken2 = findingAccessToken1[2]?.split(`\"`);
  const accessToken = findingAccessToken2[2];
  return accessToken;
}

let extensionPort;

const setupFunction = () => {
  console.log("set up");
  extensionPort = chrome.runtime.connect({ name: "hi" });
  console.log("port: ", extensionPort);
};

setupFunction();
