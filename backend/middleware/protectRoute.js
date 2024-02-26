import User from "../models/usermodel.js";
import jwt from "jsonwebtoken";


const protectRoute = async (req, res, next) => {

    try {
        const token = req.cookies.jwt;

        if(!token) return res.status(401).json({message: "Unauthorized"});

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userid).select("-password");

        req.user = user;

        next();
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log("Error in signupuser: ", err.message);
    }

}

export default protectRoute;