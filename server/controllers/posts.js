import Post from "../models/Post.js";
import User from "../models/User.js";

/*CREATE POST */

export const createPost = async (req,res) =>{
    try {
        const {userId, description , picturePath} = req.body;
        const user = await User.findById(userId);
        if(!user)
        return res.status(404).json({message: "User not found"});
        else{
            const newPost = new Post({
                userId,
                firstName: user.firstName,
                lastName: user.lastName,
                location: user.location,
                discription: description,
                userPicturePath: user.picturePath,
                picturePath: picturePath,
                likes:{},
                comments:[]
            })

            // saving the post
            await newPost.save();

            // Grabbing all the post and sending to the forntend by sending response
            const post= await Post.find();
            res.status(201).json(post);
        }

    } catch (error) {
        res.status(409).json({message: error.message})
    }
}


/*READ */

export const getFeedPost = async (req,res) =>{
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (error) {
        res.status(408).json({message: error.message});
    }
}

export const getUserPosts = async (req,res) =>{
    try {
        const {userId} = req.params;
        const posts = await Post.find({userId});
        res.status(200).json(posts);
    } catch (error) {
        res.status(408).json({message: error.message});
    }
}
/* UPDATE COMMENT SECTION */

export const likePost = async (req,res) =>{
    try {
        const id = req.params;
        const {userId} = req.body;
        // Grabbing the post information
        const post = await Post.findById(userId);
        // checking if the user liked it or not 
        const isLiked = post.likes.get(userId);

        // if liked it then delete the pair liked and user id
        if(isLiked){
            post.likes.delete(userId);
        }
        // if not liked it then make like glow at frontend
        else {
            post.likes.set(userId,true);
        }


        // Update the post table
        const updatedPost = await Post.findByIdAndUpdate(
            id,
            {likes: post.likes},
            {new : true}
        );

        // update the frontend
        res.status(200).json(updatedPost);
    } catch (error) {
        res.status(408).json({message: error.message});
    }
}