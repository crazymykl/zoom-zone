'use strict';

module.exports = {
  name: require('./package').name
  included: function (app) {
    this._super.included(app);
    app.import('vendor/zoom-zone.css');
    app.import('vendor/rematrix.js')
  },
};
