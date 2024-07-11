from flask import Flask, request, Response
import os
import cv2
import base64
import random
import time
from io import BytesIO
from PIL import Image
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

# 配置文件上传路径
UPLOAD_FOLDER = 'uploads/video-streaming'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def generate_frames(video_path, interval):
    cap = cv2.VideoCapture(video_path)
    frame_rate = cap.get(cv2.CAP_PROP_FPS)
    frame_interval = max(1, int(frame_rate * (interval / 1000.0)))  # 根据间隔计算抽帧间隔
    frame_count = 0

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break

        if frame_count % frame_interval == 0:
            # 处理当前帧
            _, buffer = cv2.imencode('.jpg', frame)
            frame_base64 = base64.b64encode(buffer).decode('utf-8')
            people_count = random.randint(20, 50)
            vehicle_count = random.randint(20, 50)
            pedestrians_per_interval = random.randint(20, 50)
            vehicles_per_interval = random.randint(20, 50)
            
            print(f"Frame {frame_count}: {people_count} people, {vehicle_count} vehicles")
            
            data = {
                "frame_base64": f"data:image/jpeg;base64,{frame_base64}",
                "people_count": people_count,
                "vehicle_count": vehicle_count,
                "pedestrians_per_interval": pedestrians_per_interval,
                "vehicles_per_interval": vehicles_per_interval
            }
            yield f"{json.dumps(data)}\n"
            time.sleep(1)  # 模拟处理时间间隔

        frame_count += 1

    cap.release()

@app.route('/video-streaming', methods=['POST'])
def video_streaming():
    video = request.files['video']
    interval = request.form.get('interval', default=250, type=int)

    video_filename = os.path.join(UPLOAD_FOLDER, video.filename)
    video.save(video_filename)

    return Response(generate_frames(video_filename, interval), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
