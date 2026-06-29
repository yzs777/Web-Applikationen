registerModel = require("../models/registerModel")

const renderRegisterPage = (req,res) =>{
    res.render('register.ejs');
}

const register = (req,res,next) =>{
    registerModel.registerUser(req,res,next);
}

module.exports = {
    renderRegisterPage,
    register
};