import User from "../models/User.js";

/* READ */
export const getUser = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        //It uses the User model to find the user with the specified id using User.findById(id).
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

export const getUserFriends = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        //It uses the User model to find the user with the specified id using User.findById(id).

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        // uses Promise.all() to retrieve the details of each friend by mapping over the user.friends array and calling User.findById(id) for each friend's id.

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        //The retrieved friends are formatted to include only specific properties (_id, firstName, lastName, occupation, location, picturePath).

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};

/* UPDATE */
export const addRemoveFriend = async(req, res) => {
    try {
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        //If the friendId is already present in the user's friends array, it removes it from the array else push it.

        await user.save();
        await friend.save();
        //The changes are saved to the user and friend objects

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
};