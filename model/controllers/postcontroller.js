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

const likeUnlikePost = async (req, res) => {

    try {

        const {id: postId} = req.params;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        const userLikedPost = post.likes.includes(userId);

        if (userLikedPost) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })
            res.status(200).json({ message: "post unliked" });
        } else {
            post.likes.push(userId);
            await post.save();
            res.status(200).json({ message: "post liked" });
        }

    } catch (error) {

        res.status(500).json({ message: error.message });

    }

}

const replyToPost = async (req, res) => {
   
    try {
        const {text} = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilepic;
        const username = req.user.username;

        if (!text) {
            return res.status(400).json({ message: "Invalid reply data" });
        }

        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "post not found" });
        }

        const reply = {userId, text, userProfilePic, username};

        post.replies.push(reply);
        await post.save();

        res.status(201).json({ message: "reply added", post });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

const getAllFeedPosts = async (req, res) => {
    try {
        // Fetch all posts from the database, sorted by createdAt in descending order (most recent first)
        const feedPosts = await Post.find().sort({createdAt: -1});

        // Check if there are posts available
        if (feedPosts.length === 0) {
            return res.status(404).json({message: "No posts found"});
        }

        // Return the posts if found
        res.status(200).json({message: "Feed posts found", feedPosts});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getFriendFeedPosts = async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const following = user.following;

        const feedPosts = await Post.find({postedBy: { $in: following }}).sort({createdAt: -1});

        if (feedPosts.length === 0) {
            return res.status(404).json({ message: "No friend feed posts found" });
        }
        res.status(200).json({ message: "Friend feed posts found", feedPosts });

    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
}
export { createPost, getPost, deletePost, likeUnlikePost, replyToPost, getAllFeedPosts, getFriendFeedPosts };