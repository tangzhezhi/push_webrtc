
$(document).ready(function(){
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


    getMenu();
});