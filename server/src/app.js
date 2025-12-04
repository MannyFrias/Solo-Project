import express, { urlencoded } from "express"; 
import cors from "cors"; 
import helmet from "helmet"; 
import dotenv from "dotenv"; 
import { connectDB } from "./utils/database.js"; 

dotenv.config(); 

const app = express(); 
const PORT = process.env.PORT || 8888; 

await connectDB(); 

// this is my security middleware 
app.use(helmet()); 

//cors config
app.use(cors({
    // need to do more research on cors :/ 
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(express.json()); 
app.use(urlencoded({extended: true})); 

// checking to see if everything is connected
app.get("/ping", (req, res, next) => {
    res.status(200).send("pong"); 
});

// making a basic route for testing
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "OK", 
        message: "password manager API running", 
        timestamp: new Date().toISOString()
    });
});

// unknown route handler 
// was tring to use the wildcard (*), but nodemon did not like it, it preffered this or using regex "/(.*)/"
app.use((req, res) => {
    res.status(404).json({error: "Route Not Found!"}); 
});

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    const defaultError = {
        log: "Express error handler caught unknown middleware error", 
        status: 500, 
        message: {err: "an error occured"}
    }; 
    const errorObj = Object.assign({}, defaultError, err); 
    console.log(errorObj); 
    return res.status(errorObj.status).json(errorObj.message); 
});

app.listen(PORT, () => {
    console.log("Server running on port " + PORT); 
    console.log(`ENV: ${process.env.NODE_ENV}`)
});

export default app; 