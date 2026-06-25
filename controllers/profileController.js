function renderUserDashboardPage(req, res) {
    res.render('user-dashboard');
}

function renderProfileEditPage(req, res) {
    res.render('profil-bearbeiten');
}

module.exports = {
    renderUserDashboardPage: renderUserDashboardPage,
    renderProfileEditPage: renderProfileEditPage
};