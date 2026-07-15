import supabase from "./_supabase.js";
import { requireAuth } from "./_auth.js";


export default async function handler(req,res){
    if (req.method !== "GET") {

        const user = await requireAuth(req, res);

        if (!user) {
            return;
        }

    }

    switch(req.method){


        case "GET":

            return getProducts(req,res);



        case "POST":

            return createProduct(req,res);



        case "PUT":

            return updateProduct(req,res);



        case "DELETE":

            return deleteProduct(req,res);



        default:


            return res.status(405).json({

                error:"Method not allowed"

            });


    }


}





async function getProducts(req,res){


    const categoryId=req.query.category;



    let query=supabase

        .from("products")

        .select(`

            *,

            product_images(*),

            categories(name)

        `)

        .order("id",{ascending:true});



    if(categoryId){

        query=query.eq("category_id",categoryId);

    }



    const {data,error}=await query;



    if(error){

        return res.status(500).json({

            error:error.message

        });

    }



    return res.status(200).json(data);


}









async function createProduct(req,res){


    const {

        name,

        description,

        price,

        category_id,

        available,

        images

    }=req.body;



    const {data,error}=await supabase

        .from("products")

        .insert({

            name,

            description,

            price,

            category_id,

            available,

            updated_at:new Date().toISOString()

        })

        .select()

        .single();





    if(error){

        return res.status(500).json({

            error:error.message

        });

    }





    if(images && images.length){


        const imageRows=images.map(url=>({


            product_id:data.id,

            image_url:url,

            updated_at:new Date().toISOString()


        }));



        await supabase

            .from("product_images")

            .insert(imageRows);


    }





    return res.status(200).json({

        success:true,

        product:data

    });


}









async function updateProduct(req,res){


    const {

        id,

        name,

        description,

        price,

        category_id,

        available,

        images

    }=req.body;





    const {data,error}=await supabase

        .from("products")

        .update({

            name,

            description,

            price,

            category_id,

            available,

            updated_at:new Date().toISOString()

        })

        .eq("id",id)

        .select()

        .single();





    if(error){

        return res.status(500).json({

            error:error.message

        });

    }





    if(images){


        await supabase

        .from("product_images")

        .delete()

        .eq("product_id",id);




        if(images.length){


            await supabase

            .from("product_images")

            .insert(

                images.map(url=>({


                    product_id:id,

                    image_url:url,

                    updated_at:new Date().toISOString()


                }))

            );


        }


    }





    return res.status(200).json({

        success:true,

        product:data

    });


}









async function deleteProduct(req,res){


    const id=req.query.id;



    const {error}=await supabase

        .from("products")

        .delete()

        .eq("id",id);




    if(error){

        return res.status(500).json({

            error:error.message

        });

    }



    return res.status(200).json({

        success:true

    });


}