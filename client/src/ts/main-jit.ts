import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { AppModule } from './app.module';

console.log("JIT COMPILED");
platformBrowserDynamic().bootstrapModule(AppModule);
