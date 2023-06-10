import express from "express";
import {login} from "../controllers/auth.js";

const router = express.Router(); // this is used to create router function

router.post("login",login);

export default router;