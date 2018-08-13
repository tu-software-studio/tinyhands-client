import MessageConstants from './constants.js';
import templateUrl from './malawi.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import './malawi.less';
import IntercepteeModalController from './step-templates/interceptees/intercepteeModal.controller';
import intercepteeModalTemplate from './step-templates/interceptees/intercepteeModal.html';
/* global _ */
/* global moment */

const DateTimeId = 4;
const IrfNumberId = 1;
const OtherFamilyId = 82;
const OtherContactId = 92;
const SignedId = 151;

export class IrfMalawiController {
    constructor($scope, $uibModal, constants, IrfService, $stateParams, $state) {
        'ngInject';
        this.$scope = $scope;
        this.$uibModal = $uibModal;
        this.constants = constants;
        this.service = IrfService;
        this.stateParams = $stateParams;
        this.state = $state;
        this.isViewing = this.stateParams.isViewing === 'true';
        this.stationId = this.stateParams.stationId;

        this.contacts = [
            ['Immigration', 'Police'],
            ['Airline Official']
        ];
        this.family = [
            ['Own brother', 'Own father', 'Own grandparent'],
            ['Own sister', 'Own mother', 'Own aunt/uncle']
        ];
        this.response = {status:'in-progress'};
        this.ignoreWarnings = false;
        this.messagesEnabled = false;
        this.radioButtonOtherData = {};
        this.redFlagTotal = 0;
        this.selectedStep = 0;
        this.stepTemplates = [
            topBoxTemplate,
            groupTemplate,
            destinationTemplate,
            familyTemplate,
            signsTemplate,
            intercepteesTemplate,
            finalProceduresTemplate
        ];
        this.errorMessages = [];
        this.warningMessages = [];

        this.getErrorData();
        this.getMalawiIrf(this.stateParams.countryId, this.stateParams.stationId, this.stateParams.id);
        this.setupFlagListener();
        this.watchMessages();
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getErrorData() {
        this.errorMessageIrfNumber = MessageConstants.Errors.IrfNumber;
        this.errorMessageInterceptee = MessageConstants.Errors.Interceptee;
        this.warningMessageRedFlags = MessageConstants.Warnings.RedFlags;
        this.warningMessageNoSignature = MessageConstants.Warnings.NoSignature;
    }

    getErrorMessages() {
        let activeErrors = [];
        if (this.messagesEnabled) {
            if (this.questions[IrfNumberId].response.value === '') {
                //activeErrors.push(this.errorMessageIrfNumber);
            }
            if (_.size(this.cards) === 0) {
                //activeErrors.push(this.errorMessageInterceptee);
            }
        }
        activeErrors = activeErrors.concat(this.errorMessages);
        return activeErrors;
    }

    getMalawiIrf(countryId, stationId, id) {
        this.service.getIrf(countryId, stationId, id).then((response) => {
        	this.response = response.data;
            this.cards = response.data.cards[0].instances;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, (x) => x.question_id);
            if (this.questions[4].response.value === null) {
            	this.questions[4].response.value = new Date();
            }
            this.setValuesForOtherInputs();
        });
    }

    getIntercepteeImage(url) {
        return new URL(url, this.constants.BaseUrl).href;
    }

    getResponseOfQuestionById(responses, questionId) {
        return _.find(responses, (x) => x.question_id === questionId).response;
    }

    getWarningMessages() {
        let activeWarnings = [];
        if (!this.ignoreWarnings && this.messagesEnabled) {
            if (!this.questions[SignedId].response.value) {
                //activeWarnings.push(this.warningMessageNoSignature);
            }
            if (this.redFlagTotal === 0) {
                //activeWarnings.push(this.warningMessageRedFlags);
            }
        }
        activeWarnings = activeWarnings.concat(this.warningMessages);
        return activeWarnings;
    }

    incrementRedFlags(numberOfFlagsToAdd) {
        this.redFlagTotal += numberOfFlagsToAdd;
    }

    openIntercepteeModal(responses = [], isAdd = false, idx=null) {
    	this.modalActions = [];
        if (isAdd) {
            responses.push({
                question_id: 7,
                response: {}
            });
            responses.push({
                question_id: 8,
                response: {}
            });
            responses.push({
                question_id: 9,
                response: {
                    gender: {},
                    name: {},
                    birthdate: {},
                    address1: {
                    	id: null,
                    	name: ""
                    },
                    address2: {
                    	id: null,
                    	name: ""
                    },
                    phone: {},
                    nationality: {},
                    passport: {},
                }
            });
            responses.push({
                question_id: 11,
                response: {}
            });
        }
        this.$uibModal.open({
            bindToController: true,
            controller: IntercepteeModalController,
            controllerAs: 'IntercepteeModalController',
            resolve: {
                isAdd: () => isAdd,
                questions: () => _.keyBy(responses, (x) => x.question_id),
                isViewing: () => this.isViewing,
                modalActions: () => this.modalActions
            },
            size: 'lg',
            templateUrl: intercepteeModalTemplate,
        }).result.then(() => {
            if (isAdd) {
                this.cards.push({
                    responses
                });
            } else if (this.modalActions.indexOf('removeCard') > -1 && idx !== null) {
            	this.cards.splice(idx, 1);
            }
        });
    }

    save() {
    	this.response.status = 'in-progress';
    	this.getValuesForOtherInputs();
    	this.questions[144].response.value = this.redFlagTotal;
    	this.errorMessages = [];
        this.warningMessages = [];
        this.messagesEnabled = false;
    	this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
   		 this.response = response.data;
            this.cards = response.data.cards[0].instances;
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
            if (this.stateParams.id === null) {
           	 this.stateParams.id = response.data.id;
            }
            this.state.go('irfNewList');
        }, (error) => {
       	 this.errorMessages = error.data.errors;
            this.warningMessages = error.data.warnings;
           });
    	 this.messagesEnabled = false;
    }

    setRadioOther(items, valueId) {
    	if  (!(valueId in this.radioButtonOtherData)) {
    		this.radioButtonOtherData[valueId] = {};
    	}
        let flattenedItems = _.flattenDeep(items);
        let value = this.questions[valueId].response.value;
        if (!_.includes(flattenedItems, value) && value !== '') {
        	this.radioButtonOtherData[valueId].value = 'Other';
        	this.radioButtonOtherData[valueId].otherValue = value;
        } else {
        	this.radioButtonOtherData[valueId].value = value;
        	this.radioButtonOtherData[valueId].otherValue = '';
        }
    }
    
    getRadioOther(valueId) {
    	let value = this.radioButtonOtherData[valueId].value;
    	if (value === 'Other') {
    		this.questions[valueId].response.value = this.radioButtonOtherData[valueId].otherValue;
    	} else {
    		this.questions[valueId].response.value =  value;
    	}
    }

    setupFlagListener() {
        this.$scope.$on('flagTotalCheck', (event, flagData) => {
            this.incrementRedFlags(flagData.numberOfFlagsToAdd);
        });
    }
    
    isString(val) {
    	return typeof val === 'string';
    }
    getScannedFormUrl(url_segment) {
    	var newUrl = new URL(url_segment, this.constants.BaseUrl).href;
        return newUrl;
    }

    setValuesForOtherInputs() {
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        //this.otherContactString = this.setRadioOther(this.contacts, OtherContactId);
        //this.otherFamilyString = this.setRadioOther(this.family, OtherFamilyId);
        this.setRadioOther(this.contacts, OtherContactId);
        this.setRadioOther(this.family, OtherFamilyId);
    }
    
    getValuesForOtherInputs() {
    	//this.questions[OtherContactId].response.value = this.getRadioOther(OtherContactId, this.otherContactString);
    	//this.questions[OtherFamilyId].response.value = this.getRadioOther(OtherFamilyId, this.otherFamilyString);
    	this.getRadioOther(OtherContactId);
    	this.getRadioOther(OtherFamilyId);
    }

    showIgnoreWarningsCheckbox() {
        return (this.messagesEnabled && this.getWarningMessages().length > 0) || this.ignoreWarnings;
    }

    submit() {
    	this.saved_status = this.response.status;
    	this.getValuesForOtherInputs();
    	this.questions[144].response.value = this.redFlagTotal;
    	this.errorMessages = [];
        this.warningMessages = [];
    	this.response.status = 'approved';
    	if (this.ignoreWarnings) {
    		this.response.ignore_warnings = 'True';
    	} else {
    		this.response.ignore_warnings = 'False';
    	}
    	this.service.submitIrf(this.stateParams.stationId, this.stateParams.id, this.response).then((response) => {
    		 this.response = response.data;
             this.cards = response.data.cards[0].instances;
             this.responses = response.data.responses;
             this.questions = _.keyBy(this.responses, x => x.question_id);
             this.setValuesForOtherInputs();
             if (this.stateParams.id === null) {
            	 this.stateParams.id = response.data.id;
             }
             this.state.go('irfNewList');
         }, (error) => {
        	 this.errorMessages = error.data.errors;
             this.warningMessages = error.data.warnings;
             this.response.status = this.saved_status;
            });
    	
        this.messagesEnabled = true;
        //this.getErrorMessages();
        //this.getWarningMessages();
    }

    watchMessages() {
        this.$scope.$watch(() => this.cards, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.getErrorMessages();
            }
        });
        this.$scope.$watch(() => this.redFlagTotal, (newValue, oldValue) => {
            if (newValue !== oldValue) {
                this.getWarningMessages();
            }
        });
    }
}

export default {
    templateUrl,
    controller: IrfMalawiController
};
