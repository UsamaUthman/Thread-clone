import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = async(req, res, next) => {
   try{
        const token = req.cookies.jwt;
        if(!token){
             return res.status(401).json({message: "You need to be logged in to access this route"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.userId).select("-password");
        next();
   }catch(error){
        console.error(error);
        res.status(500).json({message: "An error occurred while processing your request"});
   }
}


export default protectRoute;