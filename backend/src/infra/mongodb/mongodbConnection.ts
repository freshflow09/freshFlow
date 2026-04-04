import mongoose from "mongoose"

export const connectMongo = async () => {

  try {

    const connection = await mongoose.connect(process.env.MONGODB_CONNECTION_URL||"")

    console.log("Mongo connected:", connection.connection.host)

  } catch (error) {

    console.error("Mongo connection failed:", error)

    process.exit(1)

  }

}