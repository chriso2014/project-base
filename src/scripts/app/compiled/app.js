'use strict';

/* global $ */
(function () {
  'use strict';

  var testVariable = false;

  var testFunc = function testFunc(testvar) {
    console.log('Hey this test is ' + testvar);
  };

  $('.owl-carousel').owlCarousel({
    items: 1,
    autoplay: true,
    autoplayTimeout: 4000,
    loop: true
  });

  testFunc(testVariable);
})();
//# sourceMappingURL=app.js.map
