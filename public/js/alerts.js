function errorAlertLogin(error) {
    switch(error) {
        case "Invalid Credential": 
            setTimeout(function () { swal("Error while signing in!",
                "Wrong email or password!",
                "error");
            }, 600);
            break;
        case "Missing Field": 
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
        case "BUBI SCHIFO": 
            setTimeout(function () { swal("Error while signing up!",
            error,
            "error");
        }, 600);
        break;
    }
}

