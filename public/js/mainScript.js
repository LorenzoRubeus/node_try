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
}); 
