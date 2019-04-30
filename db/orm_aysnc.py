import tormysql
import pymysql.cursors
from tornado.gen import coroutine, Return
import config


class ORM:
    """数据库接口类"""
    host = config.mydb["host"]
    user = config.mydb["user"]
    password = config.mydb["password"]
    dbbase = config.mydb["dbname"]
    pool = tormysql.ConnectionPool(
        # max_connections=100,  # max open connections
        max_connections=500,  # max open connections
        idle_seconds=7500,  # conntion idle timeout time, 0 is not timeout
        wait_connection_timeout=3,  # wait connection timeout
        host=host,
        user=user,
        passwd=password,
        db=dbbase,
        charset="utf8",
        cursorclass=pymysql.cursors.DictCursor  # 获取的是字典形式， 没有这句获取的是元组
    )

    def __init__(self, column):
        self.column = column

    @classmethod
    @coroutine
    def get(cls, sets=list(), where=list()):
        with (yield ORM.pool.Connection()) as conn:
            fields = ''
            for field in sets:
                fields += field
                fields += ","
            fields = fields[0:-1]
            value = where[1]
            if isinstance(value, str):
                value = "'" + value + "'"
            sql = f"select {fields} from {cls().column} where {where[0]}={value}"
            try:
                with conn.cursor() as cursor:
                    yield cursor.execute(sql)
                    datas = cursor.fetchall()
            except:
                yield conn.rollback()
            else:
                yield conn.commit()
                raise Return(datas)
        yield ORM.pool.close()

    @classmethod
    @coroutine
    def delete(cls, *args):
        """删除函数"""
        with (yield ORM.pool.Connection()) as conn:
            s = ''
            for d in args:
                for field, value in d.items():
                    if isinstance(value, str):
                        s += f'{field}="{value}"'
                    else:
                        s += f'{field}={value}'
                    s += ' or '
            s = s[0:-4]
            sql = f"delete from {cls().column} where " + s
            try:
                with conn.cursor() as cursor:
                    yield cursor.execute(sql)
            except:
                yield conn.rollback()
                raise Return(False)
            else:
                yield conn.commit()
                raise Return(True)
        yield ORM.pool.close()

    @classmethod
    @coroutine
    def update(cls, sets=list(), where=list()):
        """更新数据,传入列表[field, values]"""
        with (yield ORM.pool.Connection()) as conn:
            set_field = sets[0]
            where_field = where[0]
            if isinstance(where[1], str):
                s = f'"{where[1]}"'
            else:
                s = where[1]
            if isinstance(where[1], str):
                k = f'"{sets[1]}"'
            else:
                k = sets[1]
            sql = f"update {cls().column} set {set_field}=" + k + f" where {where_field}="+s
            try:
                with conn.cursor() as cursor:
                    yield cursor.execute(sql)
            except:
                yield conn.rollback()
                raise Return(False)
            else:
                yield conn.commit()
                raise Return(True)
        yield ORM.pool.close()

    @classmethod
    @coroutine
    def insert(cls, **kwargs):
        """更新数据,传入{field1:values1,field2:values2....}"""
        with (yield ORM.pool.Connection()) as conn:
            fileds = ''
            values = list()
            for key, value in kwargs.items():
                fileds += key
                fileds += ','
                values.append(value)
            fileds = fileds[0:-1]
            values = tuple(values)
            sql = f"insert into {cls().column} ({fileds}) values {values}"
            try:
                with conn.cursor() as cursor:
                    yield cursor.execute(sql)
            except:
                yield conn.rollback()
                raise Return(False)
            else:
                yield conn.commit()
                raise Return(True)
        yield ORM.pool.close()
