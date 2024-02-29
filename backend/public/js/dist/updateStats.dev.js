"use strict";

var User;
var unorderStatItemList = document.getElementById("account-stats");
fetch(domain + "/api/auth/me", {
  method: "GET"
}).then(function (response) {
  if (!response.ok) {
    console.error("HTTP error! Status: ".concat(response.status));
  }

  console.log(response);
  return response.json();
}).then(function (data) {
  console.log(data.user);

  for (var key in data.user) {
    if (data.user.hasOwnProperty(key)) {
      var listItem = document.createElement("li");
      listItem.appendChild(document.createTextNode("".concat(key, ": ").concat(data.user[key])));
      unorderStatItemList.appendChild(listItem);
    }
  }
})["catch"](function (error) {
  console.error("Error:", error);
});