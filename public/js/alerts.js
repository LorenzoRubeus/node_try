function errorAlertLogin(error) {
    switch(error) {
        case "Invalid Credential": 
            setTimeout(function () { swal("Error while signing in!",
                "Wrong email or password!",
                "error");
            }, 600);
            break;
        default: 
            setTimeout(function () { swal("Error while signing in!",
                "All fields need to be compiled",
                "error");
            }, 600);
            break;
    }
}

function errorAlertRegister(error) {
    switch(error) {
        case "User Registered":
            setTimeout(function () { swal("Error while signing up!",
                    "There is an user with this email",
                    "error");
                }, 600);
                break;
        case "Missing Field": 
            setTimeout(function () { swal("Error while signing up!",
                "All fields need to be compiled",
                "error");
            }, 600);
            break;
        case "Password No Match": 
            setTimeout(function () { swal("Error while signing up!",
            "Passwords don't match", 
            "error");
            }, 600);
            break;
        default: 
            setTimeout(function () { swal("Error while signing up!",
                error,
                "error");
        }, 600);
        break;
    }
}

function errorAlertAddress(error) {
    switch(error) {
        default: 
            setTimeout(function () { swal("Error while adding the address",
                error,
                "error");
        }, 600);
        break;
    }
}

function errorAlertEditAddress(error) {
    switch(error) {
        default:
            setTimeout(function () { swal("Error while editing the address", 
                error,
                "error");
        }, 600);
        break;
    }
}

function errorAlertAddProductBasket(error) {
    switch(error) {
        default:
            setTimeout(function () { swal("Error while adding the product to the basket", 
                error,
                "error");
            }, 600);
        break;
    }
}

function errorAlertAddPayment(error) {
    switch(error) {
        default: 
            setTimeout(function () { swal("Error while adding the payment method",
                error,
                "error");
            }, 600);
            break;
    }
}

function errorAlertEditPayment(error) {
    switch(error) {
        case "Payment not found": 
            setTimeout(function () { swal("Error while adding the payment method",
                "The selected payment was not found, try to refresh the page",
                "error");
            }, 600);
            break;
        default: 
            setTimeout(function () { swal("Error while adding the payment method",
                error,
                "error");
            }, 600);
            break;
    }
}

function errorAlertDeletePayment(error) {
    switch(error) {
        case "Payment not found": 
            setTimeout(function () { swal("Error while adding the payment method",
                "The selected payment was not found, try to refresh the page",
                "error");
            }, 600);
            break;
    }
}

// ===== Profile Alerts =====
function errorAlertChangeName(error) {
    switch(error) {
        case "First name error":
            setTimeout(function () { swal("Error while changing the name",
                "First name must be compiled and it has to have at least 2 characters",
                "error");
            }, 600);
            break;
        case "Last name error": 
            setTimeout(function () { swal("Error while changing the name",
                "Last name must be compiled and it has to have at least 2 characters",
                "error");
            }, 600);
            break;
    }
}

function errorAlertChangeEmail(error) {
    switch(error) {
        case "Email no match":
            setTimeout(function () { swal("Error while changing the email address",
                "Email addresses do not match",
                "error");
            }, 600);
            break;
        case "Email few characters":
            setTimeout(function () { swal("Error while changing the email address",
                "Email address must have at least 5 characters",
                "error");
            }, 600);
            break;
        case "Email wrong password":
            setTimeout(function () { swal("error while changing the email address",
                "Wrong password",
                "error");
            }, 600);
    }
}

function errorAlertChangePassword(error) {
    switch(error) {
        case "Password no match": 
            setTimeout(function () { swal("Error while changing the password",
                "Passwords don't match",
                "error");
            }, 600);
            break;
        case "Password too short":
            setTimeout(function () { swal("Error while changing the password",
                "The password you chose is too short. It has to have at least 5 characters",
                "error");
            }, 600);
            break;
        case "Wrong current password":
            setTimeout(function () { swal("Error while changing the password",
                "Current password is wrong. Try again.",
                "error");
            }, 600);
    }
}