from flask import Flask, request, Response, jsonify
import time
import random
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 模拟包含车牌号的图像链接和时间戳
CAR_IMAGES = [
    "https://s3-api.liushen.fun/qingyang/202407100002084_repeat_1720540929423__479271.webp",
    "https://s3-api.liushen.fun/qingyang/202407100002414_repeat_1720540962691__721687.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003655_repeat_1720540992883__366409.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003727_repeat_1720541011952__630737.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003918_repeat_1720541025143__902949.webp",
    "https://s3-api.liushen.fun/qingyang/202407100004320_repeat_1720541049541__761235.webp"
]

def generate_car_images(licence_plate):
    # 处理车牌号
    print("Processing licence plate: ", licence_plate)
    
    for link in CAR_IMAGES:
        time_stamp = random.randint(0, 100000)
        # 随机生成六位车牌号
        licence_plate = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', k=6))
        data = {
            "time": time_stamp,
            "car_image": link,
            "licence_plate": licence_plate
        }
        yield f"{json.dumps(data)}\n"
        time.sleep(1)  # 模拟处理时间间隔

@app.route('/licence-plate', methods=['POST'])
def licence_plate():
    licence_plate = request.form.get('licence_plate')
    print(f"licence_plate: {licence_plate}")
    
    # 获取来源文件名称
    source_file_name = request.form.get('sourceFileName')
    print(f"Source File Name: {source_file_name}")

    # 获取来源文件上传时间
    source_upload_time = request.form.get('sourceUploadTime')
    print(f"Source Upload Time: {source_upload_time}")

    if not licence_plate:
        return jsonify({"error": "licence_plate is required"}), 400

    return Response(generate_car_images(licence_plate), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
