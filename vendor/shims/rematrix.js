(function() {
  function vendorModule() {
    'use strict';

    return { 'default': self['Rematrix'] };
  }

  define('rematrix', [], vendorModule);
})();
