var express = require('express');
var router = express.Router();



//users.json-Datei lesen und schreiben
var fs = require('fs');
//Dateipfad zu users.json sauber erstellen
var path = require('path');

//Pfad zur users.json-Datei
var usersFilePath = path.join(__dirname, '..', 'models', 'users.json');





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



module.exports = router;