'use strict';

module.exports = {
  name: require('./package').name, 
  included: function(app) {
    this.app = this._findHost();
	
    app.import('vendor/zoom-zone.css');
    this._super.included.apply(this, arguments);
  },
  _findHost() {
    let current = this;
    let app;

    // Keep iterating upward until we don't have a grandparent.
    // Has to do this grandparent check because at some point we hit the project.
    do {
       app = current.app || app;
    } while (current.parent.parent && (current = current.parent));
    return app;
  }
};
