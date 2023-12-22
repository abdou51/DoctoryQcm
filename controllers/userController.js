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
        message: "L'utilisateur avec l'email donné existe déjà",
      });
    }

    if (userData.email === password) {
      return res.status(400).json({
        success: false,
        message: "Votre email ne peut pas être votre mot de passe",
      });
    }

    user = new User({
      ...userData,
      passwordHash: bcrypt.hashSync(password, 10),
    });

    user = await user.save();

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "L'utilisateur ne peut pas être créé",
      });
    }
    res
      .status(200)
      .json({ success: true, message: "Utilisateur enregistré avec succès" });
  } catch (error) {
    res.status(500).json({ success: false, error: error });
  }
};
const loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email ou mot de passe incorrect",
      });
    }
    if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
      try {
        if (!user.isValidated) {
          return res.status(400).json({
            success: false,
            message: "Votre compte n'est pas encore activé",
          });
        }
        const token = generateToken(user.id, user.isAdmin);
        res.status(200).json({
          message: "Connexion réussie",
          token: token,
        });
      } catch (tokenError) {
        res
          .status(500)
          .send("Une erreur s'est produite lors de la génération du jeton.");
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Email ou mot de passe incorrect",
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
    const userId = req.user.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        email: req.body.email,
        name: req.body.name,
        phoneNumber: req.body.phoneNumber,
        deviceToken: req.body.deviceToken,
      },
      { new: true }
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Utilisateur N'existe Pas" });
    }
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
const getMe = async (req, res) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("-passwordHash");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Utilisateur N'existe Pas" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).send("Une erreur s'est produite .");
    console.log(error);
  }
};
module.exports = {
  registerUser,
  loginUser,
  updateUser,
  getMe,
};
