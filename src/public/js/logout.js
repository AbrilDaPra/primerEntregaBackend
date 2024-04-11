const logoutButton = document.getElementById("logoutButton");

logoutButton.addEventListener("click", () => {
  fetch("/api/sessions/logout", {
    method: "GET",
  }).then((response) => {
    if (response.redirected) {
      //Redirecciono al usuario a la página de login
      window.location.replace(response.url);
    }
  });
});
