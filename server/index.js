const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const connectMongoDB = require('./connection');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

connectMongoDB(process.env.MONGO_URL).then(() => {
    console.log('database successfully connected');
})
.catch(() => {
    console.log('error connecting the database');
});

app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173',
}));


app.use(require('./routes/shortUrlRoute'));

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});