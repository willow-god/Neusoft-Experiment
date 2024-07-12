from flask import Flask, request, jsonify
import os
from flask_cors import CORS
import threading
import time

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads/data'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def process_video(video_path, category):
    # 根据类别进行处理（这里暂时只打印类别）
    if category == 'car':
        print('处理车车视频')
        print('视频路径：', video_path)
        time.sleep(5) #=========================================处理车车代码写在这里
        print("视频处理完成！")
    elif category == 'person':
        print('处理姐姐视频')
        print('视频路径：', video_path)
        time.sleep(5) #=========================================处理姐姐代码写在这里
        print("视频处理完成！")
    else:
        print('类别不对劲')
        print("视频处理失败！")
    return;

@app.route('/data-upload', methods=['POST'])
def data_upload():
    if 'video' not in request.files or 'category' not in request.form:
        return jsonify({'status': 'error', 'message': 'No video or category provided'}), 400

    video = request.files['video']
    category = request.form['category']

    if video.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected video'}), 400

    # 保存视频文件到本地
    video_path = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_path)

    # 启动新线程处理视频
    threading.Thread(target=process_video, args=(video_path, category)).start()

    print("视频上传成功！")
    return jsonify({'status': 'success', 'message': 'Video uploaded successfully', 'category': category}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
