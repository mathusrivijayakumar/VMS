const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true},
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], required: true },
});

const User = mongoose.model("User", userSchema);

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Apartment Schema
const apartmentSchema = new mongoose.Schema({
  apartmentId: { type: Number, unique: true },
  name: { type: String, required: true },
});

apartmentSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastApartment = await Apartment.findOne().sort({ apartmentId: -1 });
    this.apartmentId = lastApartment ? lastApartment.apartmentId + 1 : 1001;
  }
  next();
});

const Apartment = mongoose.model("Apartment", apartmentSchema);

// Visitor Schema
const visitorSchema = new mongoose.Schema({
  apartmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Apartment", required: true },
  visitorName: String,
  phoneNumber: String,
  entryDate: Date,
  exitDate: Date,
  uniqueCode: { type: Number, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

visitorSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastVisitor = await Visitor.findOne().sort({ uniqueCode: -1 });
    this.uniqueCode = lastVisitor ? lastVisitor.uniqueCode + 1 : 1001;
  }
  next();
});

const Visitor = mongoose.model("Visitor", visitorSchema);

// Middleware to check token and role
const authenticateToken = (req, res, next) => {
  //const token = req.header("Authorization")?.split(" ")[1];
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).send("Access denied");
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid token");
  }
};

const authorizeRole = (role) => (req, res, next) => {
  if (req.user.role !== role) return res.status(403).send("Access denied");
  next();
};

// Generate password reset token and send email
app.post('/api/request-password-reset', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send('User not found');
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    text: `Your password reset Link  is: http://localhost:3000/reset-password/${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.send('Password reset token sent to email');
  });
});

// Reset password using token
app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.send('Password has been reset');
  } catch (error) {
    res.status(400).send('Invalid token or token expired');
  }
});

// Register User
app.post("/register", async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password || !role) return res.status(400).send("Invalid input");
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ username, email, password: hashedPassword, role });
    await user.save();
    res.status(201).send("User registered");
  } catch (err) {
    console.log(err);
    res.status(400).send("Database error");
  }
});

// Login User
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).send("Invalid input");
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("Invalid credentials");
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");
    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1d" });
    res.send({ token, user: { user_id: user._id, name: user.username , email: user.email , role: user.role} });
  } catch (err) {
    console.log(err);
    res.status(400).send("Database error");
  }
});

// Insert Visitor Info
app.post("/visitors", authenticateToken, authorizeRole("user"), async (req, res) => {
  const { apartmentId, visitorName, phoneNumber, entryDate, exitDate } = req.body;
  if (!apartmentId || !visitorName || !phoneNumber || !entryDate || !exitDate)
    return res.status(400).send("Invalid input");
  try {
    const apartment = await Apartment.findOne({ apartmentId });
    if (!apartment) return res.status(400).send("Apartment not found");

    const visitor = new Visitor({
      apartmentId: apartment._id,
      visitorName,
      phoneNumber,
      entryDate,
      exitDate,
      createdBy: req.user.userId
    });
    await visitor.save();
    res.status(201).send({ uniqueCode: visitor.uniqueCode });
  } catch (error) {
    console.log(error);
    res.status(400).send("Database error");
  }
});

// Get All Visitors
app.get("/visitors", authenticateToken, authorizeRole("admin"), async (req, res) => {
  try {
    const visitors = await Visitor.find().populate("apartmentId");
    res.send(visitors);
  } catch (error) {
    console.log(error);
    res.status(400).send("Database error");
  }
});

// Get Visitors Created by User
app.get("/myvisitors", authenticateToken, authorizeRole("user"), async (req, res) => {
  try {
    const visitors = await Visitor.find({ createdBy: req.user.userId }).populate("apartmentId");
    res.send(visitors);
  } catch (error) {
    console.log(error);
    res.status(400).send("Database error");
  }
});

// Create Apartment
app.post("/apartments", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).send("Invalid input");
  try {
    const apartment = new Apartment({ name });
    await apartment.save();
    res.status(201).send("Apartment created");
  } catch (error) {
    console.log(error);
    res.status(400).send("Database error");
  }
});

// Get All Apartments for any role
app.get("/apartments", authenticateToken, async (req, res) => {
  try {
    const apartments = await Apartment.find().select('apartmentId name -_id');
    res.send(apartments);
  } catch (error) {
    console.log(error);
    res.status(400).send("Database error");
  }
});

// Edit Apartment Name
app.put("/apartments/:apartmentId", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { apartmentId } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).send("Invalid input");
  try {
    const apartment = await Apartment.findOneAndUpdate({ apartmentId }, { name }, { new: true });
    if (!apartment) return res.status(404).send("Apartment not found");
    res.send("Apartment updated");
  } catch (error) {
    console.log(error);
    res.status(400).send("Database error");
  }
});

// Delete Apartment
app.delete("/apartments/:apartmentId", authenticateToken, authorizeRole("admin"), async (req, res) => {
  const { apartmentId } = req.params;
  if (!apartmentId) return res.status(400).send("Invalid input");
  try {
    const apartment = await Apartment.findOneAndDelete({ apartmentId });
    if (!apartment) return res.status(404).send("Apartment not found");
    res.send("Apartment deleted");
  } catch (error) {
    console.log(error);
    res.status(400).send("Database error");
  }
});

// Check token and return user
app.get("/checkToken", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).send("User not found");
    res.json({ user_id: user._id, name: user.username, email: user.email, role: user.role });
  } catch (error) {
    console.log(error);
    res.status(400).send("Database error");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});