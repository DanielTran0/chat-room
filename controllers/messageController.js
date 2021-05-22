const { body, validationResult } = require('express-validator');
const Message = require('../models/messageModel');

exports.displayMessagesGet = (req, res, next) => {
	Message.find({})
		.populate('creator')
		.sort([['time', -1]])
		.exec((mongoError, messages) => {
			if (mongoError) return next(mongoError);

			return res.render('index', { messages });
		});
};

exports.createMessageGet = (req, res) => {
	res.render('messageForm', { title: 'Create a Message' });
};

exports.createMessagePost = [
	body('title', 'Must exist').trim().escape().isLength({ min: 1 }),
	body('message', 'Must exist').trim().escape().isLength({ min: 1 }),
	(req, res, next) => {
		const formErrors = validationResult(req);
		const { title, message } = req.body;

		if (!formErrors.isEmpty())
			return res.render('messageForm', {
				title: 'Create a Message',
				errors: formErrors.array(),
			});

		const newMessage = new Message({
			title,
			text: message,
			// eslint-disable-next-line no-underscore-dangle
			creator: req.user._id,
		});

		return newMessage.save((mongoError) => {
			if (mongoError) return next(mongoError);

			return res.redirect('/');
		});
	},
];

exports.deleteMessagePost = (req, res, next) => {
	if (!req.user.isAdmin) return res.redirect('/');

	return Message.findByIdAndRemove(req.body.messageId).exec((mongoError) => {
		if (mongoError) return next(mongoError);

		return res.redirect('/');
	});
};
