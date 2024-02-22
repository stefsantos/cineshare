import User from '../models/usermodel.js'; // Ensure this path correctly points to your User model file

import bcrypt from 'bcryptjs';

const signupUser = async (req, res) => {
    try {   
        const { name, username, email, password } = req.body;
        
        // Corrected: Use 'User' instead of 'user' for the model variable to match the import and avoid case sensitivity issues
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Corrected: Use 'User' to create a new instance
        const newUser = new User({
            name, 
            username, 
            email, 
            password: hashedPassword,
            // profilepic, followers, following, bio - Assuming these are part of your User model, ensure they are handled appropriately (either by setting defaults in the model or including them here if they are being passed in the request)
        });

        await newUser.save();

        // Optionally: Exclude sensitive information like hashed password in the response
        res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            username: newUser.username,
            email: newUser.email,
            // Optionally include other fields you wish to return, ensuring sensitive info is not exposed
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

export { signupUser };
