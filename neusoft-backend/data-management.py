import pymysql
from flask import Flask, jsonify, request
from datetime import datetime
from flask_cors import CORS
import time

# 数据库配置
DB_HOST = 'your host'
DB_PORT = 3306
DB_USER = 'Neusoft'
DB_PASSWORD = 'Neusoft'
DB_NAME = 'Neusoft'

# 创建 Flask 应用
app = Flask(__name__)
CORS(app)

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
        processing_status INT,
        category ENUM('car', 'person') NOT NULL
    )
    """
    with connection.cursor() as cursor:
        cursor.execute(create_table_sql)
    connection.commit()

# 添加数据
def add_data(upload_time, file_name, processing_status, category):
    connection = connect_db()
    if connection:
        create_table_if_not_exists(connection)
        insert_sql = """
        INSERT INTO video_info (upload_time, file_name, processing_status, category)
        VALUES (%s, %s, %s, %s)
        """
        with connection.cursor() as cursor:
            cursor.execute(insert_sql, (upload_time, file_name, processing_status, category))
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
            result = cursor.execute(update_sql, (new_status, upload_time))
        connection.commit()
        connection.close()

        if result:
            return True
        else:
            return False
    else:
        return False

# 删除数据
def delete_data(upload_time):
    connection = connect_db()
    if connection:
        delete_sql = """
        DELETE FROM video_info WHERE upload_time = %s
        """
        with connection.cursor() as cursor:
            result = cursor.execute(delete_sql, (upload_time,))
        connection.commit()
        connection.close()

        if result:
            return True
        else:
            return False
    else:
        return False

# 获取所有视频信息
@app.route('/get_videos_info', methods=['GET'])
def get_videos():
    connection = connect_db()
    if connection:
        select_sql = "SELECT upload_time, file_name, processing_status, category FROM video_info"
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(select_sql)
            videos = cursor.fetchall()
        connection.close()
        return jsonify(videos)
    else:
        return jsonify({"error": "无法连接到数据库"}), 500

# 删除视频信息
@app.route('/delete_video_data', methods=['POST'])
def delete_video():
    data = request.get_json()
    upload_time = data.get('upload_time')
    file_name = data.get('file_name')
    
    print(file_name)

    if not upload_time:
        return jsonify({"error": "缺少必要的参数: upload_time"}), 400
    
    # 将前端传来的时间字符串转换为MySQL的TIMESTAMP格式
    try:
        upload_time = datetime.strptime(upload_time, '%a, %d %b %Y %H:%M:%S GMT')
    except ValueError:
        return jsonify({"error": "时间格式错误"}), 400

    result = delete_data(upload_time)
    if result:
        return jsonify({"message": "删除成功"})
    else:
        return jsonify({"error": "找不到对应的数据或无法连接到数据库"}), 404

# 运行 Flask 应用
if __name__ == '__main__':
    # app.run(host='0.0.0.0', port=5000)
    time_now = datetime.now()
    add_data(time_now, 'person1.mp4', 1, 'person')
    time.sleep(1)
    time_now = datetime.now()
    add_data(time_now, 'person2.mp4', 0, 'person')
    time.sleep(1)
    time_now = datetime.now()
    add_data(time_now, 'person3.mp4', -1, 'person')
    
