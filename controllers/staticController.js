function renderKontaktPage(req, res) {
    res.render('kontakt');
}

function renderImpressumPage(req, res) {
    res.render('impressum');
}

function renderDatenschutzPage(req, res) {
    res.render('datenschutz');
}

module.exports = {
    renderKontaktPage: renderKontaktPage,
    renderImpressumPage: renderImpressumPage,
    renderDatenschutzPage: renderDatenschutzPage
};