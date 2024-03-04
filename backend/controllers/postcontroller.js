import User from "../models/userModel.js";

const createPost = async (req, res) => {

    try {
        const {postedBy, text, img} = req.body;

        if(!postedBy || !text) {
            return res.status(400).json({message: "Please fill in all fields"});
        }

        const user = await User.findById(postedBy);
         
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        if(user._id.toString() !== postedBy) {
            return res.status(400).json({message: "User not authorized"});
        }

        const maxLength = 500;
        if(text.length > maxLength) {
            return res.status(400).json({message: `Text must be less than ${maxLength} characters`});
        }

        const newPost = new Post ({ postedBy, text, img });

        await newPost.save();
        res.status(201).json({message: "Post created successfully", newPost});


    } catch (error) {
        res.status(500).json({message: error.message});
        console.log(error.message);
    }
};

const getPost = async (req, res) => { 

    try {
        const post = await Post.findById(req.params.id);

        if(!post) {
            return res.status(400).json({message: "Post not found"});
        }

        res.status(200).json({ post });
    } catch (error) {
        res.status(500).json({message: error.message});
        console.log(error.message);
    }

};

export { createPost, getPost };