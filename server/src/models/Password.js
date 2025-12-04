import mongoose from "mongoose";
import User from "./User";

const Schema = mongoose.Schema; 

const passwordSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }, 
    title: {
        type: String, 
        required: true, 
    }, 
    username: {
        type: String, 
        required: true
    }, 
    password: {
        type: String,
        required:true
    }, 

}, {
        timestamps: true
});

const Password = mongoose.model('Password', passwordSchema);

export default Password;