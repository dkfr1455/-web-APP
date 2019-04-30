$(function (){
	var userVerifyType = "email";
	
	var flagUser = false;
	var flagUserRe = false;
	var flagUserVerify = false;
	var flagVerCode= false;
	var flagPwd= false;
	var flagRePwd= false;
	var flagAccept = true;
	
	var userPhone = 0;
	var userEmail = '';
	var user, pwd, verifyCode;

	var Uuid = generateUUID();
	
	//选择验证方式
	/*
	$("#user_select span").click(function (){
		$(this).addClass('active');
		$(this).siblings().removeClass('active');
		
		switch($(this)[0].id){
			case "phone_btn":
				userVerifyType = "phone";
				$("#user_verify_type input").attr('placeholder', '手机').val('');
				break;
			case "email_btn":
				userVerifyType = "email";
				$("#user_verify_type input").attr('placeholder', '邮箱').val('');
				break;
		}
		
		$("#vercode").val('');
	})
	*/
	//接受用户协议
	$("#checkbox, #checkbox_inf").click(function (){
		$("#checkbox").toggleClass('checkbox_selected');
		if($("#checkbox").hasClass('checkbox_selected')){
			$("#checkbox").html('<span>✔</span>');
			flagAccept = true;
		}else{
			$("#checkbox").html('');
			flagAccept = false;
		}
	})
	
	//检测用户名
	$("#user").focus(function (){
		$(this).parent().siblings(".tip").css('display', 'block');
		$(this).parent().siblings(".tip_err").css('display', 'none');
	})
	$("#user").blur(function (){
		$(this).parent().siblings(".tip").css('display', 'none');
		user = $(this).val().toLowerCase();
		var res = isUser(user);
		var that = this;

		flagUser = checkError(res, that, $(that).parent().siblings('.tip_err')[0]);
		$.ajax({
			type:"get",
			url:"/checkuser?user="+user+"&uuid="+Uuid,
			async:true,
			dataType: "json",
			success: function (data){
				if(!res.err){
					flagUserRe = checkError(data, that, $(that).parent().siblings('.tip_err')[0]);
				};
			}
		});




	})
	
	//用户验证方式
	$("#user_verify").on('input', function(){
		var res = isUserVer(userVerifyType, $(this).val()).err;
		if(!res){
			$("#btn_vercode").attr('disabled', false);
		}else{
			$("#btn_vercode").attr('disabled', true);
		}
	});
	$("#user_verify").blur(function (){
		switch(userVerifyType){
			case "phone":
				userPhone = $(this).val();
				var res = isPhone(userPhone);
				
				flagUserVerify = checkError(res, this, $(this).parent().siblings('.tip_err')[0]);
				break;
			case "email":
				userEmail = $(this).val();
				var res = isEmail(userEmail);
				
				flagUserVerify = checkError(res, this, $(this).parent().siblings('.tip_err')[0]);
				break;
		}		
				
	})
	
	$("#btn_vercode").click(function (){
		var timer;
		var time=60;
		
		$.ajax({
			type:"get",
			url:"/checkuser?email="+$("#user_verify").val().toLowerCase()+"&uuid="+Uuid,
			async: true,
			success: function(res){
				// if(re
			},
			error: function (){

			}
		})
		
		timeCountDown();
		
		//点击发送验证码，开始计数
		function timeCountDown(){
			if(time==0){
				window.clearTimeout(timer);
				$('#btn_vercode').text("重新发送验证码");
				$('#btn_vercode').attr("disabled",false);  
				return true;
			}else{
				$('#btn_vercode').attr("disabled","disabled");
				$('#btn_vercode').html(time+"秒后可重发");
				time--;
			}
			timer = window.setTimeout(timeCountDown,1000);
		}
	})
	
	//验证码验证
	$("#vercode").on('input',function (){
		verifyCode = $(this).val();
		var res = isVerCode(verifyCode);
		flagVerCode = checkError(res, this, $(this).parent().siblings('.tip_err')[0]);
		console.log(flagVerCode,verifyCode);
	})
	
	
	
	//密码验证
	$("#pwd").blur(function (){
		var res = isPwd($(this).val());
		
		flagPwd = checkError(res, this, $(this).parent().siblings('.tip_err')[0]);
	})
	$("#pwd, #re_pwd").on('input', function (){
		var resPwd = isPwd($("#pwd").val()).err;
		var resRePwd = isPwd($("#re_pwd").val()).err; 
		
		if(!resPwd && !resRePwd){
			flagPwd = true;
			var res = isRePwd($("#pwd").val(), $("#re_pwd").val());
			
			flagRePwd = checkError(res, $("#re_pwd")[0], $("#re_pwd").parent().siblings('.tip_err')[0]);
		}
	})
	
	//确认密码验证
	$("#re_pwd").blur(function (){
		var res = isPwd($("#re_pwd").val());
		
		if(res.err){
			checkError(res, this, $(this).parent().siblings('.tip_err')[0]);
		}else{
			var resRe = isRePwd($("#pwd").val(), $("#re_pwd").val());
			
			flagRePwd = checkError(resRe, this, $(this).parent().siblings('.tip_err')[0]);
		}
		
		
	})
	
	//按钮显示
	$('input').on('input', function (){
		if(flagUser && flagUserRe && flagUserVerify && flagVerCode && flagPwd && flagRePwd && flagAccept){
			$("#btn_submit").attr('disabled', false);
		}else{
			$("#btn_submit").attr('disabled', true);
		}
	})
	
	//注册按钮提交数据
	$("#btn_submit").click(function (){
		
		if($("#pwd").val() == $("#re_pwd").val()){
			pwd = $("#re_pwd").val();
		}else{
			alert("两次密码不一致！");
		}
		if(!flagAccept){
			alert("请阅读并同意《用户协议》");
		}
		
		var data = {"user": user, "pwd": pwd, "userVerifyType": userVerifyType, "userPhone": userPhone,
			"userEmail": userEmail, "verifyCode": verifyCode, "uuid": Uuid};
		
		console.log(data);
		$.ajax({
			type:"post",
			url:"/regiter",
			async: true,
			data: data,
			headers: {
				"X-XSRFToken": getCookie("_xsrf")
			},
			success: function(res){
				if(res.err){
					$("#regiter_err").html(res.msg);
				}else{
					alert("注册成功!按下确认返回首页");
					window.location.href="/";
				}
			}
		});
	})
	
})
