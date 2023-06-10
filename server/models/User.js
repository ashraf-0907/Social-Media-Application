import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    firstName:{
        type: String,
        require: true,
        min:2,
        max:50,
    },
    lastName:{
        type: String,
        require: true,
        min:2,
        max:50,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, //regex expressin to check if the email is valid
    },
    password:{
        type:String,
        require:true,
        min:5,
        max:15,
    },
    picturePath:{
        type:String,
        default:"",
    },
    friends:{
        type:Array,
        default:[],
    },
    location:{ 
        type:String,
    },
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
},
{timestamps: true});

const User= mongoose.model("User",UserSchema); //This is used to create model of the schema mongoose.model thakes two parameter name of the model and object of the schema
export default User;