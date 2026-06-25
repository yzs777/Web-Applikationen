var express = require('express');
var router = express.Router();

var loginController = require('../controllers/loginController');
var registerController = require('../controllers/registerController');
var adminController = require('../controllers/adminController');

var homeController = require('../controllers/homeController');
var courseController = require('../controllers/courseController');
var trainerController = require('../controllers/trainerController');
var workshopController = require('../controllers/workshopController');
var profileController = require('../controllers/profileController.js');
var staticController = require('../controllers/staticController');

var jwt = require('jsonwebtoken');
var JWT_SECRET = 'balance_yoga_secret';

function requireLogin(req, res, next) {
    var token = req.cookies.token;

    if (!token) {
        return res.redirect('/login');
    }

    jwt.verify(token, JWT_SECRET, function(err, decoded) {
        if (err) {
            return res.redirect('/login');
        }

        req.user = decoded;
        next();
    });
}

function requireAdmin(req, res, next) {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Zugriff verweigert. Nur Administratoren dürfen diese Seite öffnen.');
    }

    next();
}

// normale Seiten
router.route('/')
    .get(homeController.renderHomePage);

router.route('/kurse')
    .get(courseController.renderCoursePage);

router.route('/trainer')
    .get(trainerController.renderTrainerPage);

router.route('/workshops')
    .get(workshopController.renderWorkshopPage);

router.route('/kontakt')
    .get(staticController.renderKontaktPage);

router.route('/impressum')
    .get(staticController.renderImpressumPage);

router.route('/datenschutz')
    .get(staticController.renderDatenschutzPage);

// Login, Logout, Register
router.route('/login')
    .get(loginController.renderLoginPage)
    .post(loginController.login);

router.route('/logout')
    .get(loginController.logout);

router.route('/register')
    .get(registerController.renderRegisterPage)
    .post(registerController.register);

// geschützte User-Seiten
router.route('/user-dashboard')
    .get(requireLogin, profileController.renderUserDashboardPage);

router.route('/profil-bearbeiten')
    .get(requireLogin, profileController.renderProfileEditPage);

// geschützte Admin-Seite
router.route('/admin')
    .get(requireLogin, requireAdmin, adminController.renderAdminPage);

module.exports = router;