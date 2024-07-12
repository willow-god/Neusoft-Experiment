# 前端页面说明文档

## 项目结构

```
node_modules
public
  ├── vite.svg
src
  ├── assets
  │   └── react.svg
  ├── component
  │   ├── face
  │   │   └── app.jsx
  │   ├── licence
  │   │   └── app.jsx
  │   ├── statistics
  │   │   ├── App.jsx
  │   │   ├── Echart_Cloumn.jsx
  │   │   ├── EChart_line.jsx
  │   │   ├── Echart_Pie.jsx
  │   ├── team
  │   │   └── App.jsx
  │   ├── upload
  │   │   ├── App.jsx
  │   │   ├── button_group.jsx
  │   │   ├── upload_file.jsx
  │   ├── menu.jsx
  ├── css
  │   ├── face.css
  │   ├── licence.css
  │   ├── ...（每个页面对应一个）
  └── index.html
```

## 技术栈

- **React**: 用于构建用户界面的 JavaScript 库。
- **Vite**: 一个快速构建工具，用于开发和构建前端项目。
- **JSX**: 一种 JavaScript 的语法扩展，用于描述 UI 结构。
- **Ant Design**: 一个企业级的 UI 设计语言和 React 组件库。
- **ECharts**: 一个基于 JavaScript 的开源可视化图表库，用于数据展示。

## 详细介绍

### 1. public/vite.svg

包含 Vite 的标志文件，用于显示在页面上的 Vite logo。

### 2. src/assets/react.svg

包含 React 的标志文件，用于显示在页面上的 React logo。

### 3. src/component

#### 3.1 face/app.jsx

- **功能**: 处理和展示人脸检测相关的界面。
- **依赖**: Ant Design 组件库，接口 `/face-detect` 的调用。
- **样式**: 对应的样式文件为 `css/face.css`。

#### 3.2 licence/app.jsx

- **功能**: 处理和展示车牌识别相关的界面。
- **依赖**: Ant Design 组件库，接口 `/licence-plate` 的调用。
- **样式**: 对应的样式文件为 `css/licence.css`.

#### 3.3 statistics

- **App.jsx**: 统计页面的主组件，包含子组件 `Echart_Cloumn.jsx`, `EChart_line.jsx`, `Echart_Pie.jsx`。
- **Echart_Cloumn.jsx**: 展示柱状图的组件，使用 ECharts 库。
- **EChart_line.jsx**: 展示折线图的组件，使用 ECharts 库。
- **Echart_Pie.jsx**: 展示饼图的组件，使用 ECharts 库。
- **功能**: 处理和展示各类统计数据的图表。
- **依赖**: ECharts 库。

#### 3.4 team/App.jsx

- **功能**: 处理和展示团队信息的界面。
- **依赖**: Ant Design 组件库。
- **样式**: 对应的样式文件为 `css/team.css`。

#### 3.5 upload

- **App.jsx**: 上传页面的主组件，包含子组件 `button_group.jsx`, `upload_file.jsx`。
- **button_group.jsx**: 处理上传、检测、取消按钮的组件。
- **upload_file.jsx**: 处理文件上传的组件。
- **功能**: 提供文件上传和管理功能。
- **依赖**: Ant Design 组件库，接口 `/video`, `/video-m3u8`, `/video-streaming` 的调用。
- **样式**: 对应的样式文件为 `css/upload.css`。

#### 3.6 menu.jsx

- **功能**: 每个页面通用的菜单组件。
- **依赖**: Ant Design 组件库。
- **样式**: 每个页面都有其对应的样式文件。

### 4. css

每个页面都有对应的 CSS 文件，用于定义该页面的样式。

#### 示例

- `face.css`: 定义人脸检测页面的样式。
- `licence.css`: 定义车牌识别页面的样式。
- `upload.css`: 定义文件上传页面的样式。

### 5. index.html

- **功能**: 应用的入口 HTML 文件，定义了页面的基本结构。

## 使用说明

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建项目

```bash
npm run build
```