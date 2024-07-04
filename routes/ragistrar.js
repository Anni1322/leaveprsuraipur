const express = require('express');
const  Ragistrar_route = express();

const session = require('express-session');
const config = require('../config/config');
Ragistrar_route.use(session({
    secret:config.sessionSecret,
    resave: false,  
    saveUninitialized: false,
}));

const bodyParser = require('body-parser');
Ragistrar_route.use(bodyParser.json());
Ragistrar_route.use(bodyParser.urlencoded({extended:true}));

// for image upload
const multer = require("multer");
const path = require('path');

Ragistrar_route.use(express.static('public'));

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

Ragistrar_route.set('view engine','ejs');
Ragistrar_route.set('views','./views/Ragistrar');

 

const registrarAuth = require('../middleware/registrarAuth');


// controller for all function
const ragistarController = require('../controllers/ragistarController');



Ragistrar_route.get('/',registrarAuth.islogout,ragistarController.loadLogin);



Ragistrar_route.post('/',ragistarController.verifyLogin);

Ragistrar_route.get('/home',registrarAuth.islogin,ragistarController.loadDashboard);
Ragistrar_route.get('/logout',registrarAuth.islogin,ragistarController.loadlogout);

Ragistrar_route.get('/forget',registrarAuth.islogout,ragistarController.forgetLoad);

Ragistrar_route.post('/forget',registrarAuth.islogout,ragistarController.forgetVerify);
Ragistrar_route.get('/forget-password',ragistarController.forgetPasswordLoad);
Ragistrar_route.post('/forget-password',ragistarController.resetPassword);


Ragistrar_route.get('/edit',registrarAuth.islogin,ragistarController.editLoad);
Ragistrar_route.post('/edit',upload.single('image'),ragistarController.updateProfile);

Ragistrar_route.get('/delete/:id',registrarAuth.islogin,ragistarController.loaddelete);
Ragistrar_route.get('/deleteleave/:id',registrarAuth.islogin,ragistarController.loaddeleteLeave);



// database
Ragistrar_route.get('/database',registrarAuth.islogin,ragistarController.loadDatabase);
Ragistrar_route.get('/table',registrarAuth.islogin,ragistarController.loadtable);
Ragistrar_route.get('/profile',registrarAuth.islogin,ragistarController.loadProfile);

// add new
Ragistrar_route.get('/register',registrarAuth.islogin,ragistarController.loadRegister);
Ragistrar_route.post('/register',upload.single('image'),ragistarController.insertUser);

Ragistrar_route.get('/pending',registrarAuth.islogin,ragistarController.loadpending);
Ragistrar_route.get('/administratorPending',registrarAuth.islogin,ragistarController.loadadministratorpending);

Ragistrar_route.get('/approved',registrarAuth.islogin,ragistarController.loadapproved);
Ragistrar_route.get('/administratorApproved',registrarAuth.islogin,ragistarController.loadadministratorapproved);

Ragistrar_route.get('/rejected',registrarAuth.islogin,ragistarController.loadrejected);
Ragistrar_route.get('/administratorRejected',registrarAuth.islogin,ragistarController.loadadministratorrejected);

// action
Ragistrar_route.get('/action',registrarAuth.islogin,ragistarController.actionLoad);
Ragistrar_route.post('/action',ragistarController.updateAction);


// admintable 
Ragistrar_route.get('/admintable',registrarAuth.islogin,ragistarController.loadadmintable);
Ragistrar_route.get('/dom',registrarAuth.islogin,ragistarController.loaddomhome);
Ragistrar_route.get('/homeadministrator',registrarAuth.islogin,ragistarController.loadadministrator);

Ragistrar_route.get('/department',registrarAuth.islogin,ragistarController.loaddepartment);
Ragistrar_route.get('/add_department',ragistarController.loadAddDepartment);
Ragistrar_route.post('/add_department',ragistarController.adddepartment);
 

// for exprort
Ragistrar_route.get('/userexport',ragistarController.userexport);
Ragistrar_route.get('/userexportPdf',ragistarController.userexportPdf);
 

Ragistrar_route.get('*',function(req, res){

    res.redirect('/Ragistrar');
});

module.exports = Ragistrar_route;