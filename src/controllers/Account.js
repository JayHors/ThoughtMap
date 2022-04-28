const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login', { csrfToken: req.csrfToken() });

const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

const changePassword = (req, res) => {
  const username = `${req.session.account.username}`;
  const oldPass = `${req.body.oldpass}`;
  const newPass = `${req.body.newpass}`;
  const newPass2 = `${req.body.newpass2}`;

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'New passwords do not match!' });
  }

  return Account.authenticate(username, oldPass, (error, account1) => {
    if (error || !account1) {
      return res.status(401).json({ error: 'Authentication failed!' });
    }
    Account.updatePassword(username, newPass, (err, account) => {
      try {
        req.session.account = Account.ToAPI(account);
        return res.json({ redirect: '/app' });
      } catch (e) {
        console.log(e);
      }
      return false;
    });
    return false;
  });
};

const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/app' });
  });
};

const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }
  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    return res.json({ redirect: '/app' });
  } catch (e) {
    console.log(e);
    if (e.code === 11000) {
      return res.status(400).json({ error: 'Username already exists. Did you mean to sign in?' });
    }
    return res.status(400).json({ error: 'An error occured.' });
  }
};

const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  changePassword,
};
