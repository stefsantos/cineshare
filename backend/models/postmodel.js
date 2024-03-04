import mongoose from 'mongoose';

const postSchema = mongoose.Schema({

    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },

    text: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    likes: {
        type: [String],
        default: []
    },

    comments: [
        {
            userid: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'User'
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            },
            userProfilePic: {
                type: String
            },
            username: {
                type: String
            }
        }
    ]

}, {
    timestamps: true
});

const Post = mongoose.model('Post', postSchema);

export default Post;