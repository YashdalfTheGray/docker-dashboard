const express = require('express');
const morgan = require('morgan');
const path = require('path');
const chalk = require('chalk');

const app = express();

const port = process.env.PORT || process.argv[2] || 3000;

app.use(morgan('dev'));
app.use(express.static('public'));

app.listen(port, () => {
    console.log(`Server started on ${chalk.green(port)}`);
});
