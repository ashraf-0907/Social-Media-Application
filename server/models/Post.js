import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: true,
    },
    firstName:{
        type: String,
        required: true,
        min:2,
        max:80,
    },
    lastName:{
        type: String,
        required: true,
        min:2,
        max:80,
    },
    location: String,
    description :String,
    userPicturePath: String,
    picturePath:String ,
    likes: {
        type:Map,
        of: Boolean,
      //  default: false,
    },
    comments:{
        type: Array,
        default:[],
    }},
    {
        timestamps:true,
    })

    const Post = mongoose.model("Post",postSchema);
    export default Post;