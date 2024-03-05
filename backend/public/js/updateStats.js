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
    for (let key in data.user) {
        if (data.user.hasOwnProperty(key)) {
            let listItem = document.getElementById(key);
            if (listItem) {
                listItem.innerHTML = data.user[key];
            }
        }
    }
}).catch((error) => {
    console.error("Error:", error);
});