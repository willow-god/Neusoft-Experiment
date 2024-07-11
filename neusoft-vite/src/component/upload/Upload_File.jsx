import React from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Upload } from 'antd';

const { Dragger } = Upload;

const Upload_File = ({ onFileSelect }) => {
    const props = {
        name: 'file',
        multiple: false,
        beforeUpload: (file) => {
            onFileSelect(file);
            console.log('beforeUpload', file);
            return false; // 阻止自动上传
        },
        // onDrop(e) {
        //     console.log('Dropped files', e.dataTransfer.files);
        // },
    };

    return (
        <div>
            <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">点击或者拖动文件进行上传</p>
                <p className="ant-upload-hint">
                    支持单文件上传。严格禁止上传公司数据或其他被禁止的文件。
                </p>
            </Dragger>
        </div>
    );
};

export default Upload_File;
