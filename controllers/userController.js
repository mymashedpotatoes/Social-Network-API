const { User, Thought } = require('../models');

module.exports = {
    // get all users
    async getUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get a single user
    async getSingleUser(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v');

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a new user
    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // update user
    async updateUser(req, res) {
        try {
            const result = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (result) {
                console.log(`Updated user: ${result}`);
                res.status(200).json(result);
            } else {
                console.log('User not found.');
                res.status(404).json({ message: 'User not found.' });
            }
        } catch (err) {
            console.error('Error updating user:', err);
            res.status(500).json({ message: 'Something went wrong.' });
        }
    },

    // delete user
    async deleteUser(req, res) {
        try {
            const user = await User.findOneAndDelete(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true });

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            // delete associated thoughts
            await Thought.deleteMany({ _id: { $in: user.thoughts } });
            res.json({ message: 'User and associated thoughts deleted!' })
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // add new friend to user's friend list
    async addFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendId } },
                { runValidators: true, new: true });

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }
            return res.status(200).json({ message: 'Friend added successfully', user });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // remove a friend from a user's friend list
    async removeFriend(req, res) {
        try {
            const user = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendId } },
                { new: true })

            if (!user) {
                return res.status(404).json({ message: 'No user with that ID' });
            }

            return res.status(200).json({ message: 'Friend removed successfully', user });
        } catch (err) {
            res.status(500).json(err);
        }
    }
}