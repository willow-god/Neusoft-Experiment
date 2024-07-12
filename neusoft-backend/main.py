from flask import Flask, request, Response, jsonify
import os
import random
import time
import json
import cv2
import base64
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 配置文件上传路径
UPLOAD_FOLDER_VIDEO = 'uploads/video'
UPLOAD_FOLDER_VIDEO_STREAMING = 'uploads/video-streaming'
UPLOAD_FOLDER_IMAGES = 'uploads/images'
os.makedirs(UPLOAD_FOLDER_VIDEO, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_VIDEO_STREAMING, exist_ok=True)
os.makedirs(UPLOAD_FOLDER_IMAGES, exist_ok=True)

# 模拟相似人脸链接和时间戳
SIMILAR_FACES = [
    "https://s3-api.liushen.fun/qingyang/202407100002084_repeat_1720540929423__479271.webp",
    "https://s3-api.liushen.fun/qingyang/202407100002414_repeat_1720540962691__721687.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003655_repeat_1720540992883__366409.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003727_repeat_1720541011952__630737.webp",
    "https://s3-api.liushen.fun/qingyang/202407100003918_repeat_1720541025143__902949.webp",
    "https://s3-api.liushen.fun/qingyang/202407100004320_repeat_1720541049541__761235.webp"
]

# ================================= 基本参数 ==========================================

# 视频处理函数
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
    return

# 数据上传接口
@app.route('/data-upload', methods=['POST'])
def data_upload():
    if 'video' not in request.files or 'category' not in request.form:
        return jsonify({'status': 'error', 'message': 'No video or category provided'}), 400

    video = request.files['video']
    category = request.form['category']

    if video.filename == '':
        return jsonify({'status': 'error', 'message': 'No selected video'}), 400

    # 保存视频文件到本地
    video_path = os.path.join(UPLOAD_FOLDER_DATA, video.filename)
    video.save(video_path)

    # 启动新线程处理视频
    threading.Thread(target=process_video, args=(video_path, category)).start()

    print("视频上传成功！")
    return jsonify({'status': 'success', 'message': 'Video uploaded successfully', 'category': category}), 200


# ===========================================================================

# 模拟包含车牌号的图像链接
CAR_IMAGES = SIMILAR_FACES;

# 视频处理接口
@app.route('/video', methods=['POST'])
def process_video():
    """处理视频并返回统计数据"""
    video = request.files['video']
    interval = int(request.form['interval'])

    # 保存视频到本地
    video_filename = os.path.join(UPLOAD_FOLDER_VIDEO, video.filename)
    video.save(video_filename)

    # 模拟生成随机数据
    pedestrian_counts = [random.randint(20, 50) for _ in range(20)]
    vehicle_counts = [random.randint(20, 50) for _ in range(20)]
    pedestrians_per_interval = [random.randint(20, 50) for _ in range(20)]
    vehicles_per_interval = [random.randint(20, 50) for _ in range(20)]

    return jsonify({
        "processed_video_url": "https://s3-api.liushen.fun/qingyang/test.mp4",
        "pedestrian_counts": pedestrian_counts,
        "vehicle_counts": vehicle_counts,
        "pedestrians_per_interval": pedestrians_per_interval,
        "vehicles_per_interval": vehicles_per_interval
    })

# ==============================================================================

# M3U8视频处理接口
@app.route('/video-m3u8', methods=['POST'])
def process_video_m3u8():
    """处理视频并返回M3U8链接及统计数据"""
    video = request.files['video']
    interval = int(request.form['interval'])

    # 保存视频到本地
    video_filename = os.path.join(UPLOAD_FOLDER_VIDEO, video.filename)
    video.save(video_filename)

    return jsonify({
        "processed_video_url": "https://s3-api.liushen.fun/qingyang/video/video/index.m3u8",
        "pedestrian_counts": [random.randint(20, 50) for _ in range(20)],
        "vehicle_counts": [random.randint(20, 50) for _ in range(20)],
        "pedestrians_per_interval": [random.randint(20, 50) for _ in range(20)],
        "vehicles_per_interval": [random.randint(20, 50) for _ in range(20)]
    })

# 视频流处理接口
def generate_frames(video_path, interval):
    """生成视频帧并返回相关统计数据"""
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

# ============================================================================================

@app.route('/video-streaming', methods=['POST'])
def video_streaming():
    """处理视频流并返回逐帧数据"""
    video = request.files['video']
    interval = request.form.get('interval', default=250, type=int)

    video_filename = os.path.join(UPLOAD_FOLDER_VIDEO_STREAMING, video.filename)
    video.save(video_filename)

    return Response(generate_frames(video_filename, interval), content_type='text/event-stream')

# 人脸检测接口
def generate_similar_faces(image_path):
    """生成与输入图像相似的人脸链接"""
    for link in SIMILAR_FACES:
        time_stamp = random.randint(0, 100000)
        data = {
            "time": time_stamp,
            "similar_face": link,
            "distance": random.uniform(0.1, 0.9)
        }
        yield f"{json.dumps(data)}\n"
        time.sleep(1)  # 模拟处理时间间隔

# ==============================================================================

@app.route('/face-detect', methods=['POST'])
def face_detect():
    """处理人脸图像并返回相似人脸链接"""
    image = request.files['image']

    # 保存图片到本地
    image_filename = os.path.join(UPLOAD_FOLDER_IMAGES, image.filename)
    image.save(image_filename)

    return Response(generate_similar_faces(image_filename), content_type='text/event-stream')

# 车牌识别接口
def generate_car_images(licence_plate):
    """根据车牌号生成相关车牌图像链接"""
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

# ======================================================================================

@app.route('/licence-plate', methods=['POST'])
def licence_plate():
    """处理车牌号请求并返回车牌图像链接"""
    data = request.get_json()
    licence_plate = data.get('licence_plate')

    if not licence_plate:
        return jsonify({"error": "licence_plate is required"}), 400

    return Response(generate_car_images(licence_plate), content_type='text/event-stream')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
