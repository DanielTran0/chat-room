// eslint-disable-next-line global-require
if (process.env.NODE_ENV !== 'production') require('dotenv').config();

const express = require('express');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const session = require('express-session');
const flash = require('express-flash');
const compression = require('compression');
const helmet = require('helmet');
const router = require('./routes/router');
const initializePassport = require('./passportConfig');

const app = express();
const port = process.env.PORT || 3000;
const dbDevUrl = `mongodb+srv://mongoUser:eZpaR6EJ3xcDY3@cluster0.b0awr.mongodb.net/members?retryWrites=true&w=majority`;
const dbUrl = process.env.DB_URL || dbDevUrl;

mongoose.connect(dbUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

initializePassport(passport);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(compression());
app.use(helmet());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(
	session({
		resave: false,
		saveUninitialized: false,
		secret: process.env.SESSION_SECRET,
		store: MongoStore.create({ mongoUrl: process.env.DB_URL || dbDevUrl }),
	})
);
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	next();
});

app.use(router);
app.use((req, res, next) => {
	next(createError(404));
});

app.listen(port);
