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