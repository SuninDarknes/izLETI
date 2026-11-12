import { checkAuth } from "/js/auth.js"

const loginLogoutButton = document.querySelector("#logout-button");

loginLogoutButton?.addEventListener("click", async (e) => {
    e.preventDefault();

    let auth = await checkAuth();

    if (!auth.authenticated) {
        window.location = "/auth/login";
        return;
    }

    try {
        const response = await fetch("/auth/logout", {
            method: "POST"
        });

        if (!response.ok) {
            throw new Error("Logout failed");
        }

        window.location.href = "/";
    } catch (error) {
        console.error("Could not log out:", error);
    }
});