const express = require('express');
const  admin_route = express();

const session = require('express-session');
const config = require('../config/config');
admin_route.use(session({
    secret:config.sessionSecret,
    resave: false,  
    saveUninitialized: false,
}));

const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

// for image upload
const multer = require("multer");
const path = require('path');

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname, '../public/userimages'))
    },
    filename:function (req, file, cb) {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload = multer({storage:storage});

admin_route.set('view engine','ejs');
admin_route.set('views','./views/administrator');

 

const administratorAuth = require('../middleware/administratorAuth');


// controller for all function
const administratorController = require('../controllers/administratorController');



admin_route.get('/',administratorAuth.islogout,administratorController.loadLogin);



admin_route.post('/',administratorController.verifyLogin);

admin_route.get('/home',administratorAuth.islogin,administratorController.loadDashboard);


admin_route.get('/logout',administratorAuth.islogin,administratorController.loadlogout);

admin_route.get('/forget',administratorAuth.islogout,administratorController.forgetLoad);

admin_route.post('/forget',administratorAuth.islogout,administratorController.forgetVerify);
admin_route.get('/forget-password',administratorController.forgetPasswordLoad);
admin_route.post('/forget-password',administratorController.resetPassword);


admin_route.get('/edit',administratorAuth.islogin,administratorController.editLoad);
admin_route.post('/edit',upload.single('image'),administratorController.updateProfile);

admin_route.get('/delete/:id',administratorAuth.islogin,administratorController.loaddelete);
admin_route.get('/deleteleave/:id',administratorAuth.islogin,administratorController.loaddeleteLeave);



// database
admin_route.get('/database',administratorAuth.islogin,administratorController.loadDatabase);
admin_route.get('/table',administratorAuth.islogin,administratorController.loadtable);
admin_route.get('/profile',administratorAuth.islogin,administratorController.loadProfile);

// add new
admin_route.get('/register',administratorAuth.islogin,administratorController.loadRegister);
admin_route.post('/register',upload.single('image'),administratorController.insertUser);

admin_route.get('/pending',administratorAuth.islogin,administratorController.loadpending);
admin_route.get('/approved',administratorAuth.islogin,administratorController.loadapproved);
admin_route.get('/rejected',administratorAuth.islogin,administratorController.loadrejected);

// action
admin_route.get('/action',administratorAuth.islogin,administratorController.actionLoad);
admin_route.post('/action',administratorController.updateAction);


// admintable 
admin_route.get('/admintable',administratorAuth.islogin,administratorController.loadadmintable);
admin_route.get('/dom',administratorAuth.islogin,administratorController.loaddomhome);

admin_route.get('/department',administratorAuth.islogin,administratorController.loaddepartment);
admin_route.get('/add_department',administratorController.loadAddDepartment);
admin_route.post('/add_department',administratorController.adddepartment);
 

// for exprort
admin_route.get('/userexport',administratorController.userexport);
admin_route.get('/userexportPdf',administratorController.userexportPdf);
 

admin_route.get('*',function(req, res){

    res.redirect('/administrator');
});

module.exports = admin_route;