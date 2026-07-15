async function loadHome() {

    // Bind buttons that don't depend on fetched data FIRST,
    // so they always work even if something else below fails.
    document.getElementById("admin-button").onclick = () => {
        window.location.href = "login.html";
    };

    try {

        const settingsResponse = await fetch("/api/settings");
        const settings = await settingsResponse.json();


        /*
        =========================
        Dynamic branding
        =========================
        */

        document.title =
            settings.business_name || "Business";

        document.getElementById("favicon").href =
            settings.logo_url || "";

        document.getElementById("business-logo").src =
            settings.logo_url || "";

        document.getElementById("business-name").textContent =
            settings.business_name || "";

        document.getElementById("business-about").textContent =
            settings.about || "";


        /*
        =========================
        SEO Description
        =========================
        */

      const seoDescription = document.getElementById("seo-description");
if (seoDescription) {
    seoDescription.content = settings.about || "";
}


        /*
        =========================
        Google Structured Data
        =========================
        */

        const schema = {

            "@context": "https://schema.org",

            "@type": "Store",

            "name":
            settings.business_name,

            "image":
            settings.logo_url,

            "description":
            settings.about,

            "contactPoint": {

                "@type": "ContactPoint",

                "telephone":
                settings.whatsapp_number,

                "contactType":
                "customer service"

            }

        };

        document
        .getElementById("business-schema")
        .textContent =
            JSON.stringify(schema);


        /*
        =========================
        WhatsApp
        =========================
        */

        document.getElementById("whatsapp-button")
        .onclick = () => {

            window.open(
                `https://wa.me/${settings.whatsapp_number}`,
                "_blank"
            );

        };


        /*
        =========================
        Categories
        =========================
        */

        const categoriesResponse =
            await fetch("/api/categories");

        const categories =
            await categoriesResponse.json();

        const container =
            document.getElementById("categories-container");

        container.innerHTML = "";

        if (Array.isArray(categories)) {

            categories.forEach(category => {

                const card =
                document.createElement("div");

                card.className =
                "category-card";

                card.innerHTML = `

                    <img 
                    src="${category.image_url}"
                    alt="${category.name}"
                    >

                    <h3>

                    ${category.name}

                    </h3>

                `;

                card.onclick = () => {

                    window.location.href =
                    `category.html?id=${category.id}`;

                };

                container.appendChild(card);

            });

        }

    } catch (err) {

        console.error("Error loading home page data:", err);

    }

}

loadHome();