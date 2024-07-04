const express = require('express');
const  vicechancellor_route = express();

const session = require('express-session');
const config = require('../config/config');
vicechancellor_route.use(session({
    secret:config.sessionSecret,
    resave: false,  
    saveUninitialized: false,
}));

const bodyParser = require('body-parser');
vicechancellor_route.use(bodyParser.json());
vicechancellor_route.use(bodyParser.urlencoded({extended:true}));

// for image upload
const multer = require("multer");
const path = require('path');

vicechancellor_route.use(express.static('public'));

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

vicechancellor_route.set('view engine','ejs');
vicechancellor_route.set('views','./views/vicechancellor');

 

const vicechancellorAuth = require('../middleware/vicechancellorAuth');


// controller for all function
const VicechanllorController = require('../controllers/VicechanllorController');
// const VicechanllorController = require('../controllers/VicechanllorController');



vicechancellor_route.get('/',vicechancellorAuth.islogout,VicechanllorController.loadLogin);



vicechancellor_route.post('/',VicechanllorController.verifyLogin);

vicechancellor_route.get('/home',vicechancellorAuth.islogin,VicechanllorController.loadDashboard);


vicechancellor_route.get('/logout',vicechancellorAuth.islogin,VicechanllorController.loadlogout);

vicechancellor_route.get('/forget',vicechancellorAuth.islogout,VicechanllorController.forgetLoad);

vicechancellor_route.post('/forget',vicechancellorAuth.islogout,VicechanllorController.forgetVerify);
vicechancellor_route.get('/forget-password',VicechanllorController.forgetPasswordLoad);
vicechancellor_route.post('/forget-password',VicechanllorController.resetPassword);


vicechancellor_route.get('/edit',vicechancellorAuth.islogin,VicechanllorController.editLoad);
vicechancellor_route.post('/edit',upload.single('image'),VicechanllorController.updateProfile);

vicechancellor_route.get('/delete/:id',vicechancellorAuth.islogin,VicechanllorController.loaddelete);
vicechancellor_route.get('/deleteleave/:id',vicechancellorAuth.islogin,VicechanllorController.loaddeleteLeave);



// database
vicechancellor_route.get('/database',vicechancellorAuth.islogin,VicechanllorController.loadDatabase);
vicechancellor_route.get('/table',vicechancellorAuth.islogin,VicechanllorController.loadtable);
vicechancellor_route.get('/profile',vicechancellorAuth.islogin,VicechanllorController.loadProfile);

// add new
vicechancellor_route.get('/register',vicechancellorAuth.islogin,VicechanllorController.loadRegister);
vicechancellor_route.post('/register',upload.single('image'),VicechanllorController.insertUser);

vicechancellor_route.get('/pending',vicechancellorAuth.islogin,VicechanllorController.loadpending);
vicechancellor_route.get('/approved',vicechancellorAuth.islogin,VicechanllorController.loadapproved);
vicechancellor_route.get('/rejected',vicechancellorAuth.islogin,VicechanllorController.loadrejected);

// action
vicechancellor_route.get('/action',vicechancellorAuth.islogin,VicechanllorController.actionLoad);
vicechancellor_route.post('/action',VicechanllorController.updateAction);


// admintable 
vicechancellor_route.get('/admintable',vicechancellorAuth.islogin,VicechanllorController.loadadmintable);
vicechancellor_route.get('/dom',vicechancellorAuth.islogin,VicechanllorController.loaddomhome);

vicechancellor_route.get('/department',vicechancellorAuth.islogin,VicechanllorController.loaddepartment);
vicechancellor_route.get('/add_department',VicechanllorController.loadAddDepartment);
vicechancellor_route.post('/add_department',VicechanllorController.adddepartment);
 

// for exprort
vicechancellor_route.get('/userexport',VicechanllorController.userexport);
vicechancellor_route.get('/userexportPdf',VicechanllorController.userexportPdf);
 

vicechancellor_route.get('*',function(req, res){

    res.redirect('/Vicechanllor');
});

module.exports = vicechancellor_route;