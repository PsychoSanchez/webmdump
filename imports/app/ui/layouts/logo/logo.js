/**
 * Created by Admin on 26.04.2017.
 */
import './logo.html'
import './logo.less'

function routeToRandom() {
  if (FlowRouter.current().path === '/random') {
    FlowRouter.reload();
    return;
  }
  FlowRouter.go('/random');
}

Template.logo.events({
  'click .logo'() {
    routeToRandom();
  },
  'keydown .logo'(e, tpl){
    if (e.keyCode === 32 || e.keyCode === 13) {
      routeToRandom();
    }
  }
});

