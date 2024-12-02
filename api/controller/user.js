const express = require("express");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const router = express.Router();
const User = require("../model/User");
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send({ msg: "User Not Found" });
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      return res.status(400).send({ msg: "Password not match" });
    console.log(user);
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      "shhhhh",
      { expiresIn: "1h" }
    );
    return res.send({
      data: { token },
      msg: "Fetch  user",
    });
  } catch (error) {
    res.status(400).send({ msg: "Internal Server Error" });
  }
});
router.post("/register", async (req, res) => {
  try {
    // Destructuring the fields from the request body
    const { name, email, password } = req.body;

    // Validate the incoming data
    if (!name || !email || !password) {
      return res.status(400).send({ msg: "Name, email, and password are required." });
    }

    // Check if the email already exists in the database
    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).send({ msg: "Email already taken." });

    // Hash the password before saving the user
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    // Create a new user object
    const user = new User({ name, email, password: hash, username:email });

    // Save the user in the database
    await user.save();

    // Generate a JWT token for the new user
    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      "shhhhh", // You should store this secret in environment variables
      { expiresIn: "1h" }
    );

    // Send the token in the response
    return res.status(200).send({
      data: { token },
      msg: "User created successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).send({ msg: "Internal Server Error" }); // Changed to 500 for server errors
  }
});

module.exports = router;
