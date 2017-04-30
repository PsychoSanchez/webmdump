/**
 * Created by Admin on 30.04.2017.
 */
import './login.html'
import './login.less'

Meteor.loginWithVk = function(options, callback) {
  // support a callback without options
  if (! callback && typeof options === "function") {
    callback = options;
    options = null;
  }

  let credentialRequestCompleteCallback = Accounts.oauth.credentialRequestCompleteHandler(callback);
  VK.requestCredential(options, credentialRequestCompleteCallback);
};