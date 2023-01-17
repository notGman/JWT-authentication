const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
require("dotenv").config();
require("./db/connection").connectDB();
const User = require("./db/model");

const app = express();
app.use(express.json());
app.use(cookieParser());

const authorization = async (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) {
    res.status(403).send("A token is required");
  }
  try {
    const data = await jwt.verify(token, process.env.TOKEN_KEY);
    return next();
  } catch (error) {
    console.log(error);
  }
};

app.get("/", (req, res) => {
  res.status(200).send("Welcome to JWT Auth");
});

app.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(first_name && last_name && email && password)) {
      res.status(400).send("Enter all the inputs.");
    }

    const oldUser = await User.findOne({ email });
    if (oldUser) {
      res.status(400).send("User already exists. Please Login");
    }

    const encryptedpassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: encryptedpassword,
    });
    const token = jwt.sign({ user_id: newUser._id, email }, process.env.TOKEN_KEY);

    res.cookie("access_token", token, { httpOnly: true }).status(200).json(newUser);
  } catch (error) {
    console.log(error);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      res.status(400).send("Enter all the details");
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      res.status(400).send("Invalid Credentials!");
    }

    if (existingUser != null && (await bcrypt.compare(password, existingUser.password))) {
      const token = jwt.sign({ user_id: existingUser._id, email }, process.env.TOKEN_KEY);
      res.cookie("access_token", token, { httpOnly: true }).status(200).send("Login Successful!");
    }
    res.status(400).send("Invalid Credentials!");
  } catch (error) {
    console.log(error);
  }
});

app.get("/logout", authorization, (req, res) => {
  res.clearCookie("access_token").status(200).send("Logout successful!");
});

app.get('/protected',authorization,(req,res)=>{
  res.status(200).send("Welcome to the protected page!")
})

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Listening to http://localhost:${port}`));
