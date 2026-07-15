let hasUnsavedChanges = false;
function authHeaders(){

    return {

        "Content-Type":"application/json",

        "Authorization":
            "Bearer " +
            localStorage.getItem("access_token")

    };

}


function uploadAuthHeaders(){

    return {

        "Authorization":
            "Bearer " +
            localStorage.getItem("access_token")

    };

}


async function checkSession(){

    const token =
        localStorage.getItem("access_token");

    if(!token){

        location.replace("/login.html");
        return false;

    }

    return true;

}






async function loadSettings(){


    const response = await fetch("/api/settings");

    const settings = await response.json();



    document.getElementById("business-name").textContent =
        settings.business_name || "";



    document.getElementById("settings-name").value =
        settings.business_name || "";



    document.getElementById("settings-about").value =
        settings.about || "";



    document.getElementById("settings-whatsapp").value =
        settings.whatsapp_number || "";



    document.getElementById("settings-logo-preview").src =
        settings.logo_url || "";

}








async function loadCategories(){


    const response = await fetch("/api/categories");


    const categories = await response.json();



    const container =
        document.getElementById("categories");



    container.innerHTML="";




    categories.forEach(category=>{


        const box=document.createElement("div");


        box.className="category-admin-box";



        box.innerHTML=`


        <img 
        class="category-preview"
        src="${category.image_url || ""}"
        >



        <input 
        type="file"
        accept="image/*"
        class="category-image"
        >



        <input
        type="text"
        class="category-name"
        value="${category.name || ""}"
        >



        <button class="save-category">

        💾 Save Category

        </button>



        <button class="delete-category">

        🗑 Delete Category

        </button>


        `;



        let newImageUrl =
            category.image_url || "";



        box.querySelector(".category-image")
        .addEventListener("change",event=>{


            const file=event.target.files[0];


            if(!file)return;



            box.querySelector(".category-preview").src =
                URL.createObjectURL(file);



            box.dataset.file =
                file.name;



            box.file=file;



            hasUnsavedChanges=true;


        });





        box.querySelector(".category-name")
        .addEventListener("input",()=>{


            hasUnsavedChanges=true;


        });






        box.querySelector(".save-category")
        .onclick=async()=>{



            const file=box.file;



            if(file){


                const upload=await fetch("/api/upload",{


                    method:"POST",


                    headers: uploadAuthHeaders(),


                    body:file


                });



                const result=await upload.json();


                newImageUrl=result.url;


                box.file=null;


            }




            await fetch("/api/categories",{


                method:"PUT",


                headers: authHeaders(),


                body:JSON.stringify({


                    id:category.id,


                    name:
                    box.querySelector(".category-name").value,


                    image_url:newImageUrl


                })


            });




            hasUnsavedChanges=false;


            alert("Category saved");


        };







        box.querySelector(".delete-category")
        .onclick=async()=>{


            if(!confirm("Delete this category?"))return;



            await fetch(
                `/api/categories?id=${category.id}`,
                {

                    method:"DELETE",

                    headers: uploadAuthHeaders()

                }
            );



            loadCategories();



        };





        container.appendChild(box);



    });






    const add=document.createElement("button");


    add.textContent="➕ Add Category";



    add.onclick=async()=>{


        const response=await fetch("/api/categories",{


            method:"POST",


            headers: authHeaders(),


            body:JSON.stringify({


                name:"New Category",


                image_url:""


            })


        });



        await response.json();


        loadCategories();



    };



    container.appendChild(add);



}








async function loadProducts(){


    const response = await fetch("/api/products");


    const products = await response.json();



    const container =
        document.getElementById("products");



    container.innerHTML="";



    const categoriesResponse =
        await fetch("/api/categories");


    const categories =
        await categoriesResponse.json();





    products.forEach(product=>{


        const box=document.createElement("div");


        box.className="product-admin-box";



        let imagesHTML="";


        if(product.product_images){


            product.product_images.forEach(image=>{


                imagesHTML+=`

                <img 
                class="product-preview"
                src="${image.image_url}"
                >

                `;


            });


        }



        box.innerHTML=`

        <div>

        ${imagesHTML}

        </div>



        <input 
        type="file"
        accept="image/*"
        multiple
        class="product-images"
        >



        <input
        type="text"
        class="product-name"
        value="${product.name || ""}"
        >



        <textarea
        class="product-description"
        placeholder="Description">${product.description || ""}</textarea>



        <input
        type="number"
        class="product-price"
        value="${product.price || ""}"
        >



        <select class="product-category">

        ${categories.map(category=>`

            <option 
            value="${category.id}"
            ${product.category_id == category.id ? "selected":""}
            >

            ${category.name}

            </option>

        `).join("")}

        </select>



        <label>

        <input 
        type="checkbox"
        class="product-available"
        ${product.available ? "checked":""}
        >

        Available

        </label>



        <button class="save-product">

        💾 Save Product

        </button>



        <button class="delete-product">

        🗑 Delete Product

        </button>

        `;



        let imageUrls=[];



        if(product.product_images){

            imageUrls =
            product.product_images.map(
                image=>image.image_url
            );

        }





        box.querySelector(".product-images")
        .addEventListener("change",e=>{


            imageUrls=[];


            const files=[...e.target.files];



            files.forEach(file=>{


                imageUrls.push(file);


            });



            hasUnsavedChanges=true;


        });







        box.querySelector(".save-product")
        .onclick=async()=>{


            let finalImages=[];



            for(const image of imageUrls){


                if(typeof image==="string"){

                    finalImages.push(image);

                    continue;

                }



                const upload =
                await fetch("/api/upload",{

                    method:"POST",

                    headers: uploadAuthHeaders(),

                    body:image

                });



                const result =
                await upload.json();



                finalImages.push(result.url);


            }




            imageUrls = finalImages;





            await fetch("/api/products",{

                method:"PUT",

                headers: authHeaders(),

                body:JSON.stringify({


                    id:product.id,


                    name:
                    box.querySelector(".product-name").value,


                    description:
                    box.querySelector(".product-description").value,


                    price:
                    box.querySelector(".product-price").value,


                    category_id:
                    box.querySelector(".product-category").value,


                    available:
                    box.querySelector(".product-available").checked,


                    images:finalImages


                })

            });



            hasUnsavedChanges=false;


            alert("Product saved");


        };







        box.querySelector(".delete-product")
        .onclick=async()=>{


            if(!confirm("Delete this product?")) return;



            await fetch(
            `/api/products?id=${product.id}`,
            {

                method:"DELETE",

                headers: uploadAuthHeaders()

            });



            loadProducts();


        };





        container.appendChild(box);



    });





    const add=document.createElement("button");


    add.textContent="➕ Add Product";



    add.onclick=async()=>{


        await fetch("/api/products",{


            method:"POST",


           headers: authHeaders(),


            body:JSON.stringify({


                name:"New Product",

                description:"",

                price:0,

                category_id:
                categories[0]?.id || null,

                available:true,

                images:[]

            })


        });



        loadProducts();


    };



    container.appendChild(add);


}


async function initializeAdmin(){


    const loggedIn=await checkSession();


    if(!loggedIn)return;



    await loadSettings();


    await loadCategories();


    await loadProducts();


}





initializeAdmin();







document.querySelectorAll(".section-toggle")
.forEach(button=>{


    button.onclick=()=>{


        document
        .getElementById(button.dataset.section)
        .classList.toggle("open");


    };


});







document.getElementById("settings-logo")
.addEventListener("change",e=>{


    const file=e.target.files[0];


    if(!file)return;



    document.getElementById("settings-logo-preview")
    .src=URL.createObjectURL(file);



    hasUnsavedChanges=true;


});






document.getElementById("settings-name")
.oninput=()=>hasUnsavedChanges=true;



document.getElementById("settings-about")
.oninput=()=>hasUnsavedChanges=true;



document.getElementById("settings-whatsapp")
.oninput=()=>hasUnsavedChanges=true;







document.getElementById("save-settings")
.onclick=async()=>{


    let logoUrl=
    document.getElementById("settings-logo-preview").src;



    const file=
    document.getElementById("settings-logo").files[0];



    if(file){


        const upload=await fetch("/api/upload",{


            method:"POST",


            headers: uploadAuthHeaders(),


            body:file


        });



        const result=await upload.json();


        logoUrl=result.url;


    }




    await fetch("/api/settings",{


        method:"PUT",


        headers: authHeaders(),


        body:JSON.stringify({


            business_name:
            document.getElementById("settings-name").value,


            about:
            document.getElementById("settings-about").value,


            whatsapp_number:
            document.getElementById("settings-whatsapp").value,


            logo_url:logoUrl


        })


    });



    hasUnsavedChanges=false;


    alert("Settings saved");


};









async function leaveAdmin(destination){


    localStorage.removeItem("access_token");


    location.replace(destination);


}





document.getElementById("home-button")
.onclick=()=>leaveAdmin("/");



document.getElementById("logout-button")
.onclick=()=>leaveAdmin("/login.html");