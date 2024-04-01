const dayjs = require('dayjs');
const { Schema, model, Types } = require('mongoose');


// Schema to create Reaction
const reactionSchema = new Schema(
  {
      reactionId: {
          type: Schema.Types.ObjectId,
          default: () => new Types.ObjectId(),
      },
      reactionBody: {
          type: String,
          required: true,
          maxlength: 280,
      },
      username: {
          type: String,
          required: true,
      },
      createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        get: (date) => dayjs(date).format('MM-DD-YYYY hh:mm:ss'),
      },
  },
  {
      toJSON: {
          getters: true,
      },
      id: false,
  }
);

// Schema to create Thought model
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 280,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
      get: (date) => dayjs(date).format('MM-DD-YYYY hh:mm:ss'),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

// Create a virtual property `reactionCount` that gets length of thought's reactions array field on query
thoughtSchema
  .virtual('reactionCount')
  // Getter
  .get(function () {
    return this.reactions.length;
  });

const Thought = model('thought', thoughtSchema);

module.exports = Thought;