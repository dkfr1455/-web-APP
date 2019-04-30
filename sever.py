import tornado.ioloop
from application import Application
import config


if __name__ == "__main__":
    app = Application()
    app.listen(config.options["port"])
    print("sevice running")
    app.emailThread.setDaemon(True)
    app.emailThread.start()  # 邮箱验证独立线程启动
    tornado.ioloop.IOLoop.current().start()
