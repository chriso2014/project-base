(() => {
  'use strict';

  /**
   *
   * Gulp packages
   */
  const gulp = require('gulp');
  const ngrok = require('ngrok');
  const psi = require('psi');
  const sequence = require('run-sequence');
  var site = '';

  /**
   * Config files
   */
  const config = require('../config');
  const pkg = require('../package');

  gulp.task('ngrok-url', function(cb) {
    return ngrok.connect(3000, function (err, url) {
      site = url;
      console.log('serving your tunnel from: ' + site);
      cb();
    });
  });

  gulp.task('psi-desktop', function (cb) {
    return psi(site, {
        nokey: 'true',
        strategy: 'desktop',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        //console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
        //console.log(JSON.stringify(data));
    });
  });

  gulp.task('psi-mobile', function (cb) {
    return psi(site, {
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        //console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
        //console.log(JSON.stringify(data));
    });
  });

  gulp.task('psi-seq', function (cb) {
    return sequence(
      'ngrok-url',
      'psi-desktop',
      'psi-mobile',
      cb
    );
  });

  gulp.task('psi', ['psi-seq'], function() {
    console.log('Woohoo! Check out your page speed scores!')
    process.exit();
  });

})();
