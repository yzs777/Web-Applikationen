// Passwörter prüfen
var bcrypt = require('bcrypt');

// jsonwebtoken wird verwendet, um nach erfolgreichem Login einen Token zu erstellen
var jwt = require('jsonwebtoken');

// User-Model einbinden
var userModel = require('../models/userModel');

// Geheimer Schlüssel zum Signieren des Tokens
var JWT_SECRET = 'balance_yoga_secret';

function renderLoginPage(req, res) {
    res.render('login');
}

function login(req, res, next) {
    var user = userModel.findUserByEmail(req.body.email);

    if (!user) {
        return res.send('Benutzer wurde nicht gefunden.');
    }

    bcrypt.compare(req.body.password, user.password, function(err, result) {
        if (err) {
            return next(err);
        }

        if (!result) {
            return res.send('Passwort ist falsch.');
        }

        var token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            {
                expiresIn: '1h'
            }
        );

        res.cookie('token', token, {
            httpOnly: true
        });

        res.redirect('/admin');
    });
}

function logout(req, res) {
    res.clearCookie('token');
    res.redirect('/login');
}

module.exports = {
    renderLoginPage: renderLoginPage,
    login: login,
    logout: logout
};