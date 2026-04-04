import mongoose from "mongoose"

const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        
    },
    name:{
        type:String,

    },
    email:String,
    password:Number,
    shopName:String,
    mobilNumber:Number,
    createdAt:Number,
    updatedAt:Number

})

export const UserModel = mongoose.model("User", userSchema)