const fs = require('fs');
const path = require('path');
module.exports = (req, res) => {
    res.status(200).send("Hello from a standalone serverless function!");
};