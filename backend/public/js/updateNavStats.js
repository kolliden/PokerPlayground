fetch(
    "http://localhost:3000" + "/api/auth/me", {
    method: "GET",
}
).then(response => {
    if (!response.ok) {
        console.error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
}).then((data) => {
    document.getElementById('nav-rank').innerHTML = data.user.rank;
    document.getElementById("nav-xp").innerHTML = data.user.level;
}).catch((error) => {
    console.error("Error:", error);
});