import tornado.web
from views import views
from config import setting
from queue import Queue
import threading
import smtplib, json
from email.header import Header
from email.mime.text import MIMEText


class Application(tornado.web.Application):
    def __init__(self):
        handlers = [
            (r'/', views.IndexHandler),
            (r'/regiter', views.RegiterHandler),
            (r'/agreement', views.AgreementHandler),
            (r'/urlget', views.UrlgetHandler),
            (r'/pythonlearn', views.PythonlearnHandler),
            (r'/pythondeal', views.PythondealHandler),
            (r'/main', views.MainHandler),
            (r'/sendemail', views.SendemailHandler),
            (r'/checkuser', views.CheckHandler),
            (r'/loginstate', views.LoginStateHandler),
            # tornado.web.url 用于反响代理，其他viev可以通过name查找home的路由
            tornado.web.url(r'/login', views.LoginHandler, name="loginpage"),
        ]
        self.emailqueue = Queue()
        self.emailThread = threading.Thread(target=self.onEmail)
        super(Application, self).__init__(handlers=handlers, **setting)

    def onEmail(self):
        """发送邮件函数"""
        while True:
            requestmsg = self.emailqueue.get(block=True)
            requestmsg = json.loads(requestmsg)
            authcode = requestmsg['authcode']
            to_addr = requestmsg['email']
            try:
                user = requestmsg['user']
            except:
                user = '客官您的验证信息'
            smtp_server = 'smtp.ym.163.com'
            from_addr = 'admin@andymsgemail.tk'
            passwd = 'dhsnqj0519'
            msg = MIMEText(f"您的验证码是{authcode}", 'plain', 'utf-8')
            msg['Subject'] = Header('注册验证码', charset='utf-8')
            msg['From'] = "www.andymsg.tk"
            msg['To'] = user
            try:
                server.sendmail(from_addr=from_addr, to_addrs=to_addr, msg=msg.as_string())
                print('发送成功')
            except Exception as err:
                print(err)
                server = smtplib.SMTP_SSL(host=smtp_server, port=994)
                server.login(user=from_addr, password=passwd)
                server.sendmail(from_addr=from_addr, to_addrs=to_addr, msg=msg.as_string())
                print('发送成功')
            #server.quit()