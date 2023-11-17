const express = require("express");
const bodyParser = require("body-parser");

require("dotenv/config");
const cors = require("cors");

const { default: mongoose } = require("mongoose");
const HttpError = require("./models/http-error");

const usersRoutes = require("./routes/users-routes");
const artistsRoute = require("./routes/artists");
const albumRoute = require("./routes/albums");
const songRoute = require("./routes/songs");
const categoriesRoutes = require("./routes/categories-routes");
const artistsRoutes = require("./routes/artists-routes");
const albumsRoutes = require("./routes/albums-routes");

const app = express();
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: true }));
app.use(express.json());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  return res.json("Chào mừng đến với DotSound ....");
});

// user authentication routes

app.use("/api/users", usersRoutes);

// Artist links

app.use("/api/artists/", artistsRoutes);

// Album links

app.use("/api/albums/", albumsRoutes);

// Songs links

app.use("/api/songs/", songRoute);

app.use("/api/categories/", categoriesRoutes);

// If any depreciation warning add depreciation options
// mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true }, () => {
//   console.log("Mongodb Connected");
// });

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occurred!" });
});

mongoose.set("strictQuery", false);
mongoose.connect(process.env.DB_STRING, { useNewUrlParser: true });
mongoose.connection
  .once("open", () => console.log("Connected"))
  .on("error", (error) => {
    console.log(`Error : ${error}`);
  });

app.listen(4000, () => console.log("Listening to port 4000"));
