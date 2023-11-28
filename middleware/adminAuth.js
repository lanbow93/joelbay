import dotenv from 'dotenv';
dotenv.config();
import jwt from "jsonwebtoken";


async function AdminAuth  (request, response, next){
    try {
        // Check if token is in the cookies
        const { token = false} = request.cookies;
        if (token) {
            // Verify token
            const payload = await jwt.verify(token, process.env.SECRET);
            // Add payload to request
            request.payload = payload;
            next();
        } else {
            throw "Not logged In";
        }
    } catch (error) {
        response.status(400).json({error});
    }
}
export default AdminAuth;