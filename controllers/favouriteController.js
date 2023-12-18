const Favourite = require("../models/favourite");

const createFavourite = async (req, res) => {
  try {
    const newFavourite = new Favourite({
      user: req.user.userId,
      ...req.body,
    });

    const createdFavourite = await newFavourite.save();

    res.status(201).json(createdFavourite);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Favourite" });
  }
};

const removeFavourite = async (req, res) => {
  try {
    const favouriteId = req.params.favouriteId;
    await Favourite.deleteOne({ id: favouriteId });
    res.status(204).json({ message: "Favourite removed" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error removing Favourite" });
  }
};
module.exports = {
  createFavourite,
  removeFavourite,
};
