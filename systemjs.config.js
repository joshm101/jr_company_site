(function(global) {
  var map = {
    'rxjs': 'node_modules/rxjs',
    'ng2-file-upload': 'node_modules/ng2-file-upload',
    'angular2-jwt': 'node_modules/angular2-jwt',
    '@angular': 'node_modules/@angular',
    'hammerjs': './client/static/scripts/hammer',
    'aot': 'client/src/ts/main-aot',
    'jit': 'client/src/ts/main-jit'
  };
  
  var packages = {
    'rxjs': { defaultExtension: 'js'},
    'ng2-file-upload': { defaultExtension: 'js' },
    'angular2-jwt': { defaultExtension: 'js'},
    'aot': { defaultExtension: 'js' },
    'jit': { defaultExtension: 'js' },
    '.': { defaultExtension: 'js' }
    };

  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'forms',
    'platform-browser',
    'platform-browser-dynamic',
    'router',
    'material'
  ];

  ngPackageNames.forEach(function(pkgName) {
        packages['@angular/' + pkgName] = { main: 'index.js', defaultExtension: 'js' };
  });

  packages['ng2-file-upload'] = { main: '/bundles/ng2-file-upload.umd.js', defaultExtension: 'js' };
  packages['angular2-jwt'] = { main: 'angular2-jwt.js', defaultExtension: 'js' };

  var config = {
    map: map,
    packages: packages
  };

  System.config(config);
})(this);
