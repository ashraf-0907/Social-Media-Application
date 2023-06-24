import express from "express";
import {
    getUser,
    getUserFriends,
    addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();
//creates a new router instance using the express.Router() method.

/* READ */
router.get("/:id", verifyToken, getUser); //The getUser function from the controller will be executed to handle this route.

router.get("/:id/friends", verifyToken, getUserFriends); ////The getUser function from the controller will be executed to handle this route.

/* UPDATE */
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);
//defines a PATCH route that expects two parameters: id and friendId. The verifyToken middleware is used, and the addRemoveFriend function from the controller will be executed for this route.

export default router;