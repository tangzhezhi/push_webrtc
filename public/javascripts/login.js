$(document).ready(function(){
    $(".form-signin").submit(function(){
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
            $("div.alert").remove();
            var alertdiv = $("<div>");
            alertdiv.addClass("alert alert-danger");
            var btn = $("<button>");
            btn.addClass("close").attr("data-dismiss","alert").html("×");
            var msg = $("<span>");
            msg.html("<h4>警告!</h4>用戶名或密碼錯誤.");
            alertdiv.append(btn).append(msg);
            $("h2.form-signin-heading").after(alertdiv);
        }

    });
});