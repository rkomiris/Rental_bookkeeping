// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  defaultLocale : "en",
  
  // API_HOST: 'http://172.16.5.6:8095/rta/sr',
  
  // API_HOST: 'http://172.16.8.55:8281/rta/sr',
  // LOGIN_HOST : "http://172.16.8.55:8181/srm-core-security",

  // API_HOST: 'http://172.16.9.117:8281/rta/sr',
  // LOGIN_HOST : "http://172.16.9.117:8181/srm-core-security",

   API_HOST: 'http://172.16.9.101:8082/rta/sr',
   LOGIN_HOST : "http://172.16.9.101:8081/srm-core-security",

  // API_HOST: ' http://172.16.8.55:8281/rta/sr',
  // LOGIN_HOST: 'http://172.16.8.55:8181/srm-core-security',

  API_LANG_URL: "/assets/api/langs"
  


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
