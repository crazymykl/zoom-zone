/* jshint node: true */
'use strict';

module.exports = {
  name: 'zoom-zone',
  included: function (app) {
    this._super.included(app);
    app.import('vendor/zoom-zone.css');
  }
};
