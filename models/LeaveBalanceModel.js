
const mongoose = require('mongoose');

const leaveBalanceSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: false,
        // unique: true
    },
    
    earned_leave: {
        type: Number,
        required: true,
        default: 0
    },
    casual_leave: {
        type: Number,
        required: true,
        default: 0
    }    
});

module.exports =  mongoose.model('LeaveBalance',leaveBalanceSchema);