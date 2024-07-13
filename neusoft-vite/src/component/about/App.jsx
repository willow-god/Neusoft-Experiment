import React from 'react';

const About = () => (
    <div>
        <h1>🚀 关于我们</h1>
        <p>
            我们的团队专注于前后端开发，致力于提供高效、稳定和创新的解决方案。以下是我们的技术栈和工具：
        </p>

        <h2>操作系统 🖥️</h2>
        <ul>
            <li>Windows 10 / 11：大多数开发人员使用的操作系统。</li>
            <li>Ubuntu 20.04：用于服务器部署和部分开发人员使用的操作系统。</li>
        </ul>

        <h2>编程语言 💻</h2>
        <ul>
            <li>Python 3.8：主要用于后端开发和算法实现。</li>
            <li>JavaScript (ES6+)：用于前端开发。</li>
        </ul>

        <h2>开发工具 🛠️</h2>
        <ul>
            <li>Visual Studio Code：主要的代码编辑器，支持丰富的插件，适用于 Python 和 JavaScript 开发。</li>
            <li>PyCharm：用于 Python 开发的 IDE，提供强大的代码编辑和调试功能。</li>
            <li>WebStorm：用于 JavaScript 和前端开发的 IDE，提供强大的代码编辑和调试功能。</li>
            <li>Git：版本控制工具，用于代码的版本管理和协作开发。</li>
            <li>Docker：容器化工具，用于构建和部署应用程序，确保开发环境和生产环境的一致性。</li>
        </ul>

        <h2>前端技术栈 🌐</h2>
        <ul>
            <li>React：用于构建用户界面的 JavaScript 库。</li>
            <li>Vite：一个快速的前端构建工具，用于开发和构建前端项目。</li>
            <li>JSX：JavaScript 的语法扩展，用于描述 UI 结构。</li>
            <li>Ant Design：企业级的 UI 设计语言和 React 组件库。</li>
            <li>ECharts：基于 JavaScript 的开源可视化图表库，用于数据展示。</li>
        </ul>

        <h2>后端技术栈 🔧</h2>
        <ul>
            <li>Flask：轻量级的 Python web 框架，用于开发后端 API。</li>
            <li>SQLAlchemy：Python 的 SQL 工具包和对象关系映射（ORM）库，用于数据库操作。</li>
            <li>Elasticsearch：分布式搜索和分析引擎，用于存储和搜索大规模数据。</li>
            <li>MinIO：高性能的对象存储服务，用于存储视频文件和大数据对象。</li>
        </ul>

        <h2>数据库 📊</h2>
        <ul>
            <li>MySQL：关系型数据库管理系统，用于存储结构化数据。</li>
            <li>Elasticsearch：用于存储和搜索视频分析的元数据。</li>
            <li>MinIO：用于存储视频文件和图像数据。</li>
        </ul>

        <h2>算法和库 🧠</h2>
        <ul>
            <li>YOLOv5：目标检测算法，用于人车检测和车牌识别。</li>
            <li>DeepSORT：多目标跟踪算法，用于人车流量跟踪和计数。</li>
            <li>Mediapipe：快速的人脸检测库。</li>
            <li>Dlib：用于人脸编码和特征提取的库。</li>
        </ul>

        <h2>其他工具 🛠️</h2>
        <ul>
            <li>Postman：API 调试工具，用于测试和调试后端 API。</li>
            <li>Jupyter Notebook：交互式开发工具，用于数据分析和算法开发。</li>
            <li>Nginx：高性能的 Web 服务器和反向代理服务器，用于前后端服务的负载均衡和代理。</li>
        </ul>
    </div>
);

export default About;
