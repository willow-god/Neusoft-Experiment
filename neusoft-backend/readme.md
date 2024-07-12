# 接口文档

本部分代码为测试接口代码，仅用于调试使用，数据为随机生成，不用于正式环境，并且本人不对其中任何直链做可连性保证，请自行替换，望周知！

## 文件结构

```
project/
│
├── main.py                        # 所有接口的入口文件，集中处理请求和路由
│
├── video.py                       # 视频处理相关接口，包含视频分析和统计功能
│
├── video-m3u8.py                 # M3U8 视频处理接口，处理视频并返回 M3U8 链接
│
├── uploads/                       # 上传文件存储目录
│   ├── video                      # 存放上传的视频文件
│   ├── image                      # 存放上传的图像文件
│   └── video-streaming            # 存放视频流处理的中间文件
│
└── etc/                           # 其他辅助文件或无效文件的存放目录
    └── invalid_files              # 存放无效文件的目录
```

## 结构说明

### `main.py`
- **描述**: 该文件是应用的入口，集中定义所有接口的路由和请求处理逻辑。

### `video.py`
- **描述**: 包含与视频处理相关的接口，如上传视频并返回统计数据。

### `video-m3u8.py`
- **描述**: 处理视频上传并返回 M3U8 链接的接口，适用于流式视频处理。

### `uploads/`
- **描述**: 存放用户上传文件的目录，便于管理和分类。

#### `uploads/video`
- **描述**: 专门存放上传的视频文件。

#### `uploads/image`
- **描述**: 存放上传的图像文件，主要用于人脸检测和车牌识别。

#### `uploads/video-streaming`
- **描述**: 存放视频流处理过程中生成的中间文件，支持实时处理。

### `etc/`
- **描述**: 用于存放其他辅助文件或无效文件，便于项目管理。

#### `etc/invalid_files`
- **描述**: 存放无效文件的目录，用于记录上传过程中出现的问题文件。

## 1. 视频处理接口

### 1.1 `/video`

- **功能**: 处理上传的视频文件，并返回处理好的视频链接及人流、车流统计数据。

- **请求方式**: `POST`

- **请求数据格式**:
  ```plaintext
  multipart/form-data
  ```
  | 字段名  | 类型   | 描述                |
  |-------|------|-------------------|
  | video | File | 上传的视频文件         |
  | interval | Integer | 处理时间间隔（毫秒） |

- **响应数据格式**:
  ```json
  {
      "processed_video_url": "https://s3-api.liushen.fun/qingyang/test.mp4",
      "pedestrian_counts": [20, 25, 30, ...],
      "vehicle_counts": [15, 20, 25, ...],
      "pedestrians_per_interval": [5, 10, 8, ...],
      "vehicles_per_interval": [2, 3, 1, ...]
  }
  ```

- **字段说明**:
  | 字段名                     | 类型     | 描述                             |
  |-------------------------|--------|--------------------------------|
  | processed_video_url     | String | 处理好的视频文件直链                  |
  | pedestrian_counts        | Array  | 人流数据，每个元素表示每个时间段的人数       |
  | vehicle_counts           | Array  | 车流数据，每个元素表示每个时间段的车辆数量    |
  | pedestrians_per_interval  | Array  | 每个时间间隔内通过的人数                   |
  | vehicles_per_interval     | Array  | 每个时间间隔内通过的车辆数量                 |

---

## 2. M3U8 视频处理接口

### 2.1 `/video-m3u8`

- **功能**: 处理上传的视频文件，并返回处理好的 M3U8 链接及人流、车流统计数据。

- **请求方式**: `POST`

- **请求数据格式**:
  ```plaintext
  multipart/form-data
  ```
  | 字段名  | 类型   | 描述                |
  |-------|------|-------------------|
  | video | File | 上传的视频文件         |
  | interval | Integer | 处理时间间隔（毫秒） |

- **响应数据格式**:
  ```json
  {
      "processed_video_url": "https://s3-api.liushen.fun/qingyang/video/video/index.m3u8",
      "pedestrian_counts": [20, 25, 30, ...],
      "vehicle_counts": [15, 20, 25, ...],
      "pedestrians_per_interval": [5, 10, 8, ...],
      "vehicles_per_interval": [2, 3, 1, ...]
  }
  ```

- **字段说明**:
  | 字段名                     | 类型     | 描述                             |
  |-------------------------|--------|--------------------------------|
  | processed_video_url     | String | 处理好的 M3U8 视频文件直链           |
  | pedestrian_counts        | Array  | 人流数据，每个元素表示每个时间段的人数       |
  | vehicle_counts           | Array  | 车流数据，每个元素表示每个时间段的车辆数量    |
  | pedestrians_per_interval  | Array  | 每个时间间隔内通过的人数                   |
  | vehicles_per_interval     | Array  | 每个时间间隔内通过的车辆数量                 |

---

## 3. 视频流处理接口

### 3.1 `/video-streaming`

- **功能**: 处理上传的视频文件并实时返回逐帧数据，包含人流、车流统计信息。

- **请求方式**: `POST`

- **请求数据格式**:
  ```plaintext
  multipart/form-data
  ```
  | 字段名  | 类型   | 描述                |
  |-------|------|-------------------|
  | video | File | 上传的视频文件         |
  | interval | Integer | 处理时间间隔（毫秒） |

- **响应数据格式**:
  ```
  text/event-stream
  ```
  每条数据格式如下:
  ```json
  {
      "frame_base64": "data:image/jpeg;base64,...",
      "people_count": 30,
      "vehicle_count": 25,
      "pedestrians_per_interval": 10,
      "vehicles_per_interval": 3
  }
  ```

- **字段说明**:
  | 字段名                     | 类型     | 描述                             |
  |-------------------------|--------|--------------------------------|
  | frame_base64            | String | 当前帧的图像的 Base64 编码字符串      |
  | people_count            | Integer | 当前帧的人数                       |
  | vehicle_count           | Integer | 当前帧的车辆数量                     |
  | pedestrians_per_interval  | Integer | 当前时间段内通过的人数                 |
  | vehicles_per_interval     | Integer | 当前时间段内通过的车辆数量              |

---

## 4. 人脸检测接口

### 4.1 `/face-detect`

- **功能**: 处理上传的人脸图像并返回多组相似人脸链接及对应时间戳。

- **请求方式**: `POST`

- **请求数据格式**:
  ```plaintext
  multipart/form-data
  ```
  | 字段名  | 类型   | 描述                |
  |-------|------|-------------------|
  | image | File | 上传的人脸图像         |

- **响应数据格式**:
  ```
  text/event-stream
  ```
  每条数据格式如下:
  ```json
  {
      "time": 12345,
      "similar_face": "https://example.com/image.jpg",
      "distance": 0.75
  }
  ```

- **字段说明**:
  | 字段名                     | 类型     | 描述                             |
  |-------------------------|--------|--------------------------------|
  | time                    | Integer | 与图像相关的时间戳                   |
  | similar_face            | String | 相似人脸的图像链接                  |
  | distance                | Float  | 用于计算置信度的距离（值越小越相似） |

---

## 5. 车牌识别接口

### 5.1 `/licence-plate`

- **功能**: 处理上传的图像，并返回多组与车牌号相关的图像链接及对应时间戳。

- **请求方式**: `POST`

- **请求数据格式**:
  ```json
  {
      "licence_plate": "ABC123"
  }
  ```

- **响应数据格式**:
  ```
  text/event-stream
  ```
  每条数据格式如下:
  ```json
  {
      "time": 12345,
      "car_image": "https://example.com/car.jpg",
      "licence_plate": "ABC123"
  }
  ```

- **字段说明**:
  | 字段名                     | 类型     | 描述                             |
  |-------------------------|--------|--------------------------------|
  | time                    | Integer | 与车牌相关的时间戳                   |
  | car_image               | String | 相关车牌图像的链接                  |
  | licence_plate           | String | 随机生成的车牌号                    |

---