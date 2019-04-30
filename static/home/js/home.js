$(function (){
	if(getCookie('user')){
	    $.ajax({
			type:"get",
			url:"/loginstate",
			async: true,
			success: function(res){
				$("#login_state .login_regiter").css('display','none');
				$("#login_state .user_inf").css('display','block');
				$("#login_state .user_inf_name").html('<a href="#">'+ res +'</a>');
			},
			error: function(e){
				console.log(e);
			}
		});
	}
	$('#login_out').click(function(){
		$.ajax({
			type:"get",
			url:"/loginstate?user="+$("#login_state .user_inf_name a").html()+"&loginOut=1",
			async: true,
			success: function(res){
				alert(res);
				window.location.href="/";
			},
			error: function(e){
				console.log(e);
			}
		});
		removeCookie('user');
	})
	
	$(".nav_right ul").mouseenter(function(){
		Array.from($(this).children()).forEach(function(li){
			$(li).removeClass("active");
		});
	})
	$(".nav_right ul").mouseleave(function(){
		$(".regiter").addClass("active");
	})
	
	
	

//设置cookie（添加，修改）
function setCookie(name,value,expires){
	var str = encodeURIComponent(name) + "=" + encodeURIComponent(value);
	if (expires && expires instanceof Date) {
		str += "; expires=" + expires;
	}

	document.cookie = str;  //添加一个cookie
}

//获取cookie  //name8=张三,; name9=李四; name10=王五
function getCookie(name){
	var str = decodeURIComponent(document.cookie);

	var arr = str.split("; ");
	for (var i=0; i<arr.length; i++) {
		var str2 = arr[i];//"name9=李四"
		var arr2 = str2.split("=");

		if (arr2[0] == name) {
			return arr2[1];
		}
	}
	return "";
}

//删除cookie
function removeCookie(name){
	var d = new Date();
	d.setDate(d.getDate()-1);

	document.cookie = encodeURIComponent(name) + "=; expires=" + d;
}	
})