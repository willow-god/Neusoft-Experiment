import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { message, Upload, Select, Button } from 'antd';
import '/src/css/data-upload.css';

const { Dragger } = Upload;

const App = () => {
    const [fileList, setFileList] = useState([]);
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (value) => {
        setCategory(value);
    };

    const uploadProps = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            setFileList([file]);
            return false; // 阻止默认上传行为
        },
        onRemove: () => {
            setFileList([]);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const handleUpload = async () => {
        if (fileList.length === 0 || !category) {
            message.error('请先选择文件和类别');
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('video', fileList[0]);
        formData.append('category', category);

        try {
            const response = await fetch('http://10.81.196.67:5000/data-upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();

            if (data.status === 'success') {
                message.success('上传成功');
                console.log('上传成功');
            } else {
                message.error(`上传失败: ${data.message}`);
            }
        } catch (error) {
            message.error('上传失败');
            console.error('上传失败', error);
        } finally {
            setLoading(false);
            setFileList([]);
            setCategory('');
        }
    };

    return (
        <div className='upload-main'>
            <div className='upload-container'>
                <Dragger {...uploadProps} fileList={fileList}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">点击或者拖动文件到此处进行上传</p>
                    <p className="ant-upload-hint">
                        仅支持单文件上传，视频格式为mp4等常用数据格式
                    </p>
                </Dragger>
            </div>
            <div className='upload-button'>
                <Select
                    defaultValue="点击选择数据源"
                    className='upload-select'
                    style={{
                        width: '100%',
                    }}
                    onChange={handleChange}
                    options={[
                        {
                            label: <span>车辆数据</span>,
                            title: 'car',
                            options: [{ label: <span>上传车牌数据源</span>, value: 'car' }],
                        },
                        {
                            label: <span>人脸数据</span>,
                            title: 'person',
                            options: [{ label: <span>上传人脸数据源</span>, value: 'person', }],
                        },
                    ]}
                />
                <Button className='data-upload-button' type="primary" onClick={handleUpload} loading={loading}>点击上传数据源</Button>
            </div>
        </div>
    );
};

export default App;
