const monoogse = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

const connectDB = async() => {
    try {
        await monoogse.connect(db, { 
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false
        })
        console.log('MongoDB connected!')
    } catch(err){
        console.error(err)
        process.exit(1)
    }
}

module.exports = connectDB;