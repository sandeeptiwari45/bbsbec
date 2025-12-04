const mongoose = require('mongoose');

const profileUpdateRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    requestedChanges: {
        type: Object,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    adminComment: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

profileUpdateRequestSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model('ProfileUpdateRequest', profileUpdateRequestSchema);
