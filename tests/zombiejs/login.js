const Browser = require('zombie');

var url = "http://localhost:3333/"

describe('login page', function() {

  const browser = new Browser();

  before(function(done) {
      browser.visit(url, function() {
          done();
      });
  });

  describe('redirects correctly', function() {

    it('we should have been redirected to the login page', function() {
        browser.assert.url('http://localhost:3333/login')
    });

  });

  describe('submits loginform', function() {

    before(function(done) {
      browser
        .fill('username', 'salt')
        .fill('password', 'salt')
        .pressButton('Login', function() {
          done();
      });
    });

    it('we should be logged in now', function() {
      browser.assert.success();
    });

    it('and the Saltgui H1 tag is there', function() {
      browser.assert.text('header h1', 'SaltGUI');
    });

    it('and a logout buttonis shown', function() {
      browser.assert.element('header #button_logout');
    });

  });

});
