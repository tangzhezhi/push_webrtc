$(document).ready(function(){

    /**
     * ajax请求，服务端无法跳转
     * @param username
     * @param password
     */
    function login(username,password){
        $.ajax({
            type: "POST",
            url: "login",
            data: {"username":username,"password":password},
            success: function(data){
                if(data){
                    if(data.msg){
                        alert(data.msg);
                    }
                    if(data.success){
                        window.location="/index";
                    }
                }
            },
            error:function(XMLHttpRequest, textStatus, errorThrown){
                alert(errorThrown);
            }
        });
    }




    $(".form-signin").click(function(){
        var flag = false;
        $("div.form-group").removeClass("has-error");
        $("span.help-block").text("");
        if($.trim($("#username").val())==""){
            $("#username").parent().parent().addClass("has-error");
            $("#username").val("");
            $("#username").next().text("请输入用戶名.");
        }
        if($.trim($("#password").val())==""){
            $("#password").parent().parent().addClass("has-error");
            $("#password").val("");
            $("#password").next().text("请输入密码.");
        }

        if($.trim($("#username").val()) != "" && $.trim($("#password").val()) != "") {
            login($("#username").val(),$("#password").val());
        }

    });
});