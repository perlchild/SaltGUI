const Browser = require('zombie');

var url = "http://localhost:3333/"

describe('login page', function() {

  const browser = new Browser();

  before(function(done) {
      browser.visit(url, function() {
          done();
      });
  });

  it('we should have been redirected to the login page', function() {
      browser.assert.url('http://localhost:3333/login')
  });  

});
