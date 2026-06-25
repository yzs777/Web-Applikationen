var express = require('express');
var router = express.Router();

//Passwörter verschlüsseln
var bcrypt = require('bcrypt');

//users.json-Datei lesen und schreiben
var fs = require('fs');
//Dateipfad zu users.json sauber erstellen
var path = require('path');

//Pfad zur users.json-Datei
var usersFilePath = path.join(__dirname, '..', 'models', 'users.json');

// jsonwebtoken wird verwendet, um nach erfolgreichem Login einen Token zu erstellen
var jwt = require('jsonwebtoken');

// Geheimer Schlüssel zum Signieren des Tokens
var JWT_SECRET = 'balance_yoga_secret';

//Benutzer aus users.json lesen
function readUsers() {
  var data = fs.readFileSync(usersFilePath, 'utf8');
  return JSON.parse(data);
}

//Benutzer in users.json speichern
function writeUsers(users) {
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET register. */
router.get('/register', function(req, res, next) { 
  res.render('register'); 
});

/* GET login .*/
router.get('/login', function(req, res, next) {
  res.render('login');
});


//POST-Route für Registrierung
router.post('/register', function(req, res, next) {
  // vorhandene Benutzer aus users.json lesen
  var users = readUsers();

  // prüfen, ob die E-Mail bereits registriert ist
  var existingUser = users.find(function(user) {
    return user.email === req.body.email;
  });

  // falls E-Mail schon existiert, Registrierung abbrechen
  if (existingUser) {
    return res.send('Diese E-Mail ist bereits registriert.');
  }

  // Passwort aus dem Formular mit bcrypt verschlüsseln
  bcrypt.hash(req.body.password, 10, function(err, hashedPassword) {
    // falls beim Verschlüsseln ein Fehler entsteht
    if (err) {
      return next(err);
    }

    // neues Benutzerobjekt erstellen
    var newUser = {
      id: Date.now(),
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: 'user'
    };

    // neuen Benutzer zur Benutzerliste hinzufügen
    users.push(newUser);

    // aktualisierte Benutzerliste in users.json speichern
    writeUsers(users);

    // Antwort an den Browser senden
    res.send('Benutzer wurde erfolgreich registriert.');
  });
});

//POST-Route für Login
router.post('/login', function(req, res, next){

  // vorhandene Benutzer aus users.json lesen
  var users = readUsers();

  // Benutzer anhand der eingegebenen E-Mail suchen
  var user = users.find(function(user) {
    return user.email === req.body.email;
  });

  // falls kein Benutzer mit dieser E-Mail gefunden wurde
  if (!user) {
    return res.send('Benutzer wurde nicht gefunden.');
  }

  // eingegebenes Passwort mit gespeichertem verschlüsseltem Passwort vergleichen
  bcrypt.compare(req.body.password, user.password, function(err, result) {
    // falls beim Vergleichen ein Fehler entsteht
    if (err) {
      return next(err);
    }

    // falls Passwort falsch ist
    if (!result) {
      return res.send('Passwort ist falsch.');
    }

    /* // wenn E-Mail und Passwort stimmen
    res.send('Login erfolgreich.'); */

    // Token erstellen, wenn E-Mail und Passwort stimmen
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

    /* // Token erstmal als Antwort anzeigen
    res.send('Login erfolgreich. Token: ' + token); */

    res.cookie('token', token, {
      httpOnly: true
    });

    res.send('Login erfolgreich. Token wurde als Cookie gespeichert.');

  });

});

//Middleware zum Schutz von Routen
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

// Geschützte Admin-Route
router.get('/admin', requireLogin, function(req, res, next) {
  res.sendFile(path.join(__dirname, '..', '/public/admin.html'));
});

// Route zum Ausloggen
router.get('/logout', function(req, res, next) {
  // Cookie mit dem Token löschen
  res.clearCookie('token');

  // nach dem Ausloggen zur Loginseite weiterleiten
  res.redirect('/login');
});

module.exports = router;