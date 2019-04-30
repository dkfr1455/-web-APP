import torndb_for_python3 as torndb
from tornado.gen import coroutine, Return
import config


class ORM:
    """数据库接口类"""

    db = torndb.Connection(config.mydb["host"], config.mydb["dbname"],
                           user=config.mydb["user"], password=config.mydb["password"])

    def __init__(self, column):
        self.column = column

    @classmethod
    @coroutine
    def get(cls, sets=list(), where=list()):
        """查询,传入sets=[fields1,fields2,....],where=[name,value]"""
        fields = ''
        for field in sets:
            fields += field
            fields += ","
        fields = fields[0:-1]
        value = where[1]
        if isinstance(value, str):
            value = "'" + value + "'"
        sql = f"select {fields} from {cls().column} where {where[0]}={value}"
        msg = ORM.db.query(sql)
        raise Return(msg)

    @classmethod
    @coroutine
    def delete(cls, *args):
        """删除函数"""
        s = ''
        for d in args:
            for field, value in d.items():
                if isinstance(value,str):
                    s += f'{field}="{value}"'
                else:
                    s += f'{field}={value}'
                s += ' or '
        s = s[0:-4]
        sql = f"delete from {cls().column} where " + s
        msg = ORM.db.execute(sql)
        raise Return(msg)

    @classmethod
    @coroutine
    def update(cls, sets=list(), where=list()):
        """更新数据,传入列表[field, values]"""
        set_field = sets[0]
        where_field = where[0]
        value=[sets[1], where[1]]
        sql = f"update {cls().column} set {set_field}=%s where {where_field}=%s"
        msg = ORM.db.insertmany(sql, [value])
        raise Return(msg)

    @classmethod
    @coroutine
    def insert(cls, *args):
        """增加,传入字典{field：value}"""
        s = fileds = ''
        values = list()
        for key in args[0].keys():
            fileds += key
            fileds += ','
            s += '%s,'
        fileds = fileds[0:-1]
        s = s[0:-1]
        for d in args:
            value = list()
            for filed in fileds.split(','):
                value.append(d[filed])
            values.append(value)

        sql = f"insert into {cls().column} ({fileds}) values ({s})"
        print(sql, values)
        try:
            ORM.db.insertmany(sql, values)
            msg = True
        except Exception as err:
            msg = False
            print(err)
        raise Return(msg)