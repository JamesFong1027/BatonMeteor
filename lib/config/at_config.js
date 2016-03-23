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
    showAddRemoveServices: true,
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


    // Privacy Policy and Terms of Use
    //privacyUrl: 'privacy',
    //termsUrl: 'terms-of-use',
});

AccountsTemplates.addFields([
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

