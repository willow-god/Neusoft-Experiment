from flask import Flask, request, Response, jsonify
import os
import time
import random
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 配置文件上传路径
UPLOAD_FOLDER = 'uploads/images'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# 模拟相似人脸链接和时间戳
SIMILAR_FACES = [
    "https://s3-api.liushen.fun/qingyang/202407100002084_repeat_1720540929423__479271.webp",
    "https://s3-api.liushen.fun/qingyang/202407100002414_repeat_1720540962691__721687.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003655_repeat_1720540992883__366409.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003727_repeat_1720541011952__630737.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003918_repeat_1720541025143__902949.webp",
    "https://s3-api.liushen.fun/qingyang/202407100004320_repeat_1720541049541__761235.webp"
]

def generate_similar_faces(image_path):
    # 处理文件
    print("Processing image: ", image_path)
    
    for link in SIMILAR_FACES:
        time_stamp = random.randint(0, 100000)
        data = {
            "time": time_stamp,
            "similar_face": link
        }
        yield f"{json.dumps(data)}\n"
        time.sleep(1)  # 模拟处理时间间隔

@app.route('/face-detect', methods=['POST'])
def face_detect():
    image = request.files['image']

    # 保存图片到本地
    image_filename = os.path.join(UPLOAD_FOLDER, image.filename)
    image.save(image_filename)

    return Response(generate_similar_faces(image_filename), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
