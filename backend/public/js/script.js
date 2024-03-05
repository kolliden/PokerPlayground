const pre = "/frontend/web";

document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');

    if (!token) {
      // If token doesn't exist, redirect to login page
      // window.location.href = pre + '/login.htm';
    }
  });