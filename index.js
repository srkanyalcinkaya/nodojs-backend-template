const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

const port = process.env.PORT || 3000;
connectDB();

//rest object
const app = express();

//middlewares
app.use(cors({
    origin: "*",
    optionsSuccessStatus: 200,
    credentials: true
}));
app.set('trust proxy', true)
app.use(express.json())


app.get("/", (req, res) => {
    res.send(`Server is runing in ${process.env.DEV_MODE} Mode on port ${process.env.PORT}`);
});

app.use('/api/v1/auth', require("./routes/auth.routes"));

//listen port
const server = app.listen(port, () => {
    console.log(`Server is runing in ${process.env.DEV_MODE} Mode on port ${process.env.PORT}`.bgCyan.white)
})


module.exports = app;