$(document).ready(function() {
    $("#linkRegister").click(function(){
        $("#formRegister").css({"display": "block"});
        $(".divButtons").css({"display": "none"});
    });

    $("#linkLogin").click(function(){
        $("#formLogin").css({"display": "block"});
        $(".divButtons").css({"display": "none"});
    });
}); 

function buttonProva(e, basket){
    e.preventDefault();

    alert(basket);
}