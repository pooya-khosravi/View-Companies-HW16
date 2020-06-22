const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const companiesSchema = new Schema({
    name:{
        type: String,
        unique: true,
        trim: true,
        required: true,
    },
    shomareSabt:{
        type: Number,
        unique: true,
        required: true
    },
    country:{
        type: String,
        trim: true,
        required: true
    },
    city:{
        type: String,
        trim: true,
        required: true
    },
    created_at:{
        type: Date,
        required: true,
        default: Date.now
    },
    phoneNumber:{
        type: Number,
        required: true
    }
});

module.exports = mongoose.model("companies", companiesSchema);