/* jshint node: true */
'use strict';

module.exports = {
  name: 'zoom-zone',
  included: function (app) {
    this._super.included(app);
    app.import('vendor/zoom-zone.css');
    app.import('vendor/rematrix.js')
    app.import('vendor/shims/rematrix.js')
  },
};
