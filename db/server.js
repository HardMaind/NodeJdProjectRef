const mongoose = require("mongoose");

// Connecte database with mongodb cluster  using mongoose...
function dbConnection() {
  mongoose
    .connect(process.env.URI, {
      useCreateIndex: true,
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Connected with database");
    })
    .catch((err) => {
      console.log(err);
    });
}
module.exports = { dbConnection };