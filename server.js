//IMPORT
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config({
	path: "./config.env",
});

//ROUTE IMPORT
const gigDatesRoutes = require("./routes/gigRoute");
const adminRoute = require("./routes/adminRoutes");
const albumRoutes = require("./routes/albumRoutes");

//MIDDLEWARES
const cors = require("./middlewares/cors");

//PORT CONST
const PORT = process.env.PORT || 8000;

//FUNCTION USED FOR EACH REQUEST
app.use(express.json());
app.use(cors);

//ROUTES INIT
app.use("/gig_dates", gigDatesRoutes);
app.use("/admin", adminRoute);
app.use("/albums", albumRoutes);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
