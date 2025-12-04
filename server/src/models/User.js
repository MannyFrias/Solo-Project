import mongoose from "mongoose"


const Schema = mongoose.Schema; 

// creating userSchema 
const userSchema = new Schema({
    username: {
        type: String, 
        unique: true, 
        required: true, 
        createdAt: new Date().toISOString()
    }
}, {
        timestamps: true
});

//creating user model
const User = mongoose.model('User', userSchema)

export default User; 