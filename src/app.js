const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require('bcrypt');


// use middleware express.json to convert json to javascript for all routes
app.use(express.json());

// signup api
app.post("/signup", async (req, res) => {
  const {firstName,lastName,emailId,password,age,gender} = req.body;

  try {
    validateSignUpData(req);

    const passwordHash = await bcrypt.hash(password,10);
    const user = new User({
      firstName,
      lastName,
      emailId,
      password : passwordHash,
      age,
      gender });

    await user.save();
    res.status(200).send("User Added Successfully.");
  } catch (err) {
    res.status(400).send("Error User not added. " + err.message);
  }
});

//login api

app.post("/login", async(req, res) => {
  const { emailId, password } = req.body;

  try {
    const user = await User.findOne({emailId : emailId});

    if(!user) {
      throw new Error("Invalid Credentials");
    }else{
      const isPassValid = await bcrypt.compare(password, user.password);
      if(!isPassValid) {
        throw new Error("Invalid Credentials");
      }else{
        res.status(200).send("Login Successfully !");
      }
    }
  } catch(err) {
    res.status(400).send("Error" + err);
  }
});

//all get api
app.get("/getall", async (req, res) => {
  try {
    const user = await User.find({});
    console.log(user);
    res.status(200).send(user);
  } catch {
    res.send("something went wrong");
  }
});

// get user by email
app.get("/getbymail", async (req, res) => {
  const useremailId = req.body.emailId;

  try {
    const user = await User.find({ emailId: useremailId });
    if (user.length === 0) {
      res.status(404).send("User not found !!!");
    } else {
      res.status(200).send(user);
    }
  } catch (err) {
    res.status(400).send("Something Went Wrong" + err);
  }
});

// patch user by userID

app.patch("/patchuser/:_id", async (req, res) => {
  const userId = req.params?._id;
  const data = req.body;

  try {
    const ALLOWED_UPDATE = ["photoUrl", "about", "skills", "age"];
    isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATE.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update is not Allowed");
    }
    if (data?.skills?.length > 10) {
      throw new Error("Skills should be less than 10");
    }
    const user = await User.findByIdAndUpdate(userId, data, {
      runValidators: true,
    });
    console.log(user);
    res.status(200).send("User Data Updated Successfully !");
  } catch (err) {
    res.status(400).send("User data not updated " + err);
  }
});

//delete by id
app.delete("/deleteuser/:_id", async (req, res) => {
  const userid = req.params?._id;

  try {
    await User.findByIdAndDelete(userid);
    res.status(200).send("User Data Deleted Successfully.");
  } catch {
    res.status(400).send("Something went wrong");
  }
});

// connect to DB
connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Server is running on 3000 Port");
    });
  })
  .catch((err) => {
    console.error(err);
  });
