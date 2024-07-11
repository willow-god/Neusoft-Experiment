## 前端-后端交互

### 1. /video  POST

**描述**: 上传视频流数据和处理间隙（毫秒），后端处理后返回处理好的视频链接和统计数据。

**请求格式**:
- 请求方法: POST
- 请求头: Content-Type: multipart/form-data
- 请求体:
  - video: 视频文件 (文件类型)
  - interval: 处理间隙 (整数，单位: 毫秒)

**响应格式**:
- 响应头: Content-Type: application/json
- 响应体:
  ```json
  {
    "processed_video_url": "http://example.com/processed_video.mp4",
    "pedestrian_counts": [10, 20, 15],  // 每隔对应处理间隙抽帧，每个帧上人数数组
    "vehicle_counts": [5, 10, 7],  // 每隔对应处理间隙抽帧，每个帧上车数数组
    "pedestrians_per_interval": [3, 6, 5],  // 每个时间段内进行人通过量统计，并形成数组
    "vehicles_per_interval": [1, 4, 2]  // 每个时间段内进行车通过量统计，形成数组
  }
  ```

### 2. /video-streaming  POST

**描述**: 上传视频流数据和处理间隙（毫秒），后端按照时间间隙抽帧处理后逐帧发送数据。

**请求格式**:
- 请求方法: POST
- 请求头: Content-Type: multipart/form-data
- 请求体:
  - video: 视频文件 (文件类型)
  - interval: 处理间隙 (整数，单位: 毫秒)

**响应格式**:
- 响应头: Content-Type: application/json
- 响应体: (每一帧处理完后返回)
  ```json
  {
    "frame_base64": "data:image/jpeg;base64,...",  //当前帧处理后带锚点框的数据
    "people_count": 5,  // 当前帧的人数
    "vehicle_count": 3,  // 当前帧的车数
    "pedestrians_per_interval": 2,  // 当前处理间隙中通过人数
    "vehicles_per_interval": 1  // 当前处理间隙通过的车数
  }
  ```

### 3. /face-detect  POST

**描述**: 上传图片，后端对比后逐个返回包含图片直链的数组和时间戳。

**请求格式**:
- 请求方法: POST
- 请求头: Content-Type: multipart/form-data
- 请求体:
  - image: 图片文件 (文件类型)

**响应格式**:
- 响应头: Content-Type: application/json
- 响应体: (每找到一个结果后返回)
  ```json
  {
    "time": 12345, // 表示返回的图像在视频中对应的毫秒数
    "similar_face": "http://example.com/face1.jpg" // 永久链接
  }
  ```

### 4. /licence-plate  POST

**描述**: 上传车牌号，后端通过车牌号检索包含对应车牌的图像，并逐个返回包含图片直链和时间戳。

**请求格式**:
- 请求方法: POST
- 请求头: Content-Type: application/json
- 请求体:
  ```json
  {
    "licence_plate": "ABC123"
  }
  ```

**响应格式**:
- 响应头: Content-Type: application/json
- 响应体: (每找到一个结果后返回)
  ```json
  {
    "time": 12345,  // 表示返回的图像在视频中对应的毫秒数
    "car_image": "http://example.com/car1.jpg"  // 永久链接
  }
  ```

### 接口实现

以下是修改后的 Flask 代码示例：

```python
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import base64
import os

app = Flask(__name__)

@app.route('/video', methods=['POST'])
def process_video():
    video = request.files['video']
    interval = int(request.form['interval'])
    
    # 处理视频逻辑
    processed_video_url = "http://example.com/processed_video.mp4"
    pedestrian_counts = [10, 20, 15]
    vehicle_counts = [5, 10, 7]
    pedestrians_per_interval = [3, 6, 5]
    vehicles_per_interval = [1, 4, 2]
    
    return jsonify({
        "processed_video_url": processed_video_url,
        "pedestrian_counts": pedestrian_counts,
        "vehicle_counts": vehicle_counts,
        "pedestrians_per_interval": pedestrians_per_interval,
        "vehicles_per_interval": vehicles_per_interval
    })

@app.route('/video-streaming', methods=['POST'])
def process_video_streaming():
    video = request.files['video']
    interval = int(request.form['interval'])
    
    # 处理视频流逻辑，逐帧发送数据
    def generate():
        timestamp = 0
        while True:
            # 假设这里处理了一帧数据
            frame_base64 = base64.b64encode(b"dummy_frame_data").decode('utf-8')
            people_count = 5
            vehicle_count = 3
            pedestrians_per_interval = 2
            vehicles_per_interval = 1
            
            yield jsonify({
                "timestamp": timestamp,
                "frame_base64": "data:image/jpeg;base64," + frame_base64,
                "people_count": people_count,
                "vehicle_count": vehicle_count,
                "pedestrians_per_interval": pedestrians_per_interval,
                "vehicles_per_interval": vehicles_per_interval
            })
            timestamp += interval
    
    return app.response_class(generate(), mimetype='application/json')

@app.route('/face-detect', methods=['POST'])
def face_detect():
    image = request.files['image']
    filename = secure_filename(image.filename)
    image_path = os.path.join('/path/to/upload', filename)
    image.save(image_path)
    
    # 人脸检测逻辑
    def generate():
        timestamp = 0
        similar_faces = [
            "http://example.com/face1.jpg",
            "http://example.com/face2.jpg",
            "http://example.com/face3.jpg"
        ]
        for face in similar_faces:
            yield jsonify({"timestamp": timestamp, "similar_face": face})
            timestamp += 1000  # 假设每个结果间隔1秒
    
    return app.response_class(generate(), mimetype='application/json')

@app.route('/licence-plate', methods=['POST'])
def licence_plate():
    data = request.get_json()
    licence_plate = data['licence_plate']
    
    # 车牌号检索逻辑
    def generate():
        timestamp = 0
        car_images = [
            "http://example.com/car1.jpg",
            "http://example.com/car2.jpg",
            "http://example.com/car3.jpg"
        ]
        for image in car_images:
            yield jsonify({"timestamp": timestamp, "car_image": image})
            timestamp += 1000  # 假设每个结果间隔1秒
    
    return app.response_class(generate(), mimetype='application/json')

if __name__ == '__main__':
    app.run(debug=True)
```


## 后端-数据端交互

### 1. 查询人脸接口 (/search-face)

**描述**: 接收人脸特征向量，在 Elasticsearch 中进行相似人脸的查询。

**请求格式**:
- 请求方法: POST
- 请求头: Content-Type: application/json
- 请求体: 
  ```json
  {
    "face_vector": [0.1, 0.2, ... , 0.512]  # 512维的人脸特征向量
  }
  ```

**响应格式**:
- 响应头: Content-Type: application/json
- 响应体:
  ```json
  {
    "results": [
      {
        "pic": "http://example.com/face1.jpg",
        "time": "12:34"
      },
      ...
    ]
  }
  ```

### 2. 查询车牌接口 (/search-licence-plate)

**描述**: 接收车牌号，在 Elasticsearch 中进行车牌的查询。

**请求格式**:
- 请求方法: POST
- 请求头: Content-Type: application/json
- 请求体:
  ```json
  {
    "licence_plate": "ABC123"
  }
  ```

**响应格式**:
- 响应头: Content-Type: application/json
- 响应体:
  ```json
  {
    "results": [
      {
        "pic": "http://example.com/car1.jpg",
        "time": "12:34"
      },
      ...
    ]
  }
  ```

### 接口实现

以下是实现代码：

```python
from flask import Flask, request, jsonify
from elasticsearch import Elasticsearch

app = Flask(__name__)
es = Elasticsearch(['http://localhost:9200'])  # 根据你的 ES 实例修改地址

@app.route('/search-face', methods=['POST'])
def search_face():
    data = request.get_json()
    face_vector = data.get('face_vector')
    
    if not face_vector:
        return jsonify({"error": "Face vector is required"}), 400
    
    query = {
        "script_score": {
            "query": {"match_all": {}},
            "script": {
                "source": "cosineSimilarity(params.query_vector, 'face') + 1.0",
                "params": {"query_vector": face_vector}
            }
        }
    }
    
    try:
        response = es.search(index='your_index_name', body={"query": query})
        hits = response['hits']['hits']
        results = [{"pic": hit['_source']['pic'], "time": hit['_source']['time']} for hit in hits]
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search-licence-plate', methods=['POST'])
def search_licence_plate():
    data = request.get_json()
    licence_plate = data.get('licence_plate')
    
    if not licence_plate:
        return jsonify({"error": "Licence plate is required"}), 400
    
    query = {
        "match": {
            "lp": licence_plate
        }
    }
    
    try:
        response = es.search(index='your_index_name', body={"query": query})
        hits = response['hits']['hits']
        results = [{"pic": hit['_source']['pic'], "time": hit['_source']['time']} for hit in hits]
        return jsonify({"results": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
```

### 使用说明

1. **安装依赖**: 确保已安装 Flask 和 Elasticsearch 的 Python 客户端库。
2. **配置 Elasticsearch 地址**: 根据你的 ES 实例，修改 `Elasticsearch(['http://localhost:9200'])` 部分。
3. **启动 Flask 应用**: 运行 `python app.py` 启动 Flask 应用。
4. **测试接口**: 可以使用 Postman 或 curl 测试 `/search-face` 和 `/search-licence-plate` 接口，发送 POST 请求，包含相应的 JSON 请求体。

### 示例查询请求

使用 curl 测试 `/search-face`：

```bash
curl -X POST http://localhost:5000/search-face \
    -H "Content-Type: application/json" \
    -d '{
          "face_vector": [0.1, 0.2, ... , 0.512]
        }'
```

使用 curl 测试 `/search-licence-plate`：

```bash
curl -X POST http://localhost:5000/search-licence-plate \
    -H "Content-Type: application/json" \
    -d '{
          "licence_plate": "ABC123"
        }'
```

使用 Postman 发送类似的 JSON 请求体。