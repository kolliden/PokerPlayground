var User;
const unorderStatItemList = document.getElementById("account-stats");

fetch(
    domain + "/api/auth/me", {
        method: "GET",
    }
).then(response => {
    if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
    }
    console.log(response);
    return response.json();
}).then((data) => {
    console.log(data.user);
    for (let key in data.user) {
        if (data.user.hasOwnProperty(key)) {
            let listItem = document.createElement("li");
            listItem.appendChild(document.createTextNode(`${key}: ${data.user[key]}`));
            unorderStatItemList.appendChild(listItem);
        }
    }
}).catch((error) => {
    console.error("Error:", error);
});