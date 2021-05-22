const express = require('express');
const userController = require('../controllers/userController');
const messageController = require('../controllers/messageController');

const router = express.Router();

// user routes
router.get('/user/create', userController.createUserGet);
router.post('/user/create', userController.createUserPost);

router.get('/user/login', userController.loginUserGet);
router.post('/user/login', userController.loginUserPost);

router.get('/user/logout', userController.logoutUserGet);

router.get('/user/member', userController.makeUserMemberGet);
router.post('/user/member', userController.makeUserMemberPost);

router.get('/user/admin', userController.makeUserAdminGet);
router.post('/user/admin', userController.makeUserAdminPost);

// message routes
router.get('/message/create', messageController.createMessageGet);
router.post('/message/create', messageController.createMessagePost);

router.post('/message/delete', messageController.deleteMessagePost);

router.get('/', messageController.displayMessagesGet);

module.exports = router;
