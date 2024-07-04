const express = require('express');
const  Department_Admin_route = express();

const session = require('express-session');
const config = require('../config/config');
Department_Admin_route.use(session({
    secret:config.sessionSecret,
    resave: false,  
    saveUninitialized: false,
}));

const bodyParser = require('body-parser');
Department_Admin_route.use(bodyParser.json());
Department_Admin_route.use(bodyParser.urlencoded({extended:true}));

// for image upload
const multer = require("multer");
const path = require('path');

Department_Admin_route.use(express.static('public'));

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

Department_Admin_route.set('view engine','ejs');
Department_Admin_route.set('views','./views/Department_Admin');

 

const Department_AdminAuth = require('../middleware/Department_AdminAuth');


// controller for all function
const Department_AdminController = require('../controllers/Department_AdminController');



Department_Admin_route.get('/',Department_AdminAuth.islogout,Department_AdminController.loadLogin);



Department_Admin_route.post('/',Department_AdminController.verifyLogin);

Department_Admin_route.get('/home',Department_AdminAuth.islogin,Department_AdminController.loadDashboard);
Department_Admin_route.get('/logout',Department_AdminAuth.islogin,Department_AdminController.loadlogout);

Department_Admin_route.get('/forget',Department_AdminAuth.islogout,Department_AdminController.forgetLoad);

Department_Admin_route.post('/forget',Department_AdminAuth.islogout,Department_AdminController.forgetVerify);
Department_Admin_route.get('/forget-password',Department_AdminController.forgetPasswordLoad);
Department_Admin_route.post('/forget-password',Department_AdminController.resetPassword);


Department_Admin_route.get('/edit',Department_AdminAuth.islogin,Department_AdminController.editLoad);
Department_Admin_route.post('/edit',upload.single('image'),Department_AdminController.updateProfile);

Department_Admin_route.get('/delete/:id',Department_AdminAuth.islogin,Department_AdminController.loaddelete);
Department_Admin_route.get('/deleteleave/:id',Department_AdminAuth.islogin,Department_AdminController.loaddeleteLeave);



// database
Department_Admin_route.get('/database',Department_AdminAuth.islogin,Department_AdminController.loadDatabase);
Department_Admin_route.get('/table',Department_AdminAuth.islogin,Department_AdminController.loadtable);
Department_Admin_route.get('/profile',Department_AdminAuth.islogin,Department_AdminController.loadProfile);

// add new
Department_Admin_route.get('/register',Department_AdminAuth.islogin,Department_AdminController.loadRegister);
Department_Admin_route.post('/register',upload.single('image'),Department_AdminController.insertUser);

Department_Admin_route.get('/pending',Department_AdminAuth.islogin,Department_AdminController.loadpending);
Department_Admin_route.get('/administratorPending',Department_AdminAuth.islogin,Department_AdminController.loadadministratorpending);

Department_Admin_route.get('/approved',Department_AdminAuth.islogin,Department_AdminController.loadapproved);
Department_Admin_route.get('/administratorApproved',Department_AdminAuth.islogin,Department_AdminController.loadadministratorapproved);

Department_Admin_route.get('/rejected',Department_AdminAuth.islogin,Department_AdminController.loadrejected);
Department_Admin_route.get('/administratorRejected',Department_AdminAuth.islogin,Department_AdminController.loadadministratorrejected);

// action
Department_Admin_route.get('/action',Department_AdminAuth.islogin,Department_AdminController.actionLoad);
Department_Admin_route.post('/action',Department_AdminController.updateAction);


// admintable 
Department_Admin_route.get('/admintable',Department_AdminAuth.islogin,Department_AdminController.loadadmintable);
Department_Admin_route.get('/dom',Department_AdminAuth.islogin,Department_AdminController.loaddomhome);
Department_Admin_route.get('/homeadministrator',Department_AdminAuth.islogin,Department_AdminController.loadadministrator);

Department_Admin_route.get('/department',Department_AdminAuth.islogin,Department_AdminController.loaddepartment);
Department_Admin_route.get('/add_department',Department_AdminController.loadAddDepartment);
Department_Admin_route.post('/add_department',Department_AdminController.adddepartment);
 

// Department_Admin_route.get('/createLeaveBal', Department_AdminController.loadLeaveBal);
// Department_Admin_route.post('/createLeaveBal', Department_AdminController.createLeaveBal);


// for exprort
Department_Admin_route.get('/userexport',Department_AdminController.userexport);
Department_Admin_route.get('/userexportPdf',Department_AdminController.userexportPdf);
 

Department_Admin_route.get('*',function(req, res){

    res.redirect('/admin');
});

module.exports = Department_Admin_route;