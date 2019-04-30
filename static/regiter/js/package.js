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

//验证验证码规范
function isVerCode(code){
	var reg = /^\d{6}$/
	if(code==""){
		return {"err": 1, "msg": "请输入验证码"};
	}else if(!reg.test(code)){
		return {"err": 1, "msg": "请输入6位数字验证码"};
	}else{
		return {"err": 0, "msg": ""};
	}
}


//验证用户名
function isUser(user){
	var str = user.toLowerCase();
	var reg = /^[a-zA-Z_]{1}\w{3,14}$/;
	
	if(!reg.test(str)){
		if(str==''){
			return {"err": 1, "msg": "请输入用户名!"};
		}else if(!/^[a-zA-Z_]{1}/.test(str)){
			return {"err": 1, "msg": "开头不能是数字"};
		}else if(/\W/.test(str)){
			return {"err": 1, "msg": "含非法字符，须由字母、数字和下划线组成"};
		}else if(str.length<4 || str.length>15){
			return {"err": 1, "msg": "长度必须为4-15位"};
		}else{
			return {"err": 0, "msg": ""};
		}
	}else{
		return {"err": 0, "msg": ""};
	}
}

//检测用户名方式
function isUserVer(type, val){
	switch(type){
		case "phone":
			return isPhone(val);
			break;
		case "email":
			return isEmail(val);
			break;
	}	
}


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

//验证两次密码
function isRePwd(pwd,repwd){
	if(pwd!=repwd){
		return {"err": 1, "msg": "新密码输入不一致"};
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
/*
  * 密码强度
    定义一个函数，对给定的数分为四类(判断密码类型)，返回十进制1，2，4，8
    数字 0001 -->1  48~57
    小写字母 0010 -->2  97~122
    大写字母 0100 -->4  65~90
    特殊 1000 --> 8 其它
*/
function pwdLevel(pwd){
	var result = 0;
	var level = 0;
	
    for(var i = 0; i < pwd.length; ++i){
        result |= charType(pwd.charCodeAt(i));
    }
    //对result进行四次循环，计算其level
    for(var i = 0; i <= 4; i++){
        if(result & 1){
            level ++;
        }
        //右移一位
        result = result >>> 1;
    }
    return level;
}
function charType(num){
    if(num >= 48 && num <= 57){
        return 1;
    }
    if (num >= 97 && num <= 122) {
        return 2;
    }
    if (num >= 65 && num <= 90) {
        return 4;
    }
    return 8;
}

//生成UUID
function generateUUID() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
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



