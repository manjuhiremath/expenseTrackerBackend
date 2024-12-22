
import { Users } from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

function generateToken(id) {
  return jwt.sign({ UserId: id }, process.env.jwt)
}

export const createUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user with hashed password
    const newUser = await Users.create({ name, email, password: hashedPassword });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        isPremium:false,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Users.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "User not authorized" });
    }

    res.status(200).json({ message: "User login successful", UserId: user.id, isPremium: user.isPremium, token: generateToken(user.id) });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error during login", error: error.message });
  }
};


export const getUsers = async (req, res) => {
  try {
    // console.log(req.user.id)
    const user = await Users.findOne({ where: { id: req.user.id } });
    // console.log(user)/
    if (user && user.isPremium) {
      const users = await Users.findAll();
      res.status(200).json(users);
    }else{
      res.status(200).json({});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
};

