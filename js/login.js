async function loadBusinessName() {

    const response = await fetch("/api/settings");
    const settings = await response.json();

    document.getElementById("business-name").textContent =
        settings.business_name;

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

    const button = document.getElementById("login-button");
    const errorText = document.getElementById("login-error");

    errorText.textContent = "";

    button.disabled = true;
    button.textContent = "Logging In...";

    try {

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

        if (!response.ok) {

            errorText.textContent =
                result.error || "Incorrect email and/or password!";

            return;

        }

        localStorage.setItem(

            "session",

            JSON.stringify(result.session)

        );

        location.href = "admin.html";

    }
    catch (error) {

        console.error(error);

        errorText.textContent =
            "Unable to connect to the server.";

    }
    finally {

        button.disabled = false;
        button.textContent = "Login";

    }

};