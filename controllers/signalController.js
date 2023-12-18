const Signal = require("../models/signal");

const createSignal = async (req, res) => {
  try {
    const newSignal = new Signal({
      user: req.user.userId,
      ...req.body,
    });

    const createdSignal = await newSignal.save();

    res.status(201).json(createdSignal);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error creating Signal" });
  }
};

module.exports = {
  createSignal,
};
