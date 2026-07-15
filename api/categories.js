import supabase from "./_supabase.js";
import { requireAuth } from "./_auth.js";


export default async function handler(req, res) {
    if (req.method !== "GET") {

        const user = await requireAuth(req, res);

        if (!user) {
            return;
        }

    }

    switch (req.method) {


        case "GET":

            return getCategories(req, res);



        case "POST":

            return createCategory(req, res);



        case "PUT":

            return updateCategory(req, res);



        case "DELETE":

            return deleteCategory(req, res);



        default:

            return res.status(405).json({

                error: "Method not allowed"

            });

    }

}



async function getCategories(req, res) {


    const { data, error } = await supabase

        .from("categories")

        .select("*")

        .order("id", { ascending: true });



    if (error) {

        return res.status(500).json({

            error:error.message

        });

    }



    return res.status(200).json(data);


}





async function createCategory(req,res){


    const {

        name,

        image_url

    } = req.body;



    const { data,error } = await supabase

        .from("categories")

        .insert({

            name,

            image_url,

            updated_at:new Date().toISOString()

        })

        .select()

        .single();



    if(error){

        return res.status(500).json({

            error:error.message

        });

    }



    return res.status(200).json({

        success:true,

        category:data

    });


}







async function updateCategory(req,res){


    const {

        id,

        name,

        image_url

    } = req.body;



    const { data,error } = await supabase

        .from("categories")

        .update({

            name,

            image_url,

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



    return res.status(200).json({

        success:true,

        category:data

    });


}







async function deleteCategory(req,res){


    const id = req.query.id;



    const {error}=await supabase

        .from("categories")

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