import React, { useState, useEffect } from 'react';
import { Space, Table, Button, message, Tag } from 'antd';
import axios from 'axios';

const statusMap = {
    1: { text: '处理成功', color: 'green' },
    0: { text: '正在处理', color: 'blue' },
    '-1': { text: '处理失败', color: 'red' },
};

const categoryMap = {
    'person': { text: '车牌数据', color: 'purple' },
    'car': { text: '人脸数据', color: 'orange' },
};

const columns = (handleDelete) => [
    {
        title: '上传时间',
        dataIndex: 'upload_time',
        key: 'upload_time',
    },
    {
        title: '文件名称',
        dataIndex: 'file_name',
        key: 'file_name',
    },
    {
        title: '数据类别',
        dataIndex: 'category',
        key: 'category',
        render: (category) => {
            const { text, color } = categoryMap[category];
            return <Tag color={color}>{text}</Tag>;
        },
    },
    {
        title: '处理状态',
        dataIndex: 'processing_status',
        key: 'processing_status',
        render: (status) => {
            const { text, color } = statusMap[status];
            return <Tag color={color}>{text}</Tag>;
        },
    },
    {
        title: '操作',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <Button danger onClick={() => handleDelete(record.upload_time, record.file_name)}>
                    删除
                </Button>
            </Space>
        ),
    },
];

const App = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/get_videos_info');
            setData(response.data);
        } catch (error) {
            message.error('获取数据失败');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (upload_time, file_name) => {
        try {
            await axios.post('http://localhost:5000/delete_video_data', { upload_time, file_name });
            message.success('删除成功');
            fetchData();
        } catch (error) {
            message.error('删除失败');
        }
    };

    return (
        <>
            <Table columns={columns(handleDelete)} dataSource={data} rowKey="upload_time" loading={loading} />
        </>
    );
};

export default App;
