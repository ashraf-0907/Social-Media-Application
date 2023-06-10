import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";
import mongoose from "mongoose";
import dotenv from "dotenv";
import helmet from "helmet";
import morgan from "morgan";
import {fileURLToPath} from 'url';
import path from "path";
import {register} from "./controllers/auth.js"
import authRoutes from "./routes/auth.js";
import { verifyToken } from "./middleware/auth.js";

/*CONFIGURATION*/
//const {Path} = mongoose;
const __filename= fileURLToPath(import.meta.url);
const __dirname= path.dirname(__filename);
dotenv.config();
// express is use to deal with all http request and will entertain all request to the port
const app=express();
//express.json will parse the json object request in the body, allow you to handle json data in our route handler
app.use(express.json());
// Helmet helps secure the application by setting various HTTP headers to protect against common vulnerabilities
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy: "cross-origin"}));
app.use(morgan("common"));
app.use(bodyParser.json({limit:"60mb",extended: true}));
app.use(bodyParser.urlencoded({limit:"30mb",extended : true}));
app.use(cors());
app.use("/assets",express.static(path.join(__dirname,'public/assets')));

/* FILE STORAGE */
// multer.diskStorage is an engine which handle the writting of the file in the disk 
const storage = multer.diskStorage //This line creates a new instance of multer.diskStorage, which defines the configuration for storing uploaded files on the disk.
({
    // This property will specify the destination directoary where to store the file ,
    // func require request , file to store and a callback function which specify the location to store file 
    destination: function(req, file, cb){
        cb(null, "bublic/assets"); 
    },
    // property specify the filename of the stored file 
    // function recieve the request, file to be uploaded and a callback function 
    filename: function(req,file,cb){
        cb(null,file.originalname);
    }
})
const upload = multer({ storage });

/* Routes with files */
/**This is an API endpoint defined using express.js
 * POST route to auth/register url having function register to handle the request
 * upload.single is a middleware by the multer library handle the process for upload of picture 
*/
app.post("/auth/register",upload.single("picture"), verifyToken ,register);

/* Creating Routes */

app.use("/auth", authRoutes);


/* MONGOOSE SETUP */
const PORT=process.env.PORT || 3001; // PORT = 5000 you can directly write it no problem variable or const save in .env(environmental file) are access using process.env.varname
// mongoose.connect func will take databse link to connect to database and app.listen will take port to listen the http request
mongoose.connect(process.env.DB_CONNECT,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(()=>{
    app.listen(PORT, ()=>console.log(`Connected to port ${PORT}`));
}).catch((error)=>console.log(`${error} did not connect`));