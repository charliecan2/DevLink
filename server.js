const express = require('express');
const app = express();
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB();

app.get('/', (req, res) => res.send('API running'))

app.listen(PORT, () => {
    console.log(`Listening in on PORT ${PORT}!`)
})