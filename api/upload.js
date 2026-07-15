import supabase from "./_supabase.js";
import { requireAuth } from "./_auth.js";

export const config = {

    api: {

        bodyParser: false

    }

};

async function readFile(req) {

    return new Promise((resolve, reject) => {

        const chunks = [];

        req.on("data", chunk => chunks.push(chunk));

        req.on("end", () => resolve(Buffer.concat(chunks)));

        req.on("error", reject);

    });

}

export default async function handler(req, res) {

    if (req.method !== "POST") {

        return res.status(405).json({

            error: "Method not allowed"

        });

    }

        const user = await requireAuth(req, res);

    if (!user) {
        return;
    }
    try {

        const file = await readFile(req);

        const fileName = `${Date.now()}.jpg`;

        const filePath = `uploads/${fileName}`;

        const { error } = await supabase

            .storage

            .from("images")

            .upload(

                filePath,

                file,

                {

                    contentType: "image/jpeg",

                    upsert: false

                }

            );

        if (error) {

            return res.status(500).json({

                error: error.message

            });

        }

        const {

            data

        } = supabase

            .storage

            .from("images")

            .getPublicUrl(filePath);

        return res.status(200).json({

            url: data.publicUrl

        });

    }

    catch (error) {

        return res.status(500).json({

            error: error.message

        });

    }

}