const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('./models/userModel');

const initializePassport = (passport) => {
	passport.use(
		new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
			User.findOne({ email }).exec((mongoError, user) => {
				if (mongoError) return done(mongoError);
				if (!user) return done(null, false, { message: 'Incorrect username' });

				return bcrypt.compare(
					password,
					user.password,
					(bcryptError, result) => {
						if (bcryptError) return done(bcryptError);
						if (!result)
							return done(null, false, { message: 'Incorrect password' });

						return done(null, user);
					}
				);
			});
		})
	);

	passport.serializeUser((user, done) => {
		done(null, user.id);
	});
	passport.deserializeUser((id, done) => {
		User.findById(id).exec((mongoError, user) => {
			done(mongoError, user);
		});
	});
};

module.exports = initializePassport;
