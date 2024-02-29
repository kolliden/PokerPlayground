"use strict";

// Function to handle registration
var domain = "http://localhost:3000"; //If not on register or login page and not authenticated, redirect to login page

if (window.location.pathname !== "/register.htm" && window.location.pathname !== "/login.htm") {
  fetch(domain + "/api/auth/me", {
    method: "GET",
    credentials: "include"
  }).then(function (response) {
    if (!response.ok) {
      console.error("HTTP error! Status: ".concat(response.status));
      window.location.href = "/login.htm";
    }

    return response.json();
  }).then(function (data) {
    if (data.message) {
      if (data.message === "User found") {
        console.log("User found");
      }
    }
  })["catch"](function (error) {
    console.error("Error:", error);
  });
}

function register() {
  var username, password, email, phoneNumber, newUser;
  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          username = document.getElementById("username").value;
          password = document.getElementById("password").value;
          email = document.getElementById("email").value;
          phoneNumber = document.getElementById("phoneNumber").value;
          console.log("fetching Register"); // Create a new user from server

          newUser = {
            username: username,
            email: email,
            phoneNumber: phoneNumber,
            password: password
          };
          console.log(newUser);
          console.log(JSON.stringify(newUser)); // Send the user to the server

          _context.next = 10;
          return regeneratorRuntime.awrap(fetch(domain + "/api/auth/register", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(newUser),
            credentials: "include"
          }).then(function (response) {
            if (!response.ok) {
              console.error("HTTP error! Status: ".concat(response.status));
            }

            return response.json();
          }).then(function (data) {
            console.log(data);

            if (data.message || data.error) {
              console.log(data);
              alert(data.message, data.error);
            } else {
              console.log(data);
              alert("User registered successfully!");
              window.location.href = "/index.htm";
            }
          })["catch"](function (error) {
            console.error("Error:", error);
          }));

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
}

function login() {
  var username, password, user;
  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          username = document.getElementById("username").value;
          password = document.getElementById("password").value;
          user = {
            username: username,
            password: password
          };
          _context2.next = 5;
          return regeneratorRuntime.awrap(fetch(domain + "/api/auth/login", {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(user)
          }).then(function (response) {
            if (!response.ok) {
              console.error("HTTP error! Status: ".concat(response.status));
            }

            console.log(response);
            return response.json();
          }).then(function (data) {
            console.log(data);

            if (data.message) {
              if (data.status === "success") {
                window.location.href = "/index.htm";
              }

              alert(data.message);
            }
          })["catch"](function (error) {
            console.error("Error:", error);
          }));

        case 5:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function logout() {
  return regeneratorRuntime.async(function logout$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(fetch(domain + "/api/auth/logout", {
            method: "GET",
            credentials: "include"
          }).then(function (response) {
            if (!response.ok) {
              console.error("HTTP error! Status: ".concat(response.status));
            }

            return response.json();
          }).then(function (data) {
            console.log(data);

            if (data.message) {
              if (data.message === "Logout successful.") {
                window.location.href = "/login.htm";
              }
            }
          })["catch"](function (error) {
            console.error("Error:", error);
          }));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function getUserData() {
  return regeneratorRuntime.async(function getUserData$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(fetch(domain + "/api/auth/me", {
            method: "GET"
          }).then(function (response) {
            if (!response.ok) {
              console.error("HTTP error! Status: ".concat(response.status));
            }

            console.log(response);
            return response.json();
          }).then(function (data) {
            console.log(data);
            User = data.user;
          })["catch"](function (error) {
            console.error("Error:", error);
          }));

        case 2:
          return _context4.abrupt("return", User);

        case 3:
        case "end":
          return _context4.stop();
      }
    }
  });
}