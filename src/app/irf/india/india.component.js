import templateUrl from './india.html';
import topBoxTemplate from './step-templates/topBox.html';
import groupTemplate from './step-templates/group.html';
import destinationTemplate from './step-templates/destination.html';
import familyTemplate from './step-templates/family.html';
import signsTemplate from './step-templates/signs.html';
import intercepteesTemplate from './step-templates/interceptees.html';
import finalProceduresTemplate from './step-templates/finalProcedures.html';
import './india.less';

const DateTimeId = 4;
const FamilyId = 82;
const OtherRedFlagId = 31;
const OtherSignId = 134;
const OtherWebsiteId = 244;

export class IrfIndiaController {
    constructor(IndiaService) {
        'ngInject';
        this.IndiaService = IndiaService;

        this.contacts = [
            ['Hotel owner', 'Rickshaw driver', 'Taxi driver'],
            ['Bus driver', 'Church member', 'Other NGO'],
            ['Police', 'Subcomittee member']
        ];
        this.contactValue = '';
        this.otherContactString = '';
        this.otherSign = false;
        this.otherWebsite = false;
        this.familyArray = [
            ['Own brother', 'Own father', 'Own grandparent'],
            ['Own sister', 'Own mother', 'Own aunt/uncle']
        ];
        this.familyValue = '';
        this.otherFamily = '';
        this.otherFamilyString = '';
        this.otherRedFlag = false;
        this.otherWebsite = false;
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

        this.getIndiaIrf();
        this.getLocation();
        this.getStaff();
    }

    formatDate(UfcDate) {
        return moment(UfcDate).toDate();
    }

    getIndiaIrf() {
        this.IndiaService.getIndiaIrf().then(response => {
            this.responses = response.data.responses;
            this.questions = _.keyBy(this.responses, x => x.question_id);
            this.setValuesForOtherInputs();
        });
    }

    getLocation() {
        this.IndiaService.getLocation().then(response => {
            this.location = response.data;
        });
    }

    getQuestionIndexById(id) {
        return _.findIndex(this.responses, x => x.question_id === id);
    }

    getStaff() {
        this.IndiaService.getStaff().then(response => {
            this.staff = response.data;
        });
    }

    setContactRadio() {
        let flattenedContacts = _.flattenDeep(this.contacts);
        const OtherContactId = 92;
        this.contactValue = this.questions[OtherContactId].response.value;
        if (!_.includes(flattenedContacts, this.contactValue) && this.contactValue !== "") {
            this.otherContactString = this.contactValue;
            this.contactValue = 'Other';
        }
    }

    setFamilyRadio() {
        let flattenFamily = _.flattenDeep(this.familyArray);
        this.familyValue = this.questions[FamilyId].response.value;
        if (!_.includes(flattenFamily, this.familyValue) && this.familyValue !== '') {
            this.otherFamilyString = this.familyValue;
            this.familyValue = 'Other';
        }
    }

    setOtherQuestionValues(valueId) {
        let valueSet = this.questions[valueId].response.value;
        this.questions[valueId].response.value = valueSet || '';
        return !!valueSet;
    }

    setValuesForOtherInputs() {
        this.questions[DateTimeId].response.value = this.formatDate(this.questions[DateTimeId].response.value);
        this.otherRedFlag = this.setOtherQuestionValues(OtherRedFlagId);
        this.otherSign = this.setOtherQuestionValues(OtherSignId);
        this.otherWebsite = this.setOtherQuestionValues(OtherWebsiteId);
        this.otherFamily = this.setOtherQuestionValues(FamilyId);
        this.setContactRadio();
        this.setFamilyRadio();
    }
}
export default {
    templateUrl,
    controller: IrfIndiaController
};