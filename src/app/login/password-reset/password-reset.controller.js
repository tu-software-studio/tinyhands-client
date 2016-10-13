class PasswordResetController {
    constructor (BaseService, toastr) {
        'ngInject';

        this.email = "";
        this.service = BaseService;
        this.toastr = toastr;
    }

    resetPassword() {
        var data = {"email": this.email};
        this.service.post('api/account/password-reset/', data).then(
            (promise) => {
                this.toastr.success(promise.data.message);
            },
            (error) => {
                this.toastr.error(error.data.message);
            }
        );
    }
}

export default PasswordResetController;
