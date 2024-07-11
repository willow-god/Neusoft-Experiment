import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Upload_App from './component/upload/App.jsx'
import Statistics_Streaming_App from './component/statistics_streaming/App.jsx'
import Licence_App from './component/licence/App.jsx'
import Face_App from './component/face/App.jsx'
import Statistic_App from './component/statistics/App.jsx'
import Menu from './component/menu.jsx'
import './css/upload.css'
import { Space } from 'antd'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

const Router = createBrowserRouter([
  {
    path: "/",
    element:
      <div className="container">
        <div className="container-menu">
          <Menu />
        </div>
        <div className='content'>
          <div>
            <header>
              <h1>欢迎来到我们的项目 🌟</h1>
            </header>
            <main>
              <section>
                <h2>项目介绍</h2>
                <p>我们的项目旨在利用现代技术处理视频数据，并从中提取有价值的信息。</p>
                <p>具体功能包括：</p>
                <ul>
                  <li>实时数据分析和统计，包括人流和车流量。</li>
                  <li>根据车牌号识别并提取车辆图像。</li>
                  <li>通过输入人头图像，找到相似的人头图像。</li>
                </ul>
              </section>
              <section>
                <h2>技术栈</h2>
                <p>我们使用了以下技术来实现项目的各个部分：</p>
                <ul>
                  <li>数据存储：MinIO</li>
                  <li>数据处理：Python YOLOv5</li>
                  <li>数据管理：Elasticsearch</li>
                  <li>前端开发：Vite + React.js</li>
                  <li>UI组件库：Ant Design</li>
                </ul>
              </section>
              <section>
                <h2>开始探索</h2>
                <p>请通过菜单或页面上的按钮开始使用我们的功能！</p>
              </section>
            </main>
            <footer>
              <p>感谢您的光临！✨</p>
            </footer>
          </div>
        </div>
      </div>
    ,
  },
  {
    path: "/upload",
    element:
      <div className="container">
        <div className="container-menu">
          <Menu />
        </div>
        <div className='content'>
          <h2>🤩🤩🤩上传文件到Minio</h2>
          <h3>请先选择文件，然后点击上传按钮，将在下面显示输出结果。
            注意，仅支持一个视频</h3>
          <Space
            direction="vertical"
            size="middle"
            style={{
              display: 'flex',
            }}
          >
            <Upload_App />
          </Space>
        </div>
      </div>,
  },
  {
    path: "/licence-plate",
    element:
      <div className="container">
        <div className="container-menu">
          <Menu />
        </div>
        <div className='content'>
          <h2>🤩🤩🤩车牌检索</h2>
          <h3>你可以输入车牌并检索，我们将进行匹配并输出结果</h3>
          <Licence_App />
        </div>
      </div>,
  },
  {
    path: "/face-recognition",
    element:
      <div className="container">
        <div className="container-menu">
          <Menu />
        </div>
        <div className='content'>
          <h2>🤩🤩🤩人脸识别</h2>
          <h3>你可以上传一张人脸，我们将进行相似度搜索并展示所有结果</h3>
          <Face_App />
        </div>
      </div>,
  },
  {
    path: "/statistics",
    element:
      <div className="container">
        <div className="container-menu">
          <Menu />
        </div>
        <div className='content'>
          <h2>🤩🤩🤩普通检测</h2>
          <h3>上传一个视频，处理后将在下方直接生成数据！</h3>
          <Statistic_App />
        </div>
      </div>,
  },
  {
    path: "/statistics-streaming",
    element:
      <div className="container">
        <div className="container-menu">
          <Menu />
        </div>
        <div className='content'>
          <h2>🤩🤩🤩流式检测</h2>
          <h3>上传一个视频，在处理过程中将逐步呈现数据！</h3>
          <Statistics_Streaming_App />
        </div>
      </div>,
  },
]);


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={Router} />
  </React.StrictMode>,
)
