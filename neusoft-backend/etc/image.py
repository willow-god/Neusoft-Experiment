from flask import Flask, request, jsonify
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

# 设置上传文件存储的目录
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# 固定的永久链接数组
fixed_image_urls = [
    "https://s3-api.liushen.fun/qingyang/202407100002084_repeat_1720540929423__479271.webp",
    "https://s3-api.liushen.fun/qingyang/202407100002414_repeat_1720540962691__721687.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003655_repeat_1720540992883__366409.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003727_repeat_1720541011952__630737.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003918_repeat_1720541025143__902949.webp",
    "https://s3-api.liushen.fun/qingyang/202407100004320_repeat_1720541049541__761235.webp"
]

@app.route('/image', methods=['POST'])
def upload_image():
    # 检查请求中是否有文件
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    # 如果用户未选择文件，浏览器也会发送一个空的文件名
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    # 保存文件到上传文件夹
    filename = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(filename)

    # 返回固定的永久链接数组
    return jsonify({'image_urls': fixed_image_urls}), 200

if __name__ == '__main__':
    app.run(debug=True)
