import os
import tornado.autoreload


options = {
            "port": 80
           }

mydb ={
        "host": "149.129.75.117",
        "dbname": "websql",
        "user": "root",
        "password": "dhsnqj0519"
       }

setting = {
            'template_path': os.path.join(os.path.dirname(__file__), 'templates'),  # 将templates的文件路径加入默认路径
            'static_path': os.path.join(os.path.dirname(__file__), 'static'),
            "debug": True,
            "cookie_secret": "f2pDS2iDTguJxkitNThwqpPfFBWfAkYKppHfESejvK8=",
            "xsrf_cookies": True,
            "login_url": '/login'
         }
