const { Schema, model } = require('mongoose');
const thoughtSchema = require('./Thought');

// Schema to create User model
const userSchema = new Schema(
    {
        username: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        },
        thoughts: [thoughtSchema],
        friends: [userSchema],
    },
    {
        toJSON: {
          virtuals: true,
        },
        id: false,
    },
);

// Create a virtual property `friendCount` that gets legth of user's friends array on query
userSchema
  .virtual('friendCount')
  // Getter
  .get(function () {
    return this.friends.length;
  });

const User = model('user', userSchema);

module.exports = User;
