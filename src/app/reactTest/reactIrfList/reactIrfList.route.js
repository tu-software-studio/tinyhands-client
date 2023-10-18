function ReactTestRouteConfig($stateProvider) {
    'ngInject';
    $stateProvider
        .state('reactIrfList', {
            url: '/reactIrfList',
            // CHANGE! Use the name of the component defined in reactTest.module.js
            // instead of controller, controllerAs, templateUrl
            // In AngularJS 1.5+ that's where templates are imported, controllers are imported.
            component: 'reactIrfList'
        });
}

export default ReactTestRouteConfig;

