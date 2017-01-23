/*System.config({
  // use typescript for compilation
  transpiler: 'typescript',
  typescriptOptions: {
    emitDecoratorMetadata: true
  },
  map: {
    'app': './bundle',

    '@angular/core': 'node_modules/core/bundles/core.umd.js',
    '@angular/common': 'npm:@angular/common/bundles/common.umd.js'
  }
});*/

(function(global) {
  var map = {
    'rxjs': 'node_modules/rxjs',
    'ng2-file-upload': 'node_modules/ng2-file-upload',
    '@angular': 'node_modules/@angular',
    'app': 'src/ts',
    'hammerjs': './src/ts'
  };

  var packages = {
    'rxjs': { defaultExtension: 'js'},
    'app': { main: 'main.js', defaultExtension: 'js'},
    '@angular': { defaultExtension: 'js' },
    'ng2-file-upload': { defaultExtension: 'js' }
  };

  var ngPackageNames = [
    'common',
    'compiler',
    'core',
    'http',
    'forms',
    'platform-browser',
    'platform-browser-dynamic',
    'router'
  ];

  ngPackageNames.forEach(function(pkgName) {
    packages['@angular/' +pkgName] = { main: '/bundles/' + pkgName + '.umd.js', defaultExtension: 'js' };
  });

  packages['@angular/material'] = { main: '/bundles/material.umd.js', defaultExtension: 'js' };
  packages['ng2-file-upload'] = { main: '/bundles/ng2-file-upload.umd.js', defaultExtension: 'js' };

  var config = {
    map: map,
    packages: packages
  };

  System.config(config);
})(this);
