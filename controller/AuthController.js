const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const User = require("../model/User");

const isProduction = process.env.NODE_ENV === "production";

function isPasswordSame(password1, password2) {
  return password1 === password2;
}

const signup = async (req, res) => {
  try {
    let { email, password, confirm } = req.body;

    if (!email || !password || !confirm) {
      return res.status(400).json({
        message: "All fields are required!",
      });
    }

    email = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists!" });
    }

    if (!isPasswordSame(password, confirm)) {
      return res.status(400).json({ message: "Passwords do not match!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email: email,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.log("Error occurred while registering user:", error);

    // return res.status(500).json({
    //   message: "Something went wrong while registering user.",
    // });
  }
};

const login = async (req, res) => {
  try {
    console.log("🔥 LOGIN ROUTE HIT");
    console.log("Request Body:", req.body);
    let { email, password } = req.body;
    email = email.toLowerCase().trim();
    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      return res.status(404).json({ message: "Invalid credentials!" });
    }
    console.log("Found User: ", foundUser);
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    // Generate Access and Refresh Tokens
    // Generate Payload
    const payload = { userId: foundUser._id, userEmail: foundUser.email };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    foundUser.refreshTokens.push(refreshToken); // Saving the logged in user's refresh token
    await foundUser.save();

    // Storing the refresh token in cookies
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: isProduction, // Secure=true only in production
      sameSite: isProduction ? "none" : "lax", // None for production, Lax for local
      path: "/",
    });

    res
      .status(200)
      .json({ message: "Login successfull!", accessToken: accessToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

function generateAccessToken(payload) {
  try {
    return JWT.sign(payload, process.env.JWT_ACCESS_KEY, { expiresIn: "5m" });
  } catch (error) {
    console.log("Errot occured while generating an access token: ", error);
    return null;
  }
}

function generateRefreshToken(payload) {
  try {
    return JWT.sign(payload, process.env.JWT_REFRESH_KEY);
  } catch (error) {
    console.log("Errot occured while generating a refresh token: ", error);
    return null;
  }
}

const refreshTokenController = async (req, res) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing!" });
  }
  try {
    const foundUser = await User.findOne({ refreshTokens: refreshToken });
    if (!foundUser) {
      return res.status(404).json({ message: "Invalid Refresh Token" });
    }
    JWT.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
      if (err) {
        return res.status(401).json({ message: "Invalid refresh token" });
      }
      const payLoad = { userId: user.userId, userEmail: user.userEmail };
      console.log("A new Access token is being generated!");
      const accessToken = generateAccessToken(payLoad);
      res.status(200).json({ accessToken: accessToken });
    });
  } catch (error) {
    console.log(error);
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(404).json({ message: "Refresh Token is missing" });
    }
    const user = await User.findOne({ refreshTokens: refreshToken });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Removing refresh Tokens from the database
    user.refreshTokens = user.refreshTokens.filter(
      (token) => token != refreshToken,
    );
    await user.save();

    // Removing refresh token from cookies
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProduction, // Secure=true only in production
      sameSite: isProduction ? "none" : "lax", // None for production, Lax for local
      path: "/",
    });
    res.status(200).json({ message: "Logged out successfully!" });
  } catch (error) {
    console.log(error);
  }
};

const me = async (req, res) => {
  console.log("ME ROUTE HIT");
  const userId = req.user.userId;
  try {
    const user = await User.findById(userId).select(
      "-password, -refreshTokens",
    );
    if (!user) return res.status(404).json({ message: "No user found!" });
    res.status(200).json({ user: user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  signup,
  login,
  refreshTokenController,
  logout,
  me,
};
