import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`MongoDB Connected: ${conn.connection.host}`)
    }
    catch (err) {
        console.error("DB connection failed! ",err)
        process.exit(1)
    }
}

export default connectDB