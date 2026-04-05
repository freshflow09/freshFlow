import "dotenv/config";

import app from "./app";
console.log(process.env.CLOUDINARY_API_KEY + "this is the api key")
import { connectMongo } from "./infra/mongodb/mongodbConnection";
import { log } from "console";
connectMongo();

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
