const mongoose = require('mongoose');
const { format } = require('date-fns');

const { Schema } = mongoose;

const MessageSchema = new Schema({
	title: { type: String, required: true },
	text: { type: String, required: true },
	time: { type: Date, default: Date.now() },
	creator: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
});

MessageSchema.virtual('formattedTime').get(function formatDate() {
	return format(this.time, 'MMM dd, yyy');
});

module.exports = mongoose.model('Messages', MessageSchema);
