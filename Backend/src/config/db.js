import mongoose from "mongoose"

export const connectDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log("monogdb connected");
    }catch(error){
        console.error("error connecting to database",error);
        process.exit(1)
    }
}