const User = require('../models/userModel');
const Leave = require('../models/leaveModel');
const Department = require("../models/department");
const LeaveBalance = require("../models/LeaveBalanceModel");
const LeaveBal = require("../models/LeaveBalModel");
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const config = require('../config/config');

const randomstring = require('randomstring');
const { render } = require('ejs');

// s password 
const securePassword = async(password)=>{
    try{
         const passwordHash = await bcrypt.hash(password, 10);
         return passwordHash;
     }catch(error){
         console.log(error.message)
     }
}

// for send mail funcion
const sendvarifyMail = async(name, email, user_id)=>{

    try{
        const transporter =  nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
         });
        const mailOption = {
            from:config.emailUser,
            to:email,
            subject:'for verification mail',
            html:'<p> hi '+name+', Please click here to <a href="https://prsuleaveease.onrender.com/verify?id='+user_id+'">Verify</a> Your mail.</p>',
        };
            transporter.sendMail(mailOption, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log("email has been sent:-",info.response);
                }
            })
     
     }catch(error){
         console.log(error.message)
     }
}

// 
const sendResetPasswordMail = async(name, email, token)=>{

    try{
        const transporter =  nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
         });
        const mailOption = {
            from:config.emailUser,
            to:email,
            subject:'For Reset Password',
            html:'<p> hi '+name+', Please click here to <a href="https://prsuleaveease.onrender.com/forget-password?token='+token+'">Reset</a> Your Password.</p>',
        };
            transporter.sendMail(mailOption, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log("email has been sent:-",info.response);
                }
            })
     
     }catch(error){
         console.log(error.message)
     }
}


const loadRegister = async(req, res)=>{
    try{
       const departmentData = await Department.find();
       res.render('registration',{department:departmentData})
    }catch(error){
        console.log(error.message)
    }
}


const loadapplyleave = async(req, res)=>{
    try{
       res.render('applyleave')
    }catch(error){
        console.log(error.message)
    }
}

const insertUser = async(req, res)=>{
    try{  

        const email = req.body.email;
        const existmail = await User.findOne({email: email });
        if (existmail) {
            // alert('This Email Allready exist');
            res.render('login',{message:'This Email Allready exist '});
            

        } else {
            
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            dob:req.body.dob,
            gender:req.body.gender,
            mobile:req.body.mobile,
            address:req.body.address,
            designation:req.body.designation,
            department:req.body.department,
            image:req.file.filename,
            password:spassword,
            eid:"prsu101",
            is_admin:0,
            is_administrator:0,
            is_GAD:0,
            is_ragistrar:0,
            is_vicechancellor:0,
            Department_Admin:0
        });

        const userData = await user.save();
        if(userData){
            
            // sendvarifyMail(req.body.name, req.body.email, userData._id);
            res.render('login',{message:'Your registration has been successflly, Please varify your email'})
        }else{
            res.render('registration',{message:'Your registration has been failed'})
        }
    }

     }catch(error){
         console.log(error.message)
     }
}

const addLeave = async(req, res)=>{
    try{   
        const users = await User.findById({_id:req.session.user_id});
        // get data 
        
        // const currentDate = new Date();
        // const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        // const date = currentDate.toLocaleDateString('en-US', options);

        // for date
        const currentDate = new Date();
        const LeaveBalanceData = await LeaveBal.findOne({ user_id: req.session.user_id });
        const formattedDate = currentDate.toLocaleDateString('en-US');

        console.log(formattedDate)


        const leave = new Leave({
            name:req.body.name,
            designation:req.body.designation,
            eid:req.body.eid,
            d_name:req.body.d_name,
            leave_type:req.body.leave_type,
            start_date:req.body.start_date,
            end_date:req.body.end_date,
            status:"Pending",
            applied_date:formattedDate,
            user_id:req.body.user_id,
            days:req.body.days,
            // image:req.file.filename,
          
           
        });

      
        const userData = await leave.save();
        if(userData){
            res.render('dashboard',{message:'Apply has been successflly.',user:users,LeaveBalanceData:LeaveBalanceData})
        }else{
            res.render('applyleave',{message:'Your request failed'})
        }
       

     }catch(error){
         console.log(error.message)
     }
}





const applyleave = async(req, res)=>{

    try {
        const departmentData = await Department.find();
        const userData = await User.findById({_id:req.session.user_id});
        if(userData){
            
            res.render('applyleave',{user:userData,department:departmentData});
        }else{
            res.redirect('/home');
        }

    } catch (error) {
        console.log(error.message);
    }
}





const createLeaveBalance = async (req, res) => {
    const { earned_leave, casual_leave } = req.body;
    console.log(earned_leave)

    const leaveBalance = new LeaveBalance({
        user_id: req.session.user_id,
        earned_leave: earned_leave,
        casual_leave: casual_leave
    });

    try {
        await leaveBalance.save();
        console.log('Leave balance created successfully');
        res.status(200).json({ message: 'Leave balance created successfully' });
    } catch (error) {
        console.error('Error creating leave balance:', error);
        res.status(500).json({ error: 'Error creating leave balance' });
    }
};


const createLeaveBal = async (req, res) => {
    const { user_id, earned_leave, casual_leave, optional_leave, medical_leave, special_leave, duty_leave } = req.body;

    const leaveBal = new LeaveBal({
        // user_id: req.session.user_id,
        user_id: user_id,
        earned_leave: earned_leave,
        casual_leave: casual_leave,
        optional_leave: optional_leave,
        medical_leave: medical_leave,
        special_leave: special_leave,
        duty_leave: duty_leave
    });

    try {
        await leaveBal.save();
        console.log('Leave balance created successfully');
        res.status(200).json({ message: 'Leave balance created successfully' });
    } catch (error) {
        console.error('Error creating leave balance:', error);
        res.status(500).json({ error: 'Error creating leave balance' });
    }
};






const loadLeaveBalance = async(req, res)=>{
    try{
        // const userData = await User.findById({_id:req.session.user_id});
        const userData = await LeaveBalance.findOne({user_id:req.session.user_id});
        // console.log(userData);
       res.render('loadLeaveBalance')
    }catch(error){
        console.log(error.message)
    }
}

const loadLeaveBal = async(req, res)=>{
    try{
        // const userData = await User.findById({_id:req.session.user_id});
        const userData = await LeaveBal.findOne({user_id:req.session.user_id});

       res.render('loadLeaveBal')
    }catch(error){
        console.log(error.message)
    }
}



// verify user 
const verifymail = async(req, res)=>{
    try{
    const updateInfo = await User.updateOne({_id:req.query.id},{$set:{is_verified:1}})
     console.log(updateInfo);
     res.render("email-verified");
     return;
    
    }catch(error){
         console.log(error.message)
     }
}

const verifyLogin = async (req, res) => {
    try {
        // const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const userData = await User.findOne({ username: username });

        if (userData) {
            const passwordMatch = await bcrypt.compare(password, userData.password);

            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', { message: "Please verify your email." });
                    return;
                } else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                    return;
                }
            } else {
                res.render('login', { message: "Email and password is incorrect." });
                return;
            }
        } else {
            res.render('login', { message: "Incorrect Email" });
            return;
        }
    } catch (error) {
        console.log("Verification error, please verify your email.", error.message);
        res.render('errorPage', { message: "Internal Server Error" });
    }
};


//  login user method started
const loginload = async(req, res)=>{
    try {
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

// home page

const Profile = async(req, res)=>{
    
    try {
        const userData = await User.findById({_id:req.session.user_id});
        // user for home page 
        res.render('profile',{user:userData});
    } catch (error) {
        console.log(error.message);
    }
}

// user logout 
const userlogout = async(req, res)=>{
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

// for forget 
const forgetLoad =  async(req, res)=>{
    try {
        res.render('forget');
    } catch (error) {
        console.log(error.message);
    }
}

const fogetVerify = async(req, res)=>{
    try {
        
        const email = req.body.email;
       const userdata =  await User.findOne({email: email});
       if(userdata){
        if (userdata.is_verified === 0) {
            res.render('forget',{message:"Please verify your email."});
        }else{
         const randomString = randomstring.generate();
         const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
        // sent mail
        sendResetPasswordMail(userdata.name,userdata.email,randomString);
        res.render('forget',{message:"Please check your email to reset your password."});
    }
            
       }
       else{
        res.render('forget',{message:"user email incorrect."});
       }
    } catch (error) {
        console.log(error.message);
    }
}

const NewpasswordVerify = async(req, res)=>{
    try {
        
       const {email,password } = req.body;
       console.log(email,password);

       const userdata =  await User.findOne({email: email});
       if(userdata){
        if (userdata.is_verified === 0) {
            res.render('forget',{message:"Please verify your email."});
        }else{

            const spassword = await securePassword(req.body.password);
            const updatedData = await User.updateOne({email:email},{$set:{password:spassword}})
            console.log(updatedData);
        res.render('forget',{message:"Your password has created."});
    }   
       }
       else{
        res.render('forget',{message:"user email incorrect."});
       }
    } catch (error) {
        console.log(error.message);
    }
}





const fogetPasswordLoad = async(req, res)=>{
    try {
        // get token from sendforgetpasswordemain
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render('forget-password',{user_id:tokenData._id});
        }else{
            res.render('404',{message:"Token in invalid."});
        }

    } catch (error) {
        console.log(error.message);
    }
}

// resetPassword
const resetPassword = async(req, res)=>{
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        const secure_password = await securePassword(password);

        const updateData = await  User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}})
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
}

// for verification sent link
const verificationLoad = async(req, res)=>{
try {
    res.render('verification');

} catch (error) {
    console.log(error.message);
}
}


const sentverificationLink = async(req, res)=>{
try {
    const email = req.body.email;
    const userData = await User.findOne({email: email });
    if(userData){
        sendvarifyMail(userData.name, userData.email, userData._id);
        res.render('verification',{message:"Reset Verification Mail sent Please Check Your Email. "});
    }else{
        res.render('verification',{message:"This email is not exist "});
    }


    

} catch (error) {
    console.log(error.message);
}
}


// user profile edit 

const editLoad = async(req, res)=>{

    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit',{user:userData});
        }else{
            res.redirect('/home');
        }

    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async(req, res)=>{

    try {
  
        if(req.file){
            const userData=  await  User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile, image:req.file.filename}});
        }else{
         const userData=  await  User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile}});
        }
        
        res.redirect('home');
    } catch (error) {
        console.log(error.message);
    }
}

const editapplyleaveLoad = async(req, res)=>{
    try {
        const id = req.query.id;
        const leaveData = await Leave.findById({ _id: id });
        if (leaveData) {
          res.render("edit-applyleave", { leave: leaveData });
        } else {
          res.redirect("/home");
        }
      } catch (error) {
        console.log(error.message);
      }
}




// dashbord
// const loadDashboard = async (req, res) => {
//     try {
//         // const userData = await LeaveBalance.findOne({ user_id: req.session.user_id });

//         // if (!userData) {
//         //     // Handle the case where no user data is found
//         //     return res.render('errorPage', { message: 'User not found' });
//         // }

//         // Render the dashboard with user data
//         res.render('dashboard', {
//             user: userData,
//             // BalanceCount: BalanceCount
//         });
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).render('errorPage', { message: 'Internal Server Error' });
//     }
// };
 

const loadDashboard = async (req, res) => {
    try {
      const userData = await User.findById({ _id: req.session.user_id });
      const LeaveBalanceData = await LeaveBal.findOne({ user_id: req.session.user_id });
      
      console.log(LeaveBalanceData);
      // user for home page
      res.render("dashboard", {
        user: userData,
        LeaveBalanceData:LeaveBalanceData
      
      });
    } catch (error) {
      console.log(error.message);
    }
  };

 



// loadtable
const  loadstatus = async(req, res)=>{
    try {
        // const id =req.query.id;
        const id =req.session.user_id;
        const leaves = await Leave.find({user_id:id});
        res.render('status', {
            title: 'status',
            leaves: leaves,
        });
    } catch (err) { 
        res.json({ message: err.message });
    }
}

// loadhistory
const  loadhistory = async(req, res)=>{
    try {
        const id =req.session.user_id;
        const leaves = await Leave.find({user_id:id});
        res.render('history', {
            title: 'history',
            leaves: leaves,
        });
    } catch (err) { 
        res.json({ message: err.message });
    }
}


// print
const loadprint = async(req, res)=>{
    try {
        const id = req.query.id;
        const leaveData = await Leave.findById({ _id: id });
        const userid = req.session.user_id;
        const LeaveBalancedata = await LeaveBal.findOne({ user_id: userid });
        if (leaveData) {
          res.render("print", { leave: leaveData ,LeaveBalancedata:LeaveBalancedata});
        } else {
          res.redirect("/home");
        }
      } catch (error) {
        console.log(error.message);
      }
}


module.exports ={
    loadRegister,
    insertUser,
    verifymail,
    verifyLogin,
    loginload,
    Profile,
    userlogout,
    forgetLoad,
    fogetVerify,
    NewpasswordVerify,
    fogetPasswordLoad,
    resetPassword,
    verificationLoad,
    sentverificationLink,
    editLoad,
    updateProfile,
    editapplyleaveLoad,
    loadDashboard,
    applyleave,
    addLeave,
    loadapplyleave,
    loadstatus,
    loadhistory,
    loadprint,





    createLeaveBalance,
    createLeaveBal,
    loadLeaveBalance,
    loadLeaveBal
}