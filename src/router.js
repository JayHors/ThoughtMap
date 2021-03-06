const controllers = require('./controllers');
const mid = require('./middleware');

function router(app) {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogin, controllers.Account.changePassword);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/app', mid.requiresSecure, mid.requiresLogin, controllers.Thought.appPage);

  app.post('/postThought', mid.requiresSecure, mid.requiresLogin, controllers.Thought.postThought);

  app.get('/getOwnerThoughts', mid.requiresSecure, mid.requiresLogin, controllers.Thought.getOwnerThoughts);

  app.get('/publicThoughts', mid.requiresSecure, mid.requiresLogin, controllers.Thought.getPublicThoughts);

  app.get('/getAds', mid.requiresSecure, mid.requiresLogin, controllers.Thought.getAds);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
}

module.exports = router;
