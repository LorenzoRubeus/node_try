$(document).ready(function() {
    $("#linkRegister").click(function(){
        $("#formRegister").css({"display": "block"});
        $(".divButtons").css({"display": "none"});
    });

    $("#linkLogin").click(function(){
        $("#formLogin").css({"display": "block"});
        $(".divButtons").css({"display": "none"});
    });

    $("#btnCloseRegister").click( () => {
        $("#formRegister").css({"display": "none"});
        $(".divButtons").css({"display": "block"});
    });

    $("#btnCloseLogin").click( () => {
        $("#formLogin").css({"display": "none"});
        $(".divButtons").css({"display": "block"});
    });

    $("#btnDelete").click( () => {
        swal({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
          }).then(() => {
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: 'http://localhost:3000/api/myProfile/deleteAccount',						
                success: function() {
                    window.location.replace('http://localhost/:3000/');
                }
            });
          });
    });
});
