/* global $ */
(() => {
  'use strict';
  const testVariable = false;

  const testFunc = (testvar) => {
    console.log(`Hey this test is ${testvar}`);
  };

  $('.owl-carousel').owlCarousel({
    items: 1,
    autoplay: true,
    autoplayTimeout: 4000,
    loop: true
  });

  testFunc(testVariable);
})();
