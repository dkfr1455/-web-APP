$(function (){
//	var userType = getCookie('userType') || "email";
	
	var flagUser = false;
	var flagPwd= false;
	
//	switch(userType){
//		case "phone":
//			$("#phone_btn").addClass('active').siblings().removeClass('active');
//			$(".user_email").addClass('none');
//			$(".user_user").addClass('none');
//			$(".user_phone").removeClass('none');
//			$("#phone").val(getCookie('userName'));
//			break;
//		case "email":
//			$("#email_btn").addClass('active').siblings().removeClass('active');
//			$(".user_user").addClass('none');
//			$(".user_phone").addClass('none');
//			$(".user_email").removeClass('none');
//			$("#email").val(getCookie('userName'));
//			break;
//		case "user":
//			$("#user_btn").addClass('active').siblings().removeClass('active');
//			$(".user_phone").addClass('none');
//			$(".user_email").addClass('none');
//			$(".user_user").removeClass('none');
//			$("#user").val(getCookie('userName'));
//			break;
//	}
	$("#user").val(getCookie('userName'));
	$("#pwd").val(getCookie('pwd'));
	if(getCookie('pwd')){
		$("#btn_submit").attr('disabled', false);
		$("#checkbox").addClass('checkbox_selected');
		$("#checkbox").html('<span>✔</span>');
	}
	
//	$("#user_select span").click(function (){
//		$(this).addClass('active');
//		$(this).siblings().removeClass('active');
//		
//		switch($(this)[0].id){
//			case "phone_btn":
//				userType = "phone";
//				$(".user_email").addClass('none');
//				$(".user_user").addClass('none');
//				$(".user_phone").removeClass('none');
//				break;
//			case "email_btn":
//				userType = "email";
//				$(".user_user").addClass('none');
//				$(".user_phone").addClass('none');
//				$(".user_email").removeClass('none');
//				break;
//			case "user_btn":
//				userType = "user";
//				$(".user_phone").addClass('none');
//				$(".user_email").addClass('none');
//				$(".user_user").removeClass('none');
//				break;
//		}
//		
//		$("input").val("");
//	})
	
	
	//用户名验证
	$("#user").blur(function (){
		var res = checkUser($(this).val());
		flagUser = checkError(res, this, $(this).parent().siblings('.tip_err')[0]);
	})
	
	//密码验证
	$("#pwd").blur(function (){
		var res = isPwd($(this).val());
		
		flagPwd = checkError(res, this, $(this).parent().siblings('.tip_err')[0]);
	})
	
	//按钮显示
	$('input').on('input', function (){
		var resUser = checkUser($("#user").val()).err;
		var resPwd = isPwd($("#pwd").val()).err;
		
		if((!resUser) && (!resPwd)){
			$("#btn_submit").attr('disabled', false);
		}else{
			$("#btn_submit").attr('disabled', true);
		}
	})
	
	//记住密码
	$("#checkbox").click(function (){
		$("#checkbox").toggleClass('checkbox_selected');
		if($("#checkbox").hasClass('checkbox_selected')){
			$("#checkbox").html('<span>✔</span>');
				var d = new Date();
				d.setDate(d.getDate()+5);
				setCookie('userName', $("#user").val(), d);
				setCookie('pwd', $("#pwd").val(), d);
		}else{
			$("#checkbox").html('');
			removeCookie('userName');
			removeCookie('pwd');
		}
	})
	
	//注册按钮提交数据
	$("#btn_submit").click(function (){
		var user = $("#user").val();
		var pwd = $("#pwd").val();

		if($("#checkbox").hasClass('checkbox_selected')){
			if(getCookie('pwd')!=pwd || getCookie('userName')!=user){
				var d = new Date();
				d.setDate(d.getDate()+5);
				setCookie('userName', user, d);
				setCookie('pwd', pwd, d);
			}
		}else{
			removeCookie('userName');
			removeCookie('pwd');
		}
		$.ajax({
			type:"post",
			url:"/login",
			async: true,
			data: {"user": user, "pwd": pwd},
			headers: {
				"X-XSRFToken": getCookie("_xsrf")
			},
			success: function(res){
				if(res.err){
					alert(res.msg);
				}else{
					window.location.href="/";
				}
			},
			error: function(){
				
			}
		});
	})
	
	
	
	
//验证信息
function checkError(res, oTarget, oTip){
	if(res.err){
		oTip.style.display = "block";
		oTip.innerHTML = res.msg;
		oTarget.classList.add('input_err');
		return false;
	}else{
		oTip.style.display = "none";
		oTip.innerHTML = '';
		oTarget.classList.remove('input_err');
		return true;
	}
}
//判断用户名的值
//function isUserValue (type){
//	switch(type){
//		case "phone":
//			return $("#phone").val();
//			break;
//		case "email":
//			return $("#email").val();
//			break;
//		case "user":
//			return $("#user").val();
//			break;
//	}
//}

//验证用户名
//function isUser (type, val){
//	switch(type){
//		case "phone":
//			return isPhone(val);
//			break;
//		case "email":
//			return isEmail(val);
//			break;
//		case "user":
//			return checkUser(val);
//			break;
//	}
//}
//验证手机号码
function isPhone(phone){
	var reg = /^1[345789]\d{9}$/;
	if(phone==""){
		return {"err": 1, "msg": "请输入手机号"};
	}else if(!(reg.test(phone))){ 
        return {"err": 1, "msg": "请输入正确的手机号"};
    }else{
    	return {"err": 0, "msg": ""};
    }
}

//用户名验证
function checkUser(user){
	var str = user.toLowerCase();
	var reg = /^[a-zA-Z_]{1}\w{3,14}$/;
	
	if(!reg.test(str)){
		if(str==''){
			return {"err": 1, "msg": "请输入用户名!"};
		}else if(!/^[a-zA-Z_]{1}/.test(str)){
			return {"err": 1, "msg": "开头不能是数字"};
		}else if(/\W/.test(str)){
			return {"err": 1, "msg": "含非法字符，须由字母、数字和下划线组成"};
		}else if(str.length<5 || str.length>16){
			return {"err": 1, "msg": "长度为5-15"};
		}else{
			return {"err": 0, "msg": ""};
		}
	}else{
		return {"err": 0, "msg": ""};
	}
}


//验证邮箱
function isEmail(email){
	var str = email;
	var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)*(\.[\w-]{2,})$/;
	if(str==""){
		return {"err": 1, "msg": "请输入邮箱"};
	}else if(!reg.test(str)){
		return {"err": 1, "msg": "邮箱格式不正确"};
	}else{
		return {"err": 0, "msg": ""};
	}
}

//验证密码
function isPwd(pwd){
	if(pwd==""){
		return {"err": 1, "msg": "请输入密码"};
	}else if(pwd.length<6 || pwd.length>17){
		return {"err": 1, "msg": "密码长度需要6-16个"};
	}else{
		return {"err": 0, "msg": ""};
	}
}



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



