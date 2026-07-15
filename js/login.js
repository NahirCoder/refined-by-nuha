async function loadBusinessName() {

    const response = await fetch("/api/settings");
    const settings = await response.json();

    document.getElementById("business-name").textContent =
        settings.business_name || "Business";

}

loadBusinessName();

document.getElementById("back-home").onclick = () => {

    location.href = "/";

};

document.getElementById("show-password").onclick = () => {

    const password = document.getElementById("password");

    password.type =
        password.type === "password"
            ? "text"
            : "password";

};

document.getElementById("login-button").onclick = async () => {

    document.getElementById("login-error").textContent = "";

    const response = await fetch("/api/login", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify({

            email: document.getElementById("email").value,

            password: document.getElementById("password").value

        })

    });

    const result = await response.json();

    if (!result.success) {

        document.getElementById("login-error").textContent =
            result.error;

        return;

    }

    localStorage.setItem(
        "access_token",
        result.session.access_token
    );

    location.href = "/admin.html";

};