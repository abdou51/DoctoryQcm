const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateToken = require("../middlewares/jwtMiddleware");

const registerUser = async (req, res) => {
  try {
    let { password, ...userData } = req.body;

    let user = await User.findOne({
      email: userData.email,
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User with given email already exists",
      });
    }

    if (userData.email === password) {
      return res.status(400).json({
        success: false,
        message: "Your email cannot be your password",
      });
    }

    user = new User({
      ...userData,
      passwordHash: bcrypt.hashSync(password, 10),
    });

    user = await user.save();

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "The user cannot be created" });
    }
    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Utilisateur N'existe Pas" });
    }
    if (!user.isValidated) {
      return res.status(400).json({
        success: false,
        message: "Votre compte n'est pas encore activé",
      });
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      try {
        const token = generateToken(user.id, user.isAdmin);
        res.status(200).json({
          message: "Login successful",
          token: token,
        });
      } catch (tokenError) {
        res.status(500).send("An error occurred while generating the token.");
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Nom d'utilisateur ou mot de passe incorrect",
      });
    }
  } catch (error) {
    res
      .status(500)
      .send("Une erreur s'est produite lors de la recherche de l'utilisateur.");
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Utilisateur N'existe Pas" });
    }

    await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Utilisateur mis à jour avec succès",
    });
  } catch (error) {
    res
      .status(500)
      .send(
        "Une erreur s'est produite lors de la mise à jour de l'utilisateur."
      );
    console.log(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateUser,
};
