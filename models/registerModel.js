var userModel = require('../models/userModel');
var bcrypt = require('bcrypt');

function registerUser(req,res,next){
    let users = userModel.readUsers();

  // prüfen, ob die E-Mail bereits registriert ist
  let existingUser = users.find(function(user) {
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
    let newUser = {
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
    userModel.writeUsers(users);
    res.send('Benutzer wurde erfolgreich registriert.');
    });
    }

  module.exports = {
    registerUser
  };
