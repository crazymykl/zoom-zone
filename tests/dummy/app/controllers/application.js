import Ember from 'ember';

export default Ember.Controller.extend({
  actions: {
    zoomInjected(component) {
      component.send("zoomTo", 1);
    }
  }
});
