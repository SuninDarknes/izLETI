"use strict";
const CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";
window.addEventListener("load", () => {
    if (typeof google === "undefined" || !google.accounts?.id) {
        showMessage("Google Sign-In could not be loaded.", true);
        return;
    }
    const signInElement = document.getElementById("google-signin");
    if (!signInElement) {
        throw new Error('Missing element with id "google-signin".');
    }
    google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: handleGoogleLogin,
    });
    google.accounts.id.renderButton(signInElement, {
        theme: "outline",
        size: "large",
        shape: "rectangular",
        text: "continue_with",
        width: 300,
    });
});
async function handleGoogleLogin(response) {
    showMessage("Signing in...", false);
    try {
        const result = await fetch("/auth/google", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                credential: response.credential,
            }),
        });
        if (!result.ok) {
            throw new Error("Authentication failed.");
        }
        const data = await result.json();
        showMessage("Successfully signed in!", false);
        if (data.redirectUrl) {
            window.location.href = data.redirectUrl;
        }
    }
    catch {
        showMessage("Could not sign in. Check your server configuration.", true);
    }
}
function showMessage(message, isError) {
    const element = document.getElementById("message");
    if (!element) {
        return;
    }
    element.textContent = message;
    element.className = isError
        ? "small mt-3 text-danger"
        : "small mt-3 text-secondary";
}
