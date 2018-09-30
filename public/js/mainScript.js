$(document).ready(function() {
    $("#linkRegister").click(function(){
        $("#formRegister").css({"display": "block"});
    });

    $("#linkLogin").click(function(){
        $("#formLogin").css({"display": "block"});
    });

    /*$("#btnRemoveProductBasket").click(function(e) {
        e.preventDefault();

    });*/
}); 

function buttonProva(e, basket){
    e.preventDefault();

    alert(basket);
}