/**
 * Created by Admin on 26.04.2017.
 */
import './logo.html'
import './logo.less'

Template.logo.events({
  'click .logo'() {
    FlowRouter.go('/');
  }
});