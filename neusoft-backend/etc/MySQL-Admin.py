import pymysql
from datetime import datetime

# 数据库配置
DB_HOST = 'your host'
DB_PORT = 3306
DB_USER = 'Neusoft'
DB_PASSWORD = 'Neusoft'
DB_NAME = 'Neusoft'

# 连接数据库
def connect_db():
    try:
        connection = pymysql.connect(
            host=DB_HOST,
            port=DB_PORT,
            user=DB_USER,
            password=DB_PASSWORD,
            database=DB_NAME
        )
        return connection
    except pymysql.MySQLError as e:
        print(f"连接数据库失败: {e}")
        return None

# 创建表格
def create_table_if_not_exists(connection):
    create_table_sql = """
    CREATE TABLE IF NOT EXISTS video_info (
        id INT AUTO_INCREMENT PRIMARY KEY,
        upload_time TIMESTAMP,
        file_name VARCHAR(255),
        video_length INT,
        processing_status INT
    )
    """
    with connection.cursor() as cursor:
        cursor.execute(create_table_sql)
    connection.commit()

# 添加数据
def add_data(upload_time, file_name, video_length, processing_status):
    connection = connect_db()
    if connection:
        create_table_if_not_exists(connection)
        insert_sql = """
        INSERT INTO video_info (upload_time, file_name, video_length, processing_status)
        VALUES (%s, %s, %s, %s)
        """
        with connection.cursor() as cursor:
            cursor.execute(insert_sql, (upload_time, file_name, video_length, processing_status))
        connection.commit()
        connection.close()

# 修改数据
def update_data(upload_time, new_status):
    connection = connect_db()
    if connection:
        update_sql = """
        UPDATE video_info SET processing_status = %s WHERE upload_time = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(update_sql, (new_status, upload_time))
        connection.commit()
        connection.close()
    else:
        print("表不存在或连接失败")

# 删除数据
def delete_data(upload_time):
    connection = connect_db()
    if connection:
        delete_sql = """
        DELETE FROM video_info WHERE upload_time = %s
        """
        with connection.cursor() as cursor:
            cursor.execute(delete_sql, (upload_time,))
        connection.commit()
        connection.close()
    else:
        print("表不存在或连接失败")

# 测试数据库连接
def test_db_connection():
    connection = connect_db()
    if connection:
        print("数据库连接成功")
        connection.close()
    else:
        print("数据库连接失败")

# 测试代码
if __name__ == "__main__":
    test_db_connection()
    
    data_now = datetime.now()
    
    print(data_now)

    # 添加数据示例
    add_data(data_now, '测试视频2.mp4', 179, 0)

    # # 修改数据示例
    # # 使用添加数据时的时间戳
    # update_data(data_now, 1)

    # # 删除数据示例
    # # 使用添加数据时的时间戳
    # delete_data(data_now)
