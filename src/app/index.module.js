/* global toastr:false, moment:false */
import config from './index.config';

import SharedModule from './shared/shared.module';
import budgetModule from './budget/budget.module';
import borderStationModule from './border-station/borderStation.module'
import VIFModule from './vif/vif.module';
import IRFModule from './irf/irf.module';

import routerConfig from './index.route';

import googleMapsConfig from './components/map/map.config';

import runBlock from './index.run';

// REGION: Services
import Address1Service from './addresses/address1.service';
import Address2Service from './addresses/address2.service';
import SessionService from './utils/session.service';
import TallyService from './components/tally/tally.service';
// ENDREGION: Services

// REGION: Directives
import MapDirective from './components/map/map.directive';
import MathOperator from './components/mathOperator/mathOperator.directive';
import NavbarDirective from './components/navbar/navbar.directive';
import TallyDirective from './components/tally/tally.directive';
// ENDREGION: Directives

// REGION: Controllers
import Address1Controller from './addresses/address1.controller';
import Address1EditModalController from './addresses/address1EditModal.controller';
import Address2Controller from './addresses/address2.controller';
import Address2EditModalController from './addresses/address2EditModal.controller';
import DashboardController from './dashboard/dashboard.controller';
import LoginController from './login/login.controller';
import TallyController from './components/tally/tally.controller';
// ENDREGION: Controllers



angular.module('tinyhandsFrontend', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps', 'ngCsv', 'tinyhands.Shared', 'tinyhands.Budget', 'tinyhands.BorderStation', 'tinyhands.VIF', 'tinyhands.IRF'])
  .constant('toastr', toastr)
  .constant('moment', moment)
  .config(config)

  .config(routerConfig)

  .config(googleMapsConfig) // Pass google maps config

  .run(runBlock)

  // REGION: Services
  .service('address1Service', Address1Service)
  .service('address2Service', Address2Service)
  .service('tallyService', TallyService)
  // ENDREGION: Services

  // REGION: Directives
  .directive('googlemap', () => new MapDirective())
  .directive('navbar', () => new NavbarDirective())
  .directive('operator', () => new MathOperator())
  .directive('tally', () => new TallyDirective())
  // ENDREGION: Directives

  // REGION: Controllers
  .controller('Address1Controller', Address1Controller)
  .controller('Address1EditModalController', Address1EditModalController)
  .controller('Address2Controller', Address2Controller)
  .controller('Address2EditModalController', Address2EditModalController)
  .controller('DashboardController', DashboardController)
  .controller('LoginController', LoginController)
  .controller('TallyController', TallyController)
  // ENDREGION: Controllers
;
