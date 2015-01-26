
$(document).ready(function(){

    var socket = io.connect();

    var chat_userid = "";
    var myuerid = $("#userid").text();

    $("#chat_history_content").val();

    /**
     * 获取菜单
     */
    function getMenu(){
        $.ajax({
            type:"post",
            url: "getMenu",
            cache: false,
            success: function(data){
                if(data.msg === "success"){
                    console.log(data.data);

                    var menus = "";
                    $.each(data.data, function(index, value) {
                        if(value){
                            if(!value.children){
                                menus = menus + "<li><a href='"+value.url+"'><span class='am-icon-home'></span> "+value.name+"</a></li>";
                            }
                            else{

                                menus = menus + "<li class='admin-parent'>" +
                                "<a class='am-cf' data-am-collapse={target:'#"+value.id+"'}><span class='am-icon-file'></span> "+value.name+"<span class='am-icon-angle-right am-fr am-margin-right'></span></a>" +
                                    "<ul class='am-list am-collapse admin-sidebar-sub am-in' id="+value.id+">" ;

                                $.each(value.children,function(index_child,value_child){
                                    menus = menus +
                                    "<li><a href='"+value_child.url+"' class='am-cf'><span class='am-icon-check'></span> "+value_child.name+"<span class='am-icon-star am-fr am-margin-right admin-icon-yellow'></span></a></li>";
                                });

                                menus = menus + "</ul></li>" ;
                            }
                        }
                    });

                    $(".am-list.admin-sidebar-list").append(menus);


                }
                else{
                    $('#my-modal').modal('toggle');
                    $(".am-modal-bd").text(data);
                }
            },
            error:function(data, textStatus, jqXHR){
                $(".am-modal-bd").text(data);
            }
        });
    };

    function getRoomInfo(){
        $.ajax({
            type:"post",
            url: "getRoomInfo",
            cache: false,
            success: function(data){
                if(data.msg === "success"){

                    console.log(data.data);

                    var chat_room_str = " <table class='am-table am-table-bd am-table-striped admin-content-table'>"+
                        "<thead> <tr><th class='am-hide'>房间ID</th><th>房间名</th><th>主题</th><th>当前人数</th><th>操作</th></tr></thead>" +
                        "<tbody> "


                    $.each(data.data, function(index, value) {
                        chat_room_str = chat_room_str + " <tr> <td class='am-hide'>"+value.id+"</td>" +
                        "<td>"+value.name+"</td><td>"+value.subject+"</td> <td><span class='am-badge am-badge-success'>"+value.current_num+"</span></td>" +
                        "<td><div class='am-dropdown am-dropdown-flip' data-am-dropdown>" +
                        "<button class='am-btn am-btn-default am-btn-xs am-dropdown-toggle' data-am-dropdown-toggle><span class='am-icon-cog'></span> <span class='am-icon-caret-down'></span></button>" +
                        "<ul class='am-dropdown-content'>" +
                        "<li><a href='/chat_room?type=1&id="+value.id+"'>1. 加入</a></li><li><a href='/chat_room?type=2&id="+value.id+"'>2. 退出</a></li>" +
                        "</ul></div></td></tr>"
                    });

                    chat_room_str = chat_room_str + "</tbody></table><br/><br/><br/>";

                    $("#chat_rooms").append(chat_room_str);

                    $(".am-dropdown.am-dropdown-flip").click(function(){
                        if($(this).hasClass("am-active")){
                            $(this).removeClass("am-active")
                        }
                        else{
                            $(this).addClass("am-active")
                        }
                    });

                }

            },
            error:function(data, textStatus, jqXHR){
                $(".am-modal-bd").text(data);
            }
        });
    };

    function getAllFriends(){
        $.ajax({
            type:"post",
            url: "getAllFriends",
            cache: false,
            success: function(data){
                if(data.msg === "success"){
                    console.log(data.data);

                    var friend_str = " <div class='am-cf'>"+
                        "<section data-am-widget='accordion' class='am-accordion am-accordion-basic am-no-layout' data-am-accordion='{  }'>" +
                            "<dl class='am-accordion-item'> "

                    $.each(data.data.groups, function(index, value) {
                        friend_str = friend_str + "<dt id="+value.groupid+" class='am-cf am-accordion-title'>"+value.groupname+"</dt>"+
                            "<dd class='am-accordion-bd am-collapse'>" +
                                "<div class='am-accordion-content'>" ;



                        $.each(data.data.friends, function(i, val) {
                            if(val.groupid === value.groupid){
                                friend_str = friend_str +
                                "<a id='"+val.userid+"' href='#' class='chat_user am-text-truncate'><img src='http://amui.qiniudn.com/bw-2014-06-19.jpg?imageView/1/w/96/h/96' alt='' class='am-circle' width='30' height='30'>&nbsp;&nbsp;"+val.name+"</a><br/><br/>";
                            }
                        });

                        friend_str = friend_str + "</div></dd>"
                    });

                    friend_str = friend_str + "</dl></section></div>"

                    $("#chat_user").append(friend_str);

                    $("dt").click(function(){
                        if($(this).next().hasClass("am-in")){
                            $(this).next().removeClass("am-in");
                            $(this).parent().removeClass("am-active");
                        }
                        else{
                            $(this).parent().addClass("am-active");
                            $(this).next().addClass("am-in");
                        }
                    });

                    $(".chat_user").click(function(){
                        var data = this.innerText;
                        chat_userid = this.id;
                        $("#chat_title").text("现在与"+data+" 聊天中").append("<a href='' class='am-close am-close-alt am-close-spin am-icon-times'></a>");
                        socket.on("chat_room_"+myuerid,function(data){
                            $("#chat_history_content").append(data).append("<br/>");
                        });
                        $('#my-prompt').modal({
                            relatedTarget: this
                        });
                    });


                    $("#chat_send").click(function(){
                        var mymsg = $("#my_chat_msg").val();

                        var message = {
                            fromUserId:myuerid,
                            toUserId:chat_userid,
                            message:mymsg
                        };
                        socket.emit("chat_msg",message);
                        $("#my_chat_msg").val("");
                    });

                    $("#chat_close").click(function(){
                        $('#my-prompt').modal('close');
                    });

                }

            },
            error:function(data, textStatus, jqXHR){
                $(".am-modal-bd").text(data);
            }
        });
    }

    getMenu();
    getRoomInfo();
    getAllFriends();



});