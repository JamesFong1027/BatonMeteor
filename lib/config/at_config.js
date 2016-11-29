var myPostLogout = function() {
    // clean up session
    Object.keys(Session.keys).forEach(function(key) {
        Session.set(key, undefined);
    });
    Session.keys = {} // remove session keys
    Router.go('/'); // redirect to the home page or elsewhere using iron:router
};

var myPreSubmitFunc = function() {
    //example redirect after logout
    // Router.go('/');
    console.log("myPreSubmitFunc");
};

var myPreSignUpHook = function(password, info) {
    console.log("myPreSignUpHook");
    console.log(password);
    console.log(info);
};

var myPostSignUpHook = function(userId, info) {
    console.log("myPostSignUpHook");
    console.log(userId);
    console.log(info);
}

var mySubmitFunc = function(error, state){
  if (!error) {
    if (state === "signIn" || state === "signUp") {
      setUserLanguage(getUserPreferLanguage());
    }
  }
};

// Options
AccountsTemplates.configure({
    //defaultLayout: 'emptyLayout',
    // showForgotPasswordLink: true,
    // overrideLoginErrors: true,
    // enablePasswordChange: true,
    // sendVerificationEmail: false,

    // //enforceEmailVerification: true,
    // //confirmPassword: true,
    // //continuousValidation: false,
    // //displayFormLabels: true,
    // //forbidClientAccountCreation: false,
    // //formValidationFeedback: true,
    // homeRoutePath: '/home',
    // redirectTimeout: 4000,
    // //showAddRemoveServices: false,
    // //showPlaceholders: true,

    // negativeValidation: true,
    // positiveValidation:true,
    // negativeFeedback: false,
    // positiveFeedback:false,

    // Behavior
    confirmPassword: true,
    enablePasswordChange: true,
    forbidClientAccountCreation: false,
    overrideLoginErrors: true,
    sendVerificationEmail: false,
    lowercaseUsername: false,
    focusFirstInput: true,

    // Appearance
    showAddRemoveServices: false,
    showForgotPasswordLink: true,
    showLabels: true,
    showPlaceholders: false,
    showResendVerificationEmailLink: false,

    // Client-side Validation
    continuousValidation: false,
    negativeFeedback: false,
    negativeValidation: true,
    positiveValidation: true,
    positiveFeedback: true,
    showValidating: true,

    // Privacy Policy and Terms of Use
    privacyUrl: 'privacy',
    termsUrl: 'terms-of-use',

    // Redirects
    homeRoutePath: '/',


    onLogoutHook: myPostLogout,
    // preSignUpHook: myPreSubmitFunc,
    onSubmitHook: mySubmitFunc,
    // preSignUpHook: myPreSignUpHook,
    // postSignUpHook: myPostSignUpHook,

    texts: {
        title: {
            signIn: "",
            signUp: "",
            forgotPwd: "Please enter your email address",
        },
        errors: {
            // accountsCreationDisabled: "Client side accounts creation is disabled!!!",
            // cannotRemoveService: "Cannot remove the only active service!",
            // captchaVerification: "Captcha verification failed!",
            loginForbidden: "Login Failed",
            // mustBeLoggedIn: "error.accounts.Must be logged in",
            // pwdMismatch: "error.pwdsDontMatch",
            // validationErrors: "Validation Errors",
            // verifyEmailFirst: "Please verify your email first. Check the email and follow the link!",
        },
        button: {
            // changePwd: "Password Text",
            // enrollAccount: "Enroll Text",
            forgotPwd: "Request Password Change",
            // resetPwd: "reset password text",
            // signIn: "Sign In Text",
            // signUp: "Sign Up Text",
        },
    }
});
AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([{
    _id: 'email',
    type: 'email',
    required: true,
    displayName: "email",
    re: /.+@(.+){2,}\.(.+){2,}/,
    showValidating: true,
    func: function(email) {
        if (Meteor.isClient) {
            console.log("Validating email...");
            var self = this;
            Meteor.call("isEmailExist", email, function(err, emailExists) {
                if (!emailExists) {
                    console.log("not exist");
                    if (AccountsTemplates.getState() === "signUp") {
                        self.setSuccess();
                    }
                    if (AccountsTemplates.getState() === "forgotPwd") {
                        self.setError("Email doesn't exist");
                    }
                } else {
                    if (AccountsTemplates.getState() === "signUp") {
                        console.log("exist");
                        self.setError("Email already exist");
                    }
                    if (AccountsTemplates.getState() === "forgotPwd") {
                        self.setSuccess();
                    }
                }
                self.setValidating(false);
            });
            return;
        }
        // Server
        return Meteor.call("isEmailExist", email);
    },
    errStr: 'Invalid email, should like: john@domain.com',
}, {
    _id: "password",
    type: 'password',
    placeholder: {
        signUp: "At least six characters"
    },
    required: true,
    minLength: 6,
    errStr: 'At least six characters',
}, {
    _id: "firstName",
    type: "text",
    displayName: "First Name",
    placeholder: {
        signUp: "First Name"
    }
}, {
    _id: "lastName",
    type: "text",
    displayName: "Last Name",
    placeholder: {
        signUp: "Last Name"
    }
}, {
    _id: "userType",
    type: "radio",
    select: [{
        text: "Student",
        value: "Student",
    }, {
        text: "Teacher",
        value: "Teacher",
    }, ],
    required: true,
    displayName: "Student or Teacher",
    errStr: 'Select one of them',
}, ]);

var configureOption = {
    layoutTemplate: 'loginLayout',
    redirect: '/home',
};
//UserAccounts Routes
AccountsTemplates.configureRoute('changePwd', configureOption);
AccountsTemplates.configureRoute('enrollAccount', configureOption);
AccountsTemplates.configureRoute('forgotPwd', configureOption);
AccountsTemplates.configureRoute('resetPwd', configureOption);
AccountsTemplates.configureRoute('signIn', configureOption);
AccountsTemplates.configureRoute('signUp', configureOption);
AccountsTemplates.configureRoute('verifyEmail', configureOption);