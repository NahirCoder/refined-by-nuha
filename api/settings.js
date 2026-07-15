import supabase from "./_supabase.js";
import { requireAuth } from "./_auth.js";

export default async function handler(req, res) {
    if (req.method === "PUT") {

        const user = await requireAuth(req, res);

        if (!user) {
            return;
        }

    }
    switch (req.method) {

        case "GET":

            return getSettings(req, res);

        case "PUT":

            return updateSettings(req, res);

        default:

            return res.status(405).json({

                error: "Method not allowed"

            });

    }

}

async function getSettings(req, res) {

    const { data, error } = await supabase

        .from("settings")

        .select("*")

        .eq("id", 1)

        .single();

    if (error) {

        return res.status(500).json({

            error: error.message

        });

    }

    return res.status(200).json(data);

}

async function updateSettings(req, res) {

    const {

        business_name,

        about,

        logo_url,

        whatsapp_number

    } = req.body;

    const { data, error } = await supabase

        .from("settings")

        .update({

            business_name,

            about,

            logo_url,

            whatsapp_number,

            updated_at: new Date().toISOString()

        })

        .eq("id", 1)

        .select()

        .single();

    if (error) {

        return res.status(500).json({

            error: error.message

        });

    }

    return res.status(200).json({

        success: true,

        settings: data

    });

}