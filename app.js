const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require("./config/routes");

const app = express();
const port = process.env.PORT || 8000;
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost/teamdanger";

mongoose.connect(mongoUri);

app.use(express.static(`${__dirname}/public`));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', router);

app.listen(port, () => console.log(`Running on port: ${port}`));
