 var mySubmitFunc = function(error, state){
  console.log("in mySubmitFunc");

  if (!error) {
    if (state === "signUp") {
    }
    else
      Router.go("home");  
  }
  else
    console.log(error);
    // if(state==="signIn") {
    //   if(isPharmacyAccount(Meteor.userId())) 
    //   {
    //     console.log("it's pharmacy signIn");
    //     Router.go('padList');
    //   }
    //   else
    //     Router.go('orderList');
    // }

};

var myPostLogout = function(){
    // clean up session
    Object.keys(Session.keys).forEach(function(key){
        Session.set(key, undefined);
    });
    Session.keys = {} // remove session keys
    Router.go('/');  // redirect to the home page or elsewhere using iron:router
};

var myPreSubmitFunc = function(){
    //example redirect after logout
    // Router.go('/');
    console.log("myPreSubmitFunc");
};

var myPreSignUpHook = function(password,info){
    console.log("myPreSignUpHook");
    console.log(password);
    console.log(info);
};

var myPostSignUpHook = function(userId, info){
    console.log("myPostSignUpHook");
    console.log(userId);
    console.log(info);
}


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
    // //homeRoutePath: '/',
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
      }
    }
});
AccountsTemplates.removeField('password');
AccountsTemplates.removeField('email');
AccountsTemplates.addFields([
  {
      _id: 'email',
      type: 'email',
      required: true,
      displayName: "email",
      re: /.+@(.+){2,}\.(.+){2,}/,
      showValidating:true,
      func: function(email){
        if (Meteor.isClient) {
            console.log("Validating email...");
            var self = this;
            Meteor.call("isEmailExist", email, function(err, emailExists){
                if (!emailExists){
                    console.log("not exist");
                    self.setSuccess();
                }
                else{
                    console.log("exist");
                    self.setError("Email already exist");
                }
                self.setValidating(false);
            });
            return;
        }
        // Server
        return Meteor.call("isEmailExist", email);
      },
      errStr: 'Invalid email, should like: john@domain.com',
  },
  {
    _id: "password",
    type: 'password',
    placeholder: {
        signUp: "At least six characters"
    },
    required: true,
    minLength: 6,
    errStr: 'At least six characters',
  },
  {
    _id: "firstName",
    type: "text",
    displayName: "First Name",
    placeholder: {
          signUp: "First Name"
      }
  },
  {
    _id: "lastName",
    type: "text",
    displayName: "Last Name",
    placeholder: {
          signUp: "Last Name"
      }
  },
  {
    _id: "userType",
    type: "select",
    select: [
        {
            text: "Student",
            value: "Student",
        },
        {
            text: "Teacher",
            value: "Teacher",
        },
    ],
    displayName: "Student or Teacher"
  },
]);

var configureOption = {
    layoutTemplate: 'loginLayout',
    redirect: '/home',
};
//UserAccounts Routes
AccountsTemplates.configureRoute('changePwd',configureOption);
AccountsTemplates.configureRoute('enrollAccount',configureOption);
AccountsTemplates.configureRoute('forgotPwd',configureOption);
AccountsTemplates.configureRoute('resetPwd',configureOption);
AccountsTemplates.configureRoute('signIn',configureOption);
AccountsTemplates.configureRoute('signUp',configureOption);
AccountsTemplates.configureRoute('verifyEmail',configureOption);

