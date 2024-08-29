import jwt from'jsonwebtoken';
import { ErrorResponse } from '../utils/ErrorResponse';
import dotenv from 'dotenv';
dotenv.config({
    path:'./.env'
 })

interface JwtPayLoad{
    username:string,
    userID:string,
    userRole?: string | null,
    userEmail:string
}

export const checkAuthentication = async (req:any,res:any,next:any)=>{

    try{

        let token: string | undefined;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1]; // Extract the token part from "Bearer <token>"
        } else if (req.cookies.token) {
            // Check for token in cookies
            token = req.cookies.token;
            console.log(token)    
        }

        // If no token is found in both places, throw an error
        if (!token) {
            throw new ErrorResponse('Not authenticated, token missing', 401);
        }

        // Verify the token
        if (!process.env.JWT_SECRET_KEY) {
            throw new ErrorResponse('ENVIRONMENT VARIABLE NOT LOADED PROPERLY, JWT_SECRET_KEY is missing', 500);
        }

        console.log(process.env.JWT_SECRET_KEY);

        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayLoad;

        // Attach the decoded user data to the request object
        req.user = decoded;

        // Proceed to the next middleware or route handler
        next();


    }catch(err:any){
        console.log(err.statusCode);
            next(err);
    }

}

