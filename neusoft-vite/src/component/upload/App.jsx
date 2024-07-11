import React, { useState } from 'react';
import { message } from 'antd';
import Upload_File from './Upload_File';
import Button_Group from './Button_Group';

const App = () => {
    const [fileList, setFileList] = useState([]);
    const [uploadResult, setUploadResult] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const handleFileSelect = (file) => {
        setFileList([file]);
    };
    
    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.warning('请先选择文件');
            return;
        }

        const absolutePath = `E:/picture/幻灯片/${fileList[0].name}`;

        const requestData = {
            list: [absolutePath],
        };

        console.log('上传文件:', JSON.stringify(requestData));

        try {
            const response = await fetch('http://127.0.0.1:36677/upload?picbed=minio', {
                method: 'POST',
                body: JSON.stringify(requestData),
            });

            const result = await response.json();
            if (result.success) {
                const uploadedFile = {
                    name: fileList[0].name,
                    url: result.result[0], // 假设后端返回的永久路径
                };
                setUploadResult(prevResult => [...prevResult, uploadedFile]);

                message.success('文件上传成功');
            } else {
                message.error('文件上传失败');
            }
        } catch (error) {
            console.error('上传出错:', error);
            message.error('上传出错');
        }
    };

    const handleDetect = () => {
        // 检测逻辑
        message.info('检测按钮被点击');
    };

    const handleCancel = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setFileList([]);
        setIsModalVisible(false);
    };

    const handleCancelModal = () => {
        setIsModalVisible(false);
    };

    return (
        <div>
            <Upload_File onFileSelect={handleFileSelect} />
            <Button_Group
                fileList={fileList}
                handleUpload={handleUpload}
                handleDetect={handleDetect}
                handleCancel={handleCancel}
                isModalVisible={isModalVisible}
                handleOk={handleOk}
                handleCancelModal={handleCancelModal}
            />
            <div style={{ marginTop: '20px' }}>
                <h3>上传结果：</h3>
                <ul>
                    {uploadResult.map((file, index) => (
                        <li key={index}>
                            {file.name}: <a href={file.url}>{file.url}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default App;
