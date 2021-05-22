const mongoose = require('mongoose');

const { Schema } = mongoose;

const UserSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: { type: String, required: true },
	password: { type: String, required: true },
	isMember: { type: Boolean, required: true },
	isAdmin: { type: Boolean, required: true },
});

UserSchema.virtual('name').get(function getName() {
	return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Users', UserSchema);
