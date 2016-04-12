import BaseService from '../base.service'

export default class EventsService extends BaseService {
    constructor($http) {
        'ngInject';
        super();

        this.$http = $http;
    }

    getAll() {
        return this.get();
    }

    getEvent(id) {
        return this.get();
    }

    createEvent(id) {
        return this.post();
    }

    updateEvent(id) {
        return this.put();
    }

    destroyEvent(id) {
        return this.delete();
    }

    getDashboard() {
        return this.get();
    }
}
