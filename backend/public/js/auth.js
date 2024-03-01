// Function to handle registration
const domain = "http://localhost:3000";

//If not on register or login page and not authenticated, redirect to login page
if (window.location.pathname !== "/register.htm" && window.location.pathname !== "/login.htm") {
    fetch(domain + "/api/auth/me", {
        method: "GET",
        credentials: "include",
    }).then(response => {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            window.location.href = "/login.htm"
        }
        return response.json();
    }).then((data) => {
        if (data.message) {
            if (data.message === "User found") {
                console.log("User found");
            }
        }
    }).catch((error) => {
        console.error("Error:", error);
    });
}

async function register() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;

    console.log("fetching Register");
    // Create a new user from server
    const newUser = {
        username: username, email: email, phoneNumber: phoneNumber, password: password,
    };
    console.log(newUser);
    console.log(JSON.stringify(newUser));
    // Send the user to the server
    await fetch(domain + "/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
        credentials: "include",
    }).then(response => {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then((data) => {
        console.log(data);
        if (data.message || data.error) {
            console.log(data);
            alert(data.message, data.error);
        } else {
            console.log(data);
            window.location.href = "/index.htm"
        }
    }).catch((error) => {
        console.error("Error:", error);
    });
}

async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const user = {
        username: username,
        password: password,
    };
    await fetch(domain + "/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
    }).then(response => {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        return response.json();
    }).then((data) => {
        console.log(data);
        if (data.message) {
            if (data.status === "success") {
                window.location.href = "/index.htm"
            }
            alert(data.message);
        }
    }).catch((error) => {
        console.error("Error:", error);
    });
}

async function logout() {
    await fetch(domain + "/api/auth/logout", {
        method: "GET",
        credentials: "include",
    }).then(response => {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    }).then((data) => {
        console.log(data);
        if (data.message) {
            if (data.message === "Logout successful.") {
                window.location.href = "/login.htm"
            }
        }
    }).catch((error) => {
        console.error("Error:", error);
    });
}

async function getUserData() {
    await fetch(
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
        console.log(data);
        User = data.user;
    }).catch((error) => {
        console.error("Error:", error);
    });
    return User
}

