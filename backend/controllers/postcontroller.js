import User from "../models/userModel.js";
import Post from "../models/postModel.js";


const createPost = async (req, res) => {

    try {
        const {postedBy, text, image } = req.body;

        if (!postedBy || !text) {
            return res.status(400).json({ message: "Invalid post data" });
        }

        const user = await User.findById(postedBy);
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }

        if(user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ message: `Post text must be ${maxLength} characters or less` });
        }

        const newPost = new Post({
            postedBy,
            user: req.user._id,
            text,
            image
        });

        await newPost.save();

        res.status(201).json({ message: "post created", newPost});
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
        
    }


}

const getPost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id)

        if (!post) {
            return res.status(404).json({ message: "post not found"})
        }

        res.status(200).json({message: "post found", post});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    
}

const deletePost = async (req, res) => {

    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        await Post.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: "post deleted" });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

export { createPost, getPost, deletePost };

