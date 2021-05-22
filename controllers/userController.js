// eslint-disable-next-line global-require
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const passport = require('passport');
const User = require('../models/userModel');

exports.createUserGet = (req, res) => {
	res.render('signUp', { title: 'Sign Up' });
};

exports.createUserPost = [
	body('firstName')
		.trim()
		.isLength({ min: 2 })
		.withMessage('Minimum length of 2')
		.escape()
		.isAlpha()
		.withMessage('Contains non-alphabetical characters'),
	body('lastName')
		.trim()
		.isLength({ min: 2 })
		.withMessage('Minimum length of 2')
		.escape()
		.isAlpha()
		.withMessage('Contains non-alphabetical characters'),
	body('email', 'Invalid email format')
		.isEmail()
		.trim()
		.escape()
		.normalizeEmail(),
	body('password')
		.isLength({ min: 8 })
		.withMessage('Minimum length is 8')
		.matches('[0-9]')
		.withMessage('Must contain a number')
		.matches('[A-Z]')
		.withMessage('Must contain a capital letter'),
	body('passwordConfirm', 'Must be identical to password').custom(
		(value, { req }) => value === req.body.password
	),
	(req, res, next) => {
		const formErrors = validationResult(req);
		const { firstName, lastName, email, password } = req.body;

		if (!formErrors.isEmpty())
			return res.render('signUp', {
				title: 'Sign Up',
				user: req.body,
				errors: formErrors.array(),
			});

		return User.findOne({ email }).exec((mongoError1, emailFound) => {
			if (mongoError1) return next(mongoError1);

			if (emailFound) {
				const newFormErrorsArray = formErrors.array();
				newFormErrorsArray.push({
					msg: 'Email is already used',
					param: 'email',
				});

				return res.render('signUp', {
					title: 'Sign Up',
					user: req.body,
					errors: newFormErrorsArray,
				});
			}

			return bcrypt.hash(password, 10, (bcryptError, hash) => {
				if (bcryptError) return next(bcryptError);

				const user = new User({
					firstName,
					lastName,
					email,
					password: hash,
					isMember: false,
					isAdmin: false,
				});

				return user.save((mongoError2) => {
					if (mongoError2) return next(mongoError2);

					return res.redirect('/');
				});
			});
		});
	},
];

exports.loginUserGet = (req, res) => {
	res.render('login', { title: 'Login' });
};

exports.loginUserPost = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/user/login',
	failureFlash: true,
});

exports.logoutUserGet = (req, res) => {
	req.logout();
	res.redirect('/');
};

exports.makeUserMemberGet = (req, res) => {
	res.render('userStatus', {
		title: 'Member Registration',
		status: 'Member',
	});
};

exports.makeUserMemberPost = [
	body('password', 'Incorrect Password, check github page')
		.trim()
		.escape()
		.matches(process.env.MEMBER_PASSWORD),
	(req, res, next) => {
		const formErrors = validationResult(req);

		if (!formErrors.isEmpty())
			return res.render('userStatus', {
				title: 'Member Registration',
				status: 'Member',
				error: formErrors.array(),
			});

		return User.findByIdAndUpdate(
			// eslint-disable-next-line no-underscore-dangle
			req.user._id,
			{ isMember: true },
			(mongoError) => {
				if (mongoError) return next(mongoError);

				return res.redirect('/');
			}
		);
	},
];

exports.makeUserAdminGet = (req, res) => {
	res.render('userStatus', { title: 'Admin Registration', status: 'Admin' });
};

exports.makeUserAdminPost = [
	body('password', 'Incorrect Password, check github page')
		.trim()
		.escape()
		.matches(process.env.ADMIN_PASSWORD),
	(req, res, next) => {
		const formErrors = validationResult(req);

		if (!formErrors.isEmpty())
			return res.render('userStatus', {
				title: 'Admin Registration',
				status: 'Admin',
				error: formErrors.array(),
			});

		return User.findByIdAndUpdate(
			// eslint-disable-next-line no-underscore-dangle
			req.user._id,
			{ isAdmin: true },
			(mongoError) => {
				if (mongoError) return next(mongoError);

				return res.redirect('/');
			}
		);
	},
];
