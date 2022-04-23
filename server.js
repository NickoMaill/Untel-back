//IMPORT
const express = require("express");
const app = express();
const dotenv = require('dotenv');
dotenv.config({
    path:"./config.env"
})

//PORT CONST
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
