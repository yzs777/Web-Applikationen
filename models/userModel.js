var fs = require('fs');
var path = require('path');

var userFilePath = path.join(__dirname, 'user.json');

function readUsers() {
    var data = fs.readFileSync(userFilePath, 'utf8');
    return JSON.parse(data);
}

function writeUsers(users) {
    fs.writeFileSync(userFilePath, JSON.stringify(users, null, 2));
}

function findUserByEmail(email) {
    var users = readUsers();

    return users.find(function(user) {
        return user.email === email;
    });
}

function addUser(user) {
    var users = readUsers();

    users.push(user);

    writeUsers(users);
}

function findUserById(id) {
    var users = readUsers();

    return users.find(function(user) {
        return user.id == id;
    });
}

function updateUserRole(id, newRole) {
    var users = readUsers();

    var user = users.find(function(user) {
        return user.id == id;
    });

    if (user) {
        user.role = newRole;
        writeUsers(users);
    }

    return user;
}

module.exports = {
    readUsers: readUsers,
    writeUsers: writeUsers,
    findUserByEmail: findUserByEmail,
    addUser: addUser,
    findUserById: findUserById,
    updateUserRole: updateUserRole
};