window.onload = function (){
	var oUser = document.getElementById('user');
	var oUserTip = document.getElementById('tip_user');
	var flagUser = false;
	var oPwd = document.getElementById('pwd');
	var oPwdTip = document.getElementById('tip_pwd');
//	var flagPwd = false;  
	var oRePwd = document.getElementById('re_pwd');
	var oRePwdTip = document.getElementById('tip_repwd');
	var flagRePwd = false;  
	var oEmail = document.getElementById('email');
	var oEmailTip = document.getElementById('tip_email');
	var flagEmail = false;

	var oSubmit = document.getElementById('btn_submit');
	
	//用户名验证
	oUser.onfocus = function (){
		oUserTip.innerHTML = "由4-15位的字母、数字和下划线组成，且开头不能是数字";
	}
	oUser.oninput = function (){
		var res = checkUser(oUser.value);
		
//		if(res.err){
//			oUserTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+res.msg;
//			oUser.classList.add('input_err');
//		}else{
//			oUserTip.innerHTML = '<b class="right">✔</b>';
//			oUser.classList.remove('input_err');
//			flagUser = true;
//		}
//		flagUser = checkResult(res, oUser, oUserTip);
		checkResult(res, oUser, oUserTip);
	}
	oUser.onblur = function (){
		var res = checkUser(oUser.value);
		
//		if(res.err){
//			oUserTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+res.msg;
//			oUser.classList.add('input_err');
//		}else{
//			oUserTip.innerHTML = '<b class="right">✔</b>';
//			oUser.classList.remove('input_err');
//			flagUser = true;
//		}
		flagUser = checkResult(res, oUser, oUserTip);
		
//		ajax({
//			type: 'POST',
//			url: '/checkUser',
//			data: oUser.name+"="+oUser.value,
//			dataType: 'json',
//			success: function (res){
//				if(res.err){
//					oUserTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+res.msg;
//				}else{
//					oUserTip.innerHTML = '<b class="right">✔</b>';
//					flagUser = true;
//				}
//			},
// 		    error: function (){
//				alert('请求失败');
//			}
//		})
	}

	
	//密码验证
	oPwd.onfocus = function () {
		if(oPwd)
		oPwdTip.innerHTML = '6-16个字符，区分大小写&nbsp;&nbsp;&nbsp;';
	}
	oPwd.oninput = function (){
		var res = checkPwd(oPwd.value);
		var level = pwdLevel(oPwd.value);
		var levelHtml = '';
		
		switch(level){
			case 1:
				levelHtml = '<span><em class="level weak">弱</em>';
				break;
			case 2:
				levelHtml = '<span><em class="level medium">弱</em><em class="level medium">中</em>';
				break;
			case 3:
				levelHtml = '<span><em class="level strong">弱</em><em class="level strong">中</em><em class="level strong">强</em>';
				break;
		}
		
//		if(res.err){
//			oPwdTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+res.msg+levelHtml;
//			oPwd.classList.add('input_err');
//		}else{
//			oPwdTip.innerHTML = '<b class="right">✔</b>&nbsp;&nbsp;'+levelHtml;
//			oPwd.classList.remove('input_err');
//			flagPwd = true;
//		}

		if(oRePwd.value){
			var resRe = checkRePwd(oPwd.value, oRePwd.value);
			
//			if(resRe.err){
//				oPwdTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+resRe.msg;
//				oPwd.classList.add('input_err');
//			}else{
//				oPwdTip.innerHTML = '<b class="right">✔</b>';
//				oPwd.classList.remove('input_err');
//				flagRePwd = true;
//			}
			checkResult(resRe, oPwd, oPwdTip, levelHtml, levelHtml);
			if(resRe.err){
				oRePwd.classList.add('input_err');
				oRePwdTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+resRe.msg;
			}else{
				oRePwdTip.innerHTML = '<b class="right">✔</b>';
				oRePwd.classList.remove('input_err');
			}
		}else{
			checkResult(res, oPwd, oPwdTip, levelHtml, levelHtml);
		}
	}
	oPwd.onblur = function (){
		var res = checkPwd(oPwd.value);
		var level = pwdLevel(oPwd.value);
		var levelHtml = '';
		
		switch(level){
			case 1:
				levelHtml = '<span><em class="level weak">弱</em>';
				break;
			case 2:
				levelHtml = '<span><em class="level medium">弱</em><em class="level medium">中</em>';
				break;
			case 3:
				levelHtml = '<span><em class="level strong">弱</em><em class="level strong">中</em><em class="level strong">强</em>';
				break;
		}
		
		if(oRePwd.value){
			var resRe = checkRePwd(oPwd.value, oRePwd.value);
			
			flagRePwd = checkResult(resRe, oPwd, oPwdTip);
		}else{
			flagRePwd = false;
		}
	}
	
	//确认密码验证
	oRePwd.onfocus = function () {
		oRePwdTip.innerHTML = '请输入确认密码！';
	}
	oRePwd.oninput = function (){
		var res = checkRePwd(oPwd.value, oRePwd.value);
		
		checkResult(res, oRePwd, oRePwdTip);
		if(res.err){
			oPwd.classList.add('input_err');
			oPwdTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;';
			console.log('执行1');
		}else{
			oPwdTip.innerHTML = '<b class="right">✔</b>';
			oPwd.classList.remove('input_err');
			console.log('执行2');
		}
	}
	oRePwd.onblur = function (){
		var res = checkRePwd(oPwd.value, oRePwd.value);
		
//		if(res.err){
//			oRePwdTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+res.msg;
//			oRePwd.classList.add('input_err');
//		}else{
//			oRePwdTip.innerHTML = '<b class="right">✔</b>';
//			oRePwd.classList.remove('input_err');
//			oPwdTip.innerHTML = '<b class="right">✔</b>';
//			oPwd.classList.remove('input_err');
//			flagRePwd = true;
//			flagPwd = true;
//		}
		
		flagRePwd = checkResult(res, oRePwd, oRePwdTip);
	}
	
	//邮箱验证
	oEmail.onfocus = function () {
		oEmail.innerHTML = '请输入确认密码！';
	}
	oEmail.oninput = function (){
		var res = checkEmail(oEmail.value);
		
//		if(res.err){
//			oEmailTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+res.msg;
//			oEmail.classList.add('input_err');
//		}else{
//			oEmailTip.innerHTML = '<b class="right">✔</b>';
//			oEmail.classList.remove('input_err');
//			flagEmail = true;
//		}
		checkResult(res, oEmail, oEmailTip);
	}
	oEmail.onblur = function (){
		var res = checkEmail(oEmail.value);
		
//		if(res.err){
//			oEmailTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+res.msg;
//			oEmail.classList.add('input_err');
//		}else{
//			oEmailTip.innerHTML = '<b class="right">✔</b>';
//			oEmail.classList.remove('input_err');
//			flagEmail = true;
//		}
		flagEmail = checkResult(res, oEmail, oEmailTip);
		
	}
	
	
	oSubmit.onclick = function () {
		console.log(flagUser, flagRePwd, flagEmail);
		if(flagUser && flagPwd && flagRePwd && flagEmail){
			var data = {};
		    data[oUser.name] = oUser.value;
		    data[oRePwd.name] = oRePwd.value;
		    data[oEmail.name] = oEmail.value;

		    ajax({
		    	type: 'POST',
			    url: '/regiter',
			    data: data,
			    dataType: 'json',
			    success: function (res){
			    	if(res.err){
			    		alert(res.msg);
					}else{
			    		alert('登录成功，将跳转到登录页面');
			    		window.location.href="/login" ;
					}
			    },
			    error: function (){
				    alert('请求失败');
			    }
		     })
		}else{
			alert('信息未填写完全或填写错误，请继续输入！');
		}

    }


}
