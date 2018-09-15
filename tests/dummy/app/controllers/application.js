import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    zoomInjected(component) {
      component.send("zoomTo", 1);
    }
  }
});
