import tornado.web
import tornado, json, random, time
from tornado.gen import Return
from models import Usermsg
userRegiterDict = {}

class BaseHandler(tornado.web.RequestHandler):
    """需要验证用户是否登陆的页面继承该类"""
    def get_current_user(self):
        return self.get_secure_cookie("user")


class IndexHandler(BaseHandler):
    def get(self):
        self.xsrf_token
        self.render('home.html')


class LoginStateHandler(BaseHandler):
    def get(self, *args, **kwargs):
        try:
            statu = int(self.get_query_argument("loginOut"))
        except:
            statu = 0
        if statu:
            self.clear_cookie("user")
            self.write("退出登陆成功")
        else:
            user = self.current_user
            if user:
                user = str(user, encoding='utf-8')
            self.write(user)


class RegiterHandler(tornado.web.RequestHandler):
    """注册页面"""
    def get(self, *args, **kwargs):
        self.render('regiter.html')

    @tornado.gen.coroutine
    def post(self, *args, **kwargs):
        msg = dict()

        msg["user"] = self.get_body_argument("user")
        msg["password"] = self.get_body_argument("pwd")
        msg["phone"] = self.get_body_argument("userPhone")
        msg["email"] = self.get_body_argument("userEmail")
        userVerifyType = self.get_body_argument("userVerifyType")
        authCode = self.get_body_argument("verifyCode")
        uuid = self.get_body_argument("uuid")
        try:
            userMsg = userRegiterDict[uuid]
        except:
            returnmsg = {'err': 1, 'msg': '注册时间超时请重新注册'}
            self.write(json.dumps(returnmsg, ensure_ascii=False))
            self.finish()
            return
        t = time.time()
        if t - userMsg["time"] > 900:
            returnmsg = {"err": 1, "msg": "验证码已过期"}
        else:
            if authCode != userMsg["authcode"]:
                returnmsg = {"err": 1, "msg": "验证码错误"}
            else:
                datas = yield Usermsg.insert(**msg)
                if datas:
                    returnmsg = {'err': 0, 'msg': '注册成功，返回主页'}
                    self.set_secure_cookie("user", msg["user"], expires_days=0.5)
                else:
                    returnmsg = {'err': 0, 'msg': '注册失败，内部错误'}
        del userRegiterDict[uuid]
        self.write(json.dumps(returnmsg, ensure_ascii=False))


class AgreementHandler(tornado.web.RequestHandler):
    """同意页面"""
    def get(self, *args, **kwargs):
        self.render('agreement.html')


class UrlgetHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        a = self.get_query_argument("a", strip=True)  # 从链接中获取值不重复命名的值,strip表示是否过滤掉左右两边的空白字符，默认为过滤
        blist = self.get_query_arguments("b", strip=True)  # 从链接中获取值重复命名的值
        self.write(f"通过url传过来了a:{a},b:{blist}")


class MainHandler(BaseHandler):
    @tornado.web.authenticated
    def get(self, *args, **kwargs):
        name = tornado.escape.xhtml_escape(self.current_user)
        self.write("Hello, " + name)


class CheckHandler(tornado.web.RequestHandler):
    """确认用户信息类"""
    @tornado.gen.coroutine
    def get(self, *args, **kwargs):
        uuid = self.get_query_argument("uuid")
        returnmsg = None
        t = time.time()
        for key, value in userRegiterDict.items():
            if value["time"] - t > 900:
                del userRegiterDict[key]
        try:
            user = self.get_query_argument("user")
            returnmsg = yield self.checkuser(user, uuid)
        except:
            email = self.get_query_argument("email")
            self.sendEmail(email, uuid)
        if returnmsg:
            self.write(json.dumps(returnmsg, ensure_ascii=False))

    @tornado.gen.coroutine
    def checkuser(self,user, uuid):
        sets = ["password"]
        where = ["user", user]
        msg = yield Usermsg.get(sets=sets, where=where)
        if msg:
            returnmsg = {'err': 1, 'msg': '用户名被占用'}
        else:
            returnmsg = {'err': 0, 'msg': '可以使用的用户名'}
            t = time.time()
            userRegiterDict[uuid] = {"user": user, "time": t}

        raise Return(returnmsg)

    def sendEmail(self, email, uuid):
        """生成验证码，发送邮件"""
        authcode = str(random.randint(0, 999999)).zfill(6)
        userRegiterDict[uuid]["email"] = email
        userRegiterDict[uuid]["authcode"] = authcode
        t = time.time()
        userRegiterDict[uuid]["time"] = t
        forsend = json.dumps(userRegiterDict[uuid])
        self.redirect(f'/sendemail?sendemail={forsend}')


class SendemailHandler(tornado.web.RequestHandler):
    """发送邮件"""
    def get(self, *args, **kwargs):
        msg = self.get_query_argument("sendemail")
        self.application.emailqueue.put(msg, block=False)
        self.on_finish()


class LoginHandler(BaseHandler):
    """登陆界面"""
    def get(self, *args, **kwargs):
        self.render('login.html')  # 将html页面返回给客户端用render

    @tornado.gen.coroutine
    def post(self, *args, **kwargs):
        user = self.get_body_argument("user")  # 接受单个post的值时用get_body_argument
        password = self.get_body_argument("pwd")
        sets = ["password"]
        where = ["user", user]
        msg = yield Usermsg.get(sets=sets, where=where)
        if msg:
            if password == msg[0]['password']:
                self.set_secure_cookie("user", user, expires_days=0.5)  # 设置安全cookie
                returnmsg = {'err': 0, 'msg': '登陆成功'}
                self.write(json.dumps(returnmsg, ensure_ascii=False))
                #self.redirect('/', permanent=False)
            else:
                returnmsg = {'err': 1, 'msg': '密码错误'}
                self.write(json.dumps(returnmsg, ensure_ascii=False))
        else:
            returnmsg = {'err': 2, 'msg': '该用户还未注册'}
            self.write(json.dumps(returnmsg, ensure_ascii=False))
        self.on_finish()


class PythonlearnHandler(BaseHandler):
    def get(self, *args, **kwargs):
        if not self.current_user:
            word = '暂时还没做好哦，返回'
        else:
            user = tornado.escape.xhtml_escape(self.current_user)
            word = f'{user}暂时还没做好哦，返回'
        self.render('word.html', word=word, url_='/')


class PythondealHandler(tornado.web.RequestHandler):
    def get(self, *args, **kwargs):
        word = '还没开张过几天吧，返回'
        self.render('word.html', word=word, url_='/')


