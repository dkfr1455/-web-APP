
function checkResult(res, oTarget, oTip, msg_err, msg_ok){
	var msg_err = msg_err || "";
	var msg_ok = msg_ok || "";
	if(res.err){
		oTip.innerHTML = '<b class="wrong">✖</b>&nbsp;&nbsp;'+res.msg+msg_err;
		oTarget.classList.add('input_err');
		return false;
	}else{
		oTip.innerHTML = '<b class="right">✔</b>'+msg_ok;
		oTarget.classList.remove('input_err');
		return true;
	}
}


//验证邮箱
function checkEmail(email){
	var str = email;
	var reg = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
	if(str==""){
		return {"err": 1, "msg": "请输入邮箱!"};
	}else if(!reg.test(str)){
		return {"err": 1, "msg": "邮箱格式不正确!"};
	}else{
		return {"err": 0, "msg": ""};
	}
}

//验证确认密码
function checkRePwd(pwd,repwd){
	if(repwd==""){
		return {"err": 1, "msg": "请输入确认密码！"};
	}else if(repwd.length<5 || repwd.length>17){
		return {"err": 1, "msg": "密码长度需要6-16个"};
	}else if(pwd!=repwd){
		return {"err": 1, "msg": "两次密码不一致，请重新输入！"};
	}else{
		return {"err": 0, "msg": ""};
	}
}

//验证密码
function checkPwd(pwd){
	if(pwd==''){
		return {"err": 1, "msg": "请输入密码！"};
	}else if(pwd.length<5 || pwd.length>17){
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


//ajax封装
function createXHR(){
	if (window.XMLHttpRequest){
		return new XMLHttpRequest;
	}
	return new ActiveXObject('Microsoft.XHLHTTP');
}
function getParams(obj){
	var arr = [];
	for (var key in obj){
		var str = key + "=" + obj[key];
		arr.push(str);
	}
	return arr.join("&");
}
function ajax(obj){
	obj.type = obj.type || "get";
	obj.data = obj.data || {};
	obj.async = obj.async==undefined ? true : obj.async;
	obj.dataType = obj.dataType || 'text';
	
	var paramsStr = getParams(obj.data);
	
	var xhr = createXHR();
	
	if(obj.type.toLowerCase()=="get"){
		obj.url += paramsStr ? ("?"+paramsStr) : "";
	}
	xhr.open(obj.type, obj.url, obj.async);
	
	if(obj.type.toLowerCase()=="get"){
		xhr.send(null);
	}else if(obj.type.toLowerCase()=="post"){
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
		xhr.send(paramsStr);
	}
	
	if(obj.async==true){
		xhr.onreadystatechange = function (){
			if(xhr.readyState==4){
				if((xhr.status>=200&&xhr.status<300) || xhr.status ==304){
					var data = xhr.responseText;

					switch(obj.dataType){
						case 'json':
							data = JSON.parse(data) || eval('('+data+')');
							break;
						case 'xml':
							data = xhr.responseXML;
							break;
					}

					obj.success && obj.success(data);
				}else{
					obj.error && obj.error();
				}
			}
		}
	}
}


//验证码
function GVerify(options) { //接收options对象为参数
    this.options = { //默认options参数值
        id: "", //容器Id
        type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
        size: "6",  //默认验证码长度
        code: ""
    }
    if(Object.prototype.toString.call(options) == "[object Object]"){//判断传入参数类型
        for(var i in options) { //根据传入的参数，修改默认参数值
            this.options[i] = options[i];
        }
    }else{
        this.options.id = options;
    }
    
    this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
    this.options.letterArr = getAllLetter();

    this.refresh();
}

GVerify.prototype = {
    /**版本号**/
    version: '1.0.0',
    
    /**生成验证码**/
    refresh: function() {
        if(this.options.type == "blend") { //判断验证码类型
            var txtArr = this.options.numArr.concat(this.options.letterArr);
        } else if(this.options.type == "number") {
            var txtArr = this.options.numArr;
        } else {
            var txtArr = this.options.letterArr;
        }

        for(var i = 1; i <=this.options.size; i++) {
            var txt = txtArr[randomNum(0, txtArr.length)];
            this.options.code += txt;
        }
        return this.options.code;
    },
    
    /**验证验证码**/
    validate: function(code){
        var code = code.toLowerCase();
        var v_code = this.options.code.toLowerCase();
        if(code == v_code){
            return true;
        }else{
            return false;
        }
    }
}
/**生成字母数组**/
function getAllLetter() {
    var letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z";
    return letterStr.split(",");
}
/**生成一个随机数**/
function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}