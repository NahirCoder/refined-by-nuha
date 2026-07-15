async function loadCategory() {


    const params = new URLSearchParams(
        window.location.search
    );


    const categoryId = params.get("id");



    try {


        // Fetch category info so we can show its name
        const categoriesResponse =
            await fetch("/api/categories");

        const categories =
            await categoriesResponse.json();

        const category = Array.isArray(categories)
            ? categories.find(c => c.id == categoryId)
            : null;

        document.getElementById("category-name").textContent =
            category?.name || "";

        document.title =
            category?.name || "Products";



        const response = await fetch(
            `/api/products?category=${categoryId}`
        );


        const products = await response.json();



        const container =
            document.getElementById("products-container");


        container.innerHTML = "";



        if (!Array.isArray(products) || products.length === 0) {

            container.innerHTML = `

                <div class="empty-category">

                    <h2>This category is empty.</h2>

                    <p>Please check back later for new products.</p>

                </div>

            `;

            return;

        }



        products.forEach(product => {



            const images = product.product_images || [];



            const card = document.createElement("div");


            card.className = "product-card";



            card.innerHTML = `

            <p>
            Click on image to view in full
            </p>


            <div class="product-images">

            ${
                images.map(image => `

                <img
                src="${image.image_url}"
                onclick="window.open('${image.image_url}','_blank')"
                >

                `).join("")
            }

            </div>


            <h2>
            ${product.name}
            </h2>


            <p>
            ${product.description}
            </p>


            <p>
            Price: R${product.price}
            </p>


            <p>

            ${
                product.available
                ?
                "Available"
                :
                "Out of Stock"
            }

            </p>



            <button class="product-whatsapp">

            📱 Ask about this product on WhatsApp

            </button>


            `;



            card.querySelector(".product-whatsapp")
            .onclick = async () => {


                const settingsResponse = await fetch("/api/settings");

                const settings = await settingsResponse.json();

                const message = `Hi, I'm interested in this product.

Product:
${product.name}

Description:
${product.description}

Price:
R${product.price}

Category:
${product.categories?.name || category?.name || ""}`;

                window.open(

                    `https://wa.me/${settings.whatsapp_number}?text=${encodeURIComponent(message)}`,

                    "_blank"

                );


            };



            container.appendChild(card);



        });


    } catch (err) {

        console.error("Error loading category page:", err);

    }


}


loadCategory();