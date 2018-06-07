import {
    IrfIndiaController
}
from "./india.component";

const DateId = 4;
const IrfNumberId = 1;
const OtherFamilyId = 82;
const OtherContactId = 92;
const OtherRedFlagId = 31;
const OtherSignId = 134;
const OtherWebsiteId = 244;
const SignedId = 151;

describe('IrfIndiaController', () => {
    let vm;
    beforeEach(() => {
        let $scope = {
            $watch() {}
        };
        let $uibModal = {
            open: () => ({
                result: {
                    then: f => f()
                }
            })
        };
        let IndiaService = {
            getErrorMessages: () => ({
                then: () => {}
            }),
            getIndiaIrf: () => ({
                then: () => {}
            }),
            getLocation: () => ({
                then: () => {}
            }),
            getStaff: () => ({
                then: () => {}
            })
        };
        vm = new IrfIndiaController($scope, $uibModal, {}, IndiaService);
    });

    describe('function openIntercepteeModal', () => {
        beforeEach(() => {
            vm.cards = [];
        });

        it('should call $uibModal open with appropriate options', () => {
            spyOn(vm.$uibModal, 'open').and.callThrough();

            vm.openIntercepteeModal([], true);

            expect(vm.$uibModal.open).toHaveBeenCalledWith({
                bindToController: true,
                controller: jasmine.any(Function),
                controllerAs: 'IntercepteeModalController',
                resolve: {
                    isAdd: jasmine.any(Function),
                    questions: jasmine.any(Function)
                },
                size: 'lg',
                templateUrl: jasmine.any(String)
            });
        });

        it('when isAdd is true should add responses to list of cards in then', () => {
            vm.openIntercepteeModal([], true);

            expect(vm.cards.length).toEqual(1);
            expect(vm.cards[0]).toEqual({
                responses: [{
                    question_id: 7,
                    response: {}
                }, {
                    question_id: 8,
                    response: {}
                }, {
                    question_id: 9,
                    response: {
                        gender: {},
                        name: {},
                        age: {},
                        address1: {},
                        address2: {},
                        phone: {},
                        nationality: {},
                    }
                }]
            });
        });
    });

    describe('function save', () => {
        it('should set messagesEnabled to true and call setErrorMessage and setWarningMessage', () => {
            vm.messagesEnabled = false;
            spyOn(vm, 'setErrorMessage');
            spyOn(vm, 'setWarningMessage');

            vm.save();

            expect(vm.messagesEnabled).toEqual(true);
            expect(vm.setErrorMessage).toHaveBeenCalled();
            expect(vm.setWarningMessage).toHaveBeenCalled();
        });
    });

    describe('function setErrorMessage', () => {
        beforeEach(() => {
            vm.messagesEnabled = true;
            vm.questions = {

                [IrfNumberId]: {
                    question_id: IrfNumberId,
                    response: {
                        value: 'MBZ950'
                    }
                },
            };
            vm.errorMessage = [
                'Must have a valid border station code in order to submit this form.',
                'At least one interceptee must be recorded in order to submit this form.'
            ];
        });

        it('When messagesEnabled is false, return an empty array of errors', () => {
            vm.messagesEnabled = false;

            let empty = vm.setErrorMessage();

            expect(empty).toEqual([]);
        });

        it('when messagesEnabled is true, if response value of Irf number is null, should push invalid border station error message to returned array', () => {
            vm.questions[IrfNumberId].response.value = '';

            let errors = vm.setErrorMessage();

            expect(errors[0]).toEqual("Must have a valid border station code in order to submit this form.");
        });

        it('when messagesEnabled is true, and size of cards array is 0, push interceptee error message on returned array', () => {
            vm.cards = [];

            let errors = vm.setErrorMessage();

            expect(errors[0]).toEqual('At least one interceptee must be recorded in order to submit this form.');
        });

        it('when messagesEnabled is true, response value of Irf Number is null, and size of cards array is 0, push invalid border station and interceptee error message on returned array', () => {
            vm.questions[IrfNumberId].response.value = '';
            vm.cards = [];

            let errors = vm.setErrorMessage();

            expect(errors[0]).toEqual('Must have a valid border station code in order to submit this form.');
            expect(errors[1]).toEqual('At least one interceptee must be recorded in order to submit this form.');
        });
    });

    describe('function setValuesForOtherInputs', () => {
        beforeEach(() => {
            vm.questions = {
                [DateId]: {
                    question_id: [DateId],
                    response: {
                        value: ''
                    }
                },
                [OtherContactId]: {
                    question_id: OtherContactId,
                    response: {
                        value: false
                    }
                },
                [OtherFamilyId]: {
                    question_id: OtherFamilyId,
                    response: {
                        value: ''
                    }
                },
                [OtherRedFlagId]: {
                    question_id: OtherRedFlagId,
                    response: {
                        value: false
                    }
                },
                [OtherSignId]: {
                    question_id: OtherSignId,
                    response: {
                        value: false
                    }
                },
                [OtherWebsiteId]: {
                    question_id: OtherWebsiteId,
                    response: {
                        value: false
                    }
                },
            };
        });

        it('should set other flags', () => {
            vm.setValuesForOtherInputs();

            expect(vm.otherRedFlag).toEqual(false);
            expect(vm.otherWebsite).toEqual(false);
            expect(vm.otherSign).toEqual(false);
        });
    });

    describe('function setOtherQuestionValues', () => {
        beforeEach(() => {
            vm.questions = {

                [OtherRedFlagId]: {
                    question_id: OtherRedFlagId,
                    response: {
                        value: false
                    }
                },
            };
        });

        it('when response value is false should return false and set response value to empty string', () => {
            let temp = vm.setOtherQuestionValues(OtherRedFlagId);

            expect(temp).toEqual(false);
            expect(vm.questions[OtherRedFlagId].response.value).toEqual('');
        });

        it('when response value is a string, should return true, leave response value as a string', () => {
            vm.questions[OtherRedFlagId].response.value = 'hello there I am a red flag';

            let temp = vm.setOtherQuestionValues(OtherRedFlagId);

            expect(temp).toEqual(true);
            expect(vm.questions[OtherRedFlagId].response.value).toEqual('hello there I am a red flag');
        });

    });

    describe('function setRadio', () => {
        beforeEach(() => {
            vm.questions = {
                [OtherContactId]: {
                    question_id: OtherContactId,
                    response: {
                        value: ''
                    }
                }
            };
        });

        it('when response value matches an item in values, return nothing', () => {
            vm.questions[OtherContactId].response.value = 'Police';

            let temp = vm.setRadio(vm.contacts, OtherContactId);

            expect(temp).toBeUndefined();
            expect(vm.questions[OtherContactId].response.value).toEqual('Police');
        });

        it('when response value is null leave it as it is, return nothing', () => {
            let temp = vm.setRadio(vm.contacts, OtherContactId);

            expect(temp).toBeUndefined();
            expect(vm.questions[OtherContactId].response.value).toEqual('');
        });

        it('when response value does not match one of items, change response value to Other return response value', () => {
            vm.questions[OtherContactId].response.value = 'I am another contact';

            let temp = vm.setRadio(vm.contacts, OtherContactId);

            expect(temp).toEqual('I am another contact');
            expect(vm.questions[OtherContactId].response.value).toEqual('Other');
        });
    });

    describe('function setWarningMessage', () => {
        beforeEach(() => {
            vm.messagesEnabled = true;
            vm.ignoreWarnings = false;
            vm.questions = {

                [SignedId]: {
                    question_id: SignedId,
                    response: {
                        value: 'MBZ950'
                    }
                },
            };
            vm.warningMessage = [
                'No red flags are checked. Are you sure you want to submit this form?',
                'Paper form should be signed, though this is not required. Are you sure you want to submit this form?'
            ];
        });

        it('When messagesEnabled is false, return an empty array of warnings', () => {
            vm.messagesEnabled = false;

            let empty = vm.setWarningMessage();

            expect(empty).toEqual([]);
        });

        it('When ignoreWarnings is true, return an empty array of warnings', () => {
            vm.ignoreWarnings = true;

            let empty = vm.setWarningMessage();

            expect(empty).toEqual([]);
        });

        it('when messagesEnabled is true and ignoreWarnings is false, if redFlag total is 0, should push red flag warning on returned array ', () => {
            vm.redFlagTotal = 0;

            let errors = vm.setWarningMessage();

            expect(errors[0]).toEqual('No red flags are checked. Are you sure you want to submit this form?');
        });

        it('when messagesEnabled is true, ignoreWarnings is false, and signed is false, push not signed warning on returned array', () => {
            vm.questions[SignedId].response.value = false;

            let errors = vm.setWarningMessage();

            expect(errors[0]).toEqual('Paper form should be signed, though this is not required. Are you sure you want to submit this form?');
        });

        it('when messagesEnabled is true, ignoreWarnings is false, RedFlagTotal is 0, and signature is false, push invalid border station and interceptee error message on returned array', () => {
            vm.questions[SignedId].response.value = false;
            vm.redFlagTotal = 0;

            let errors = vm.setWarningMessage();

            expect(errors[0]).toEqual('Paper form should be signed, though this is not required. Are you sure you want to submit this form?');
            expect(errors[1]).toEqual('No red flags are checked. Are you sure you want to submit this form?');
        });
    });

    describe('function submit', () => {
        it('should set messagesEnabled to true and call setErrorMessage and setWarningMessage', () => {
            vm.messagesEnabled = false;
            spyOn(vm, 'setErrorMessage');
            spyOn(vm, 'setWarningMessage');

            vm.submit();

            expect(vm.setErrorMessage).toHaveBeenCalled();
            expect(vm.setWarningMessage).toHaveBeenCalled();
            expect(vm.messagesEnabled).toEqual(true);
        });
    });

    describe('function watchMessages', () => {
        it('should set watches on to call this.setErrorMEssage when cards changes', () => {
            vm.$scope.$watch = (a, b) => b([], ["hello"]);
            spyOn(vm, 'setErrorMessage');

            vm.watchMessages();

            expect(vm.setErrorMessage).toHaveBeenCalled();
        });
        it('should set watches on to call this.setWarningMessage when redFlagTotal', () => {
            vm.$scope.$watch = (a, b) => b(0, 500);
            spyOn(vm, 'setErrorMessage');

            vm.watchMessages();

            expect(vm.setErrorMessage).toHaveBeenCalled();
        });
    });
});