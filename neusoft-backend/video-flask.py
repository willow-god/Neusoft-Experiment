from flask import Flask, request, Response, jsonify
import os
import random
from flask_cors import CORS
import cv2

app = Flask(__name__)
CORS(app)

# 配置文件上传路径
UPLOAD_FOLDER = 'uploads/video'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def generate_video_stream(video_path):
    cap = cv2.VideoCapture(video_path)
    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        _, buffer = cv2.imencode('.jpg', frame)
        frame = buffer.tobytes()
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')

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

    # 返回视频流和统计数据
    response = {
        "pedestrian_counts": pedestrian_counts,
        "vehicle_counts": vehicle_counts,
        "pedestrians_per_interval": pedestrians_per_interval,
        "vehicles_per_interval": vehicles_per_interval
    }

    # 视频流部分
    def generate():
        yield b'--json\r\n'
        yield b'Content-Type: application/json\r\n\r\n'
        yield bytes(jsonify(response).get_data()) + b'\r\n'
        for frame in generate_video_stream(video_filename):
            yield frame

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
