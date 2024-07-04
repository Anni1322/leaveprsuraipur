
const mongoose = require('mongoose');

const leaveBalSchema = mongoose.Schema({
    user_id: {
        type: String,
        required: false,
        // unique: true
    },


    earned_leave: {
        type: Number,
        default: 0,
      },
      casual_leave: {
        type: Number,
        default: 0,
      },
      optional_leave: {
        type: Number,
        default: 0,
      },
      medical_leave: {
        type: Number,
        default: 0,
      },
      special_leave: {
        type: Number,
        default: 0,
      },
      duty_leave: {
        type: Number,
        default: 0,
      },
      date: {
        type: Date,
        default: Date.now,
      },
      
});

module.exports =  mongoose.model('LeaveBal',leaveBalSchema);