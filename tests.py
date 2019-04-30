import emails
import tornado.gen


@tornado.gen.coroutine
def email():
    m = emails.html(text='5781458',
                    subject='测试邮件',
                    mail_from=('Andy',
                    'dkfr145@163.com'))

    r = yield m.send(to=('qq', '774574159@qq.com'),
                    smtp={'host': 'smtp.163.com',
                          'user': 'dkfr145@163.com',
                          'password': 'dhsqj0519'})
    raise tornado.gen.Return(r.status_code)