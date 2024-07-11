import React, { useState } from 'react';
import { Input, message, Card, Upload, Image } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
const { Search } = Input;
import '/src/css/licence.css';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

const App = () => {
    const [pictures, setPictures] = useState([]);
    const [previewImage, setPreviewImage] = useState(''); // 预览图片的 URL
    const [previewOpen, setPreviewOpen] = useState(false); // 是否打开预览图片
    const [fileList, setFileList] = useState([]); // 上传的文件列表

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const uploadButton = (
        <button
            style={{
                border: 0,
                background: 'none',
            }}
            type="button"
        >
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                点击上传
            </div>
        </button>
    );

    const searchProcess = (value) => {
        if (value === '') {
            message.error('请输入车牌号');
            return;
        }
        console.log("搜索内容：", value);
        setPictures([]);

        fetch('http://localhost:5000/licence-plate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ licence_plate: value }),
        })
            .then(response => {
                if (response.ok) {
                    const reader = response.body.getReader();
                    let decoder = new TextDecoder('utf-8');
                    let buffer = '';

                    function read() {
                        reader.read().then(({ done, value }) => {
                            if (done) {
                                console.log('处理完成');
                                return;
                            }

                            buffer += decoder.decode(value, { stream: true });

                            let boundary = buffer.indexOf('\n');
                            while (boundary !== -1) {
                                const chunk = buffer.slice(0, boundary).trim();
                                buffer = buffer.slice(boundary + 1);

                                if (chunk) {
                                    try {
                                        const data = JSON.parse(chunk);
                                        setPictures(prevPictures => [...prevPictures, data]);
                                    } catch (error) {
                                        console.error('解析 JSON 出错:', error);
                                    }
                                }

                                boundary = buffer.indexOf('\n');
                            }

                            read();
                        }).catch(error => {
                            console.error('读取流数据出错:', error);
                        });
                    }
                    read();
                } else {
                    message.error('处理失败');
                }
            }).catch(error => {
                console.error('请求出错:', error);
                message.error('处理失败');
            });
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000); // 将秒转换为毫秒
        const hours = date.getHours().toString().padStart(2, '0'); // 获取小时，并保证两位数显示
        const minutes = date.getMinutes().toString().padStart(2, '0'); // 获取分钟，并保证两位数显示
        return `${hours}:${minutes}`;
    };

    return (
        <div>
            <div className='search' style={{ width: 800, margin: 10 }}>
                <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={handlePreview}
                    onChange={handleChange}
                >
                    {fileList.length >= 1 ? null : uploadButton}
                </Upload>
                {previewImage && (
                    <Image
                        wrapperStyle={{
                            display: 'none',
                        }}
                        preview={{
                            visible: previewOpen,
                            onVisibleChange: (visible) => setPreviewOpen(visible),
                            afterOpenChange: (visible) => !visible && setPreviewImage(''),
                        }}
                        src={previewImage}
                    />
                )}
            </div>
            <div className='pictures'>
                {pictures.map((item, index) => (
                    <Card key={index} style={{ width: 302, height: 320, margin: 10 }}>
                        <div style={{ height: 220, borderBottom: "2px solid #ccc", paddingBottom: 20, alignItems: 'center', justifyContent: 'center' }}>
                            <img src={item.car_image} alt="车辆图片" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                        </div>
                        <p>时间：{formatTime(item.time)}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default App;