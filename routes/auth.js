var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const loginController = require('../controllers/loginController');
const registerController = require('../controllers/registerController');
const adminController = require('../controllers/adminController');

var JWT_SECRET = 'balance_yoga_secret';

function requireLogin(req, res, next) {
  // Token aus dem Cookie auslesen
  var token = req.cookies.token;

  // Wenn kein Token vorhanden ist, zur Loginseite weiterleiten
  if (!token) {
    return res.redirect('/login');
  }

  // Token prüfen
  jwt.verify(token, JWT_SECRET, function(err, decoded) {
    // Wenn der Token ungültig ist, zur Loginseite weiterleiten
    if (err) {
      return res.redirect('/login');
    }

    // Benutzerinformationen aus dem Token speichern
    req.user = decoded;

    // Weiter zur eigentlichen geschützten Route
    next();
  });
}

function requireAdmin(req, res, next) {
  console.log('USER AUS TOKEN:', req.user);

  if (req.user.role !== 'admin') {
    return res.status(403).send('Zugriff verweigert. Nur Administratoren dürfen diese Seite öffnen.');
  }

  next();
}

router.route('/login')
.post(loginController.login)
.get(loginController.renderLoginPage);

router.route('/logout')
.get(loginController.logout);

router.route('/register')
.post(registerController.register)
.get(registerController.renderRegisterPage);

router.route('/admin')
.get(requireLogin,requireAdmin,adminController.renderAdminPage);

module.exports = router;
