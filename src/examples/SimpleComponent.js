import { angular2react } from 'angular2react';
import { lazyInjector } from '../../react/lazyInjector';

const SimpleComponent = {
  template: '<h2>Hello from Angular!</h2>' +
    '<p>Hello, {{ $ctrl.user.name }} !</p>' +
    '<button ui-sref="simpleAngularPage({\'id\': 3})" >Angular navigation to Angular Page</button>',
  controller: function() {
    this.user = { name: 'world' };
  },
};


const SimpleComponentReact = angular2react('SimpleComponent', SimpleComponent, lazyInjector.$injector)

export { SimpleComponent, SimpleComponentReact }