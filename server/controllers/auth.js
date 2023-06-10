import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


/* REGISTER USER */
// while exporting or posting something to the backend or database the function should be asyncoronous as it might take some time to export or import data 
export const register = async(req,res)=>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            friends,
            location,
            occupation,
        } = req.body;

        /** The bcrypt.genSalt() function generates a random salt value. 
         * A salt is a random string used to modify the hashing algorithm,
         *  making it more secure by adding complexity to the resulting hash.
         *  The genSalt() function returns a promise, so the await keyword is used to wait for the promise to resolve and assign the generated salt value to the salt variable. */
        const salt= await bcrypt.genSalt();

        /** The bcrypt.hash() function is used to generate a hash of the password using the generated salt value. 
         * The hash() function also returns a promise, so the await keyword is used to wait for the promise to resolve and assign the resulting password hash */
        const passwordHash = await bcrypt.hash(password,salt);


        // CREATING NEW USER
        /**First we have encrypted a password when user try to login we will provide him/her with a jsonwebtoken when the password will match only  */
        const newUser= new User({
            firstName:firstName,
            lastName:lastName,
            email:email,
            password: passwordHash,
            picturePath:picturePath,
            friends,
            location,
            occupation,
            viewedProfile: Math.floor(Math.random()*1000),
            impressions: Math.floor(Math.random()*1000)
        });
        // saving the information into the database
        const saveUser = await newUser.save();
        res.status(201).json(saveUser);
    } catch (err) {
        res.status(500).json({error : err.message});
    }
}

export const login = async (req,res)=> {
    try {
        const {email,password}= req.body;

        const user =await User.findOne({email: email})
        if(!user) return res.status(400).json({msg:"User does not exist."});

        const  isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch) return res.status(400).json({msg:"Invalid credetionals"});

        const token = jwt.sign({id: user._id},process.env.JWT_SECRET);
        delete user.password;
        res.status(200).json({token,user});

    } catch (error) {
        res.status(400).json({error : err.message});
    }
}