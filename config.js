(() => {
  'use strict';

  const config = {

    "devRoot": 'src/',
  	"devTemplates": 'src/templates/',
    "devCss": 'src/css/',
    "devScripts": 'src/scripts/',
    "devImages": 'src/img/{,**/}',
    "public": 'public/',
    "publicCss": 'public/css/',
    "publicScripts": 'public/scripts/',
    "publicImages": 'public/img/',
    "dist": 'dist/',
    "bowerComponents": '/src/js/components/bower/',
    "responsiveImages": {
      "photo": {
        "setwidth": 400,
        "setwidthx2": 600,
        "suffix": '-2x'
      },
      "hero": {
        "setwidth": 1000,
        "setwidthx2": 1800,
        "suffix": '-2x'
      }
    }
  };

  module.exports = config;

})();
