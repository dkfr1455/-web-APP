from db.orm_aysnc import ORM


class Students(ORM):
    def __init__(self):
        super(Students, self).__init__("students")

class Usermsg(ORM):
    def __init__(self):
        super(Usermsg, self).__init__("users")