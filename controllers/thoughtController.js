const { Thought, User } = require('../models');

module.exports = {
    // get all thoughts
    async getThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // get a single thought
    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json(thought);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    // create a new thought
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            const user = await User.findById(req.body.userId);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
            user.thoughts.push(thought._id);
            await user.save();

            return res.status(201).json({ message: 'Thought created successfully', thought });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // update thought
    async updateThought(req, res) {
        try {
            const result = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );

            if (result) {
                console.log(`Updated thought: ${result}`);
                res.status(200).json(result);
            } else {
                console.log('Thought not found.');
                res.status(404).json({ message: 'Thought not found.' });
            }
        } catch (err) {
            console.error('Error updating thought:', err);
            res.status(500).json({ message: 'Something went wrong.' });
        }
    },

    // delete thought
    async deleteThought(req, res) {
        try {
            const thought = await Thought.findOneAndDelete(
                { _id: req.params.thoughtId },
                { runValidators: true, new: true });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json({ message: 'Thought deleted.' })
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // create reaction
    async createReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $addToSet: { reactions: req.body } },
                { runValidators: true, new: true });
                
            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }
            return res.status(201).json({ message: 'Reaction created successfully', thought });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // delete reaction
    async deleteReaction(req, res) {
        try {
            const thought = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.body.reactionId } } },
                { runValidators: true, new: true });

            if (!thought) {
                return res.status(404).json({ message: 'No thought with that ID' });
            }

            res.json({ message: 'Reaction deleted.', thought })
        } catch (err) {
            res.status(500).json(err);
        }
    },
}