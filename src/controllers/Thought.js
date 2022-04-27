const models = require('../models');
const ThoughtModel = require('../models/Thought');

const { Thought } = models;

const appPage = (req, res) => res.render('app', { csrfToken: req.csrfToken });

const postThought = async (req, res) => {
  if (!req.body.lat || !req.body.lng || !req.body.postContent) {
    return res.status(400).json({ error: 'Missing required parameters. ' });
  }
  const thoughtData = {
    latitude: req.body.lat,
    longitude: req.body.lng,
    pubBool: req.body.pubBool,
    text: req.body.postContent,
    username: req.session.account.username,
    ownerId: req.session.account._id,
  };
  try {
    const newThought = new Thought(thoughtData);
    await newThought.save();
    return res.status(201).json({
      latitude: newThought.latitude,
      longitude: newThought.longitude,
      pubBool: newThought.pubBool,
      text: newThought.text,
      username: newThought.username,
      createdDate: newThought.createdDate,
    });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      return res.status(400).json({ error: 'Thought already exists. ' });
    }
    return res.status(400).json({ error: 'An error occured.' });
  }
};

const getOwnerThoughts = (req, res) => {
  ThoughtModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred!' });
    }

    return res.json({ thoughts: docs });
  });
};

const getPublicThoughts = (req, res) => ThoughtModel.findAllPublic((err, docs) => {
  if (err) {
    console.log(err);
    return res.status(400).json({ error: 'An error occurred!' });
  }

  return res.json({ thoughts: docs });
});

module.exports = {
  appPage,
  postThought,
  getOwnerThoughts,
  getPublicThoughts,
};
