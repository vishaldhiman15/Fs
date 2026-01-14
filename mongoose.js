
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();


const app = express();
app.use(express.json()); // parse JSON body


mongoose
  .connect("mongodb://127.0.0.1:27017/crudDB")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    age: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      default: "User"
    }
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const User = mongoose.model("User", userSchema);


/* -------- CREATE -------- */
// POST /users
app.post("/users", async (req, res) => {
  try {
    const user = await User.create(req.body); // create document
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* -------- READ ALL -------- */
// GET /users
app.get("/users", async (req, res) => {
  const users = await User.find(); // get all documents
  res.json(users);
});

/* -------- READ ONE -------- */
// GET /users/:id
app.get("/users/:id", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

/* -------- UPDATE -------- */
// PUT /users/:id
app.put("/users/:id", async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true } // return updated document
  );

  res.json(updatedUser);
});

/* -------- DELETE -------- */
// DELETE /users/:id
app.delete("/users/:id", async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ message: "User deleted successfully" });
});


const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
