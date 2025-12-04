import dotenv from "dotenv"
dotenv.config();

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"; 
import User from "../models/User.js";
// imports for validation reg and login 

    // const SECRET = process.env.JWT_SECRET_KEY; 
    // const EXPIRE = process.env.JWT_EXPIRE;


const router = express.Router(); 

// /api/auth/register
// creating a post request for api/auth/register so users can register 
// need to validate input data, check if username or pass exists
// hash the pass word, google is saying 12 salt rounds is good for security and performance 
// create user in DB 
// generate JWT so i can immediatly auth - makes it so i dont need to login to register ?? 

router.post('/register', async (req, res, next) => {

        const SECRET = process.env.JWT_SECRET_KEY; 
        const EXPIRE = process.env.JWT_EXPIRE;
        
    try {
        // getting user imput from the registration form 
        const {username, email , password} = req.body; 

        // check if user exists 
        const existingUser = await User.findOne({
            // using the OR operator to check if one of the other if found, in this case username or email to validate password
            $or: [{username}, {email}]
        }); 

        // if user exists, i want to give an error that tells them they are already registered
        if (existingUser) {
            const field = existingUser.username === username ? "username" : "email"; 
            // returning 409 cant resolve and an error message with which one is found in the db
            // error 409 is not resolved cus of conflicts 
            return res.status(409).json({
                success: false, 
                message: `${field} already exists`, 
                field: field
            }); 
        }; 

        // need to hash my password to not store plaintext password
        // using bcrypt to salt the password the saltRounds amount of times
        const saltRounds = 12; 
        const hashedPassword = await bcrypt.hash(password, saltRounds); 

        // creating new user now that password is hashed 
        // saving after creating of new user w hashed pass
        const newUser = new User({
            username: username, 
            email: email, 
            password: hashedPassword,
        }); 

        console.log("new user created, NOT saved YET", newUser);

        // now i need to make a new JWT for auth using the secret key i generated 
        const token = jwt.sign(
            {
            userId: newUser._id, 
            username: newUser.username
            },
            SECRET, 
            {
                expiresIn: EXPIRE || "7d"
            }
        ); 
        
        await newUser.save();

        console.log("user saved to DB")

        res.status(201).json({
            success: true, 
            message: "User sucessfully created", 
            data: {
                user: {
                    id: newUser._id, 
                    username: newUser.username, 
                    email: newUser.email,
                    createdAt: newUser.createdAt
                }, 
                token: token
            }
        })

    } catch (err) {
        console.error("error in /register route: ", err); 
        console.error("error name: ", err.name);
        console.error("error message: ", err.message); 
        return next({
            log: `error in register: ${err.message}`, 
            status: 400, 
            message: { err: err.message || "registration failed"}
        })
    }
})

// creating login route /api/auth/login
// will atuh users and provide JWT token
// comparing passwords using bcrypt compare 

router.post("/login", async (req, res, next) => {
    const SECRET = process.env.JWT_SECRET_KEY; 
    const EXPIRE = process.env.JWT_EXPIRE;

    try {
        // get login data (username or email )from req.body
        const { username, email, password } = req.body; 

        // check whether if password and email or username is given
        if (!password || (!username && !email)) {
            res.status(400).json({
                success: false, 
                message: "password and either username or email are required"
            })
        }

        // find user in DB using the OR operator 
        const existingUser = await User.findOne({
            $or: [{username}, {email}]
        }); 

        // handle user not found
        if (!existingUser) {
            return res.status(401).json({
                success: false, 
                message: "invalid credential"
            })
        }

        // compare password provided and stored hash password
        const checkPass = await bcrypt.compare(password, existingUser.password);
        
        // if pass is invalid 
        if (!checkPass) {
            return res.status(401).json({
                success: false, 
                message: "invalid credentials"
            }); 
        }

        const token = jwt.sign(
            {
                userId: existingUser._id, 
                username: existingUser.username, 
                email: existingUser.email
            }, 
            SECRET,
            {
                expiresIn: EXPIRE || "7d"
            }
        );

        console.log("USER ${username} logged in");

        res.status(200).json({
            success: true, 
            message: "Login Successful",
            data: {
                user: {
                    id: existingUser._id, 
                    username: existingUser.username, 
                    email: existingUser.email, 
                    createdAt: existingUser.createdAt
                }, 
                token: token
            }
        });

    } catch (err) {
        console.error("Error in /login route: ", err)
        return next({
            log: `Error in login: ${err.message}`, 
            status: 500, 
            message: { err: "Login failed due to server error" }
        });
    }
})

export default router; 