const mongoose = require("mongoose");
const dbUrl = "mongodb+srv://user1:user1701@cluster0.0ypw5er.mongodb.net/contactinfo?retryWrites=true&w=majority";

const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(dbUrl, connectionParams)
.then(() =>{
  console.info("connected to the db");
})
.catch((e) =>{
  console.log("Error:", e);
})
