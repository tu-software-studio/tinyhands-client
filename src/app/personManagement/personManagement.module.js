import sharedModule from '../shared/shared.module';

import personManagementRouteConfig from './personManagement.route';

import PersonManagementController from './personManagement.controller';
import PersonManagementService from './personManagement.service';
import PersonManagementListController from './list/personManagementList.controller';
import PersonManagementListService from './list/personManagementList.service';
import PersonManagementPendingListController from './pending-list/personManagementPendingList.controller';
import PersonManagementPendingListService from './pending-list/personManagementPendingList.service';
import PersonManagementPendingFaceMatchesListController from './pending-face-matches-list/personManagementPendingFaceMatchesList.controller';
import PersonManagementPendingFaceMatchesListService from './pending-face-matches-list/personManagementPendingFaceMatchesList.service';

export default angular.module('tinyhands.PersonManagement', [sharedModule])
    .config(personManagementRouteConfig)

    .controller('PersonManagementController', PersonManagementController)
    .service('personManagementService', PersonManagementService)
    .controller('PersonManagementListController', PersonManagementListController)
    .service('personManagementListService', PersonManagementListService)
    .controller('PersonManagementPendingListController', PersonManagementPendingListController)
    .service('personManagementPendingListService', PersonManagementPendingListService)
    .controller('PersonManagementPendingFaceMatchesListController', PersonManagementPendingFaceMatchesListController)
    .service('personManagementPendingFaceMatchesListService', PersonManagementPendingFaceMatchesListService).name;
