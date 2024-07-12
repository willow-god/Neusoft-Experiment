from flask import Flask, request, jsonify
import os
import random
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 配置文件上传路径
UPLOAD_FOLDER = 'uploads/video'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/video', methods=['POST'])
def process_video():
    # 获取视频文件和处理间隙
    video = request.files['video']
    interval = int(request.form['interval'])

    # 保存视频到本地
    video_filename = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_filename)

    # 模拟生成随机数据
    pedestrian_counts = [random.randint(20, 50) for _ in range(20)]
    vehicle_counts = [random.randint(20, 50) for _ in range(20)]
    pedestrians_per_interval = [random.randint(20, 50) for _ in range(20)]
    vehicles_per_interval = [random.randint(20, 50) for _ in range(20)]
    
    print("interval: ", interval)

    # 返回结果 https://s3-api.liushen.fun/qingyang/test.mp4：https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8
    return jsonify({
        "processed_video_url": "https://s3-api.liushen.fun/qingyang/video/video/index.m3u8",
        "pedestrian_counts": pedestrian_counts,
        "vehicle_counts": vehicle_counts,
        "pedestrians_per_interval": pedestrians_per_interval,
        "vehicles_per_interval": vehicles_per_interval
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
