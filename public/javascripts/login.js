$(document).ready(function(){

    var validFlag = false;

    $("#login").click(function(){
        var username=$("#email").val();
        var password=$("#password").val();
        if(validFlag){
            $.ajax({
                type:"post",
                url: "login",
                data:{username:username,password:password},
                cache: false,
                success: function(data){
                    if(data === "success"){
                        window.location = "index";
                    }
                    else{
                       $('#my-modal').modal('toggle');
                        $(".am-modal-bd").text(data);
                    }
                },
                error:function(data, textStatus, jqXHR){
                    alert(data);
                }
            });
        }
    });

    $('#myForm').validator({
        validate: function(validity) {
            if(!validity.valid){
                $("#error").remove();
                $("#"+validity.field.id).parent().append('<div id="error">'+validity.field.validationMessage+'</div>');
                validFlag = false;
            }
            else{
                $("#error").remove();
                validFlag = true;
            }
        }
    });

});