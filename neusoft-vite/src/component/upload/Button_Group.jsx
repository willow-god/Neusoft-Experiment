import React from 'react';
import { Button, Modal, message, Flex } from 'antd';

const Button_Group = ({ fileList, handleUpload, handleDetect, handleCancel, isModalVisible, handleOk, handleCancelModal }) => {
    return (
        <div style={{marginTop:'20px'}}>
            <Flex
                vertical
                gap="small"
                style={{
                width: '100%',
                }}
            >
            <Button className='upload' type="primary" block onClick={() => handleUpload(fileList)}>
                上传
            </Button>
            <Button className='detect' type="primary" block onClick={handleDetect}>
                检测
            </Button>
            <Button className='cancel' block onClick={handleCancel}>
                取消
            </Button>
            <Modal
                title="确认取消"
                open={isModalVisible}
                onOk={handleOk}
                onCancel={handleCancelModal}
                okText="确认"
                cancelText="取消"
            >
                <p>你确定要删除所有已选择的文件吗？</p>
            </Modal>
            </Flex>
        </div>
    );
};

export default Button_Group;
