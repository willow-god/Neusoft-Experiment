import React, { useState, useEffect } from 'react';
import { Input, message, Card, Image, Space, Select } from 'antd';
const { Search } = Input;
import '/src/css/licence.css';

const App = () => {
    const [pictures, setPictures] = useState([]);
    const [loadings, setLoadings] = useState(false);
    const [videoOptions, setVideoOptions] = useState([]); // 下拉框选项
    const [selectedVideo, setSelectedVideo] = useState(null); // 选择的视频

    useEffect(() => {
        fetch('http://127.0.0.1:5000/get_videos_info')
            .then(response => response.json())
            .then(data => {
                const personVideos = data.filter(item => item.category === 'person' && item.processing_status === 1);
                const options = personVideos.map(video => ({
                    value: JSON.stringify({ fileName: video.file_name, uploadTime: video.upload_time }),
                    label: video.file_name,
                }));
                setVideoOptions(options);
            })
            .catch(error => {
                console.error('获取视频信息出错:', error);
                message.error('获取视频信息失败');
            });
    }, []);

    const searchProcess = (value) => {
        if (value === '') {
            message.error('请输入车牌号');
            return;
        }

        if (!selectedVideo) {
            message.error('请选择数据来源');
            return;
        }

        setLoadings(true);

        console.log("搜索内容：", value);
        setPictures([]);

        const formData = new FormData();
        formData.append('licence_plate', value);
        const videoInfo = JSON.parse(selectedVideo);
        formData.append('sourceFileName', videoInfo.fileName);
        formData.append('sourceUploadTime', videoInfo.uploadTime);

        fetch('http://localhost:5000/licence-plate', {
            method: 'POST',
            body: formData,
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
            }).finally(() => {
                setLoadings(false);
            });
    }

    const formatTime = (timestamp) => {
        const date = new Date(timestamp * 1000); // 将秒转换为毫秒
        const hours = date.getHours().toString().padStart(2, '0'); // 获取小时，并保证两位数显示
        const minutes = date.getMinutes().toString().padStart(2, '0'); // 获取分钟，并保证两位数显示
        return `${hours}:${minutes}`;
    };

    return (
        <div>
            <div className='search' style={{ width: 800, margin: 10 }}>
                <Space.Compact>
                    <Select
                        defaultValue="请选择视频来源"
                        options={videoOptions}
                        showSearch
                        style={{ width: 200, height: 39.42 }}
                        onChange={value => setSelectedVideo(value)}
                    />
                    <Search
                        placeholder="请输入车牌号"
                        enterButton="嗖嗖嗖搜索"
                        size="large"
                        onSearch={searchProcess}
                        loading={loadings}
                    />
                </Space.Compact>
            </div>
            <div className='pictures'>
                {pictures.map((item, index) => (
                    <Card className='licence_card' key={index} >
                        <div className='licence_pic' >
                            <Image
                                src={item.car_image}
                                alt='car_licence'
                            />
                        </div>
                        <p>时间：{item.time}</p>
                        <p>车牌：{item.licence_plate}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default App;