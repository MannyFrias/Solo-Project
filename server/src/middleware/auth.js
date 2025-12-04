import jwt from "jsonwebtoken";

const authenticatToken = (req, res, next) => {
    try {
        // need to grab auth token from header
        // jwt docs say format should be "Bearer <token>"
        const authHeader = req.headers["authorization"]; 
        // this is grabbing the actual token data after the "bearer"
        const token = authHeader && authHeader.split(" ")[1]; 

        // handle missing token from header 
        if (!token) {
            return res.status(401).json({
                success: false, 
                message: "access token required"
            }); 
        }; 

        // verify jwt token using the secret key
        // will throw error if token is invalid or expired 

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY); 


        // attach data to req obj so other middleware can use data 
        req.user = {
            userId: decoded.userId
        }
    } catch (err) {
        return next(err);
    }
}