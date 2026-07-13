import supabase from "./_supabase.js";

export const config = {
    api: {
        bodyParser: false
    }
};

async function readFile(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];

        req.on("data", chunk => chunks.push(chunk));

        req.on("end", () => {

            const buffer = Buffer.concat(chunks);

            const contentType = req.headers["content-type"] || "image/jpeg";

            let extension = "jpg";

            if (contentType.includes("png")) extension = "png";
            else if (contentType.includes("webp")) extension = "webp";
            else if (contentType.includes("gif")) extension = "gif";
            else if (contentType.includes("jpeg")) extension = "jpg";

            resolve({
                buffer,
                contentType,
                extension
            });

        });

        req.on("error", reject);
    });
}

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({
            error: "Method not allowed"
        });
    }

    try {

        const file = await readFile(req);

        const fileName = `${Date.now()}.${file.extension}`;

        const filePath = `uploads/${fileName}`;

        const { error } = await supabase
            .storage
            .from("images")
            .upload(filePath, file.buffer, {
                contentType: file.contentType,
                upsert: false
            });

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        const { data } = supabase
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