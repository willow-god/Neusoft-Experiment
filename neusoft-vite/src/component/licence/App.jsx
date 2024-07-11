import React, { useState } from 'react';
import { Input, message, Card, Image } from 'antd';
const { Search } = Input;
import '/src/css/licence.css';

const App = () => {
    const [pictures, setPictures] = useState([]);
    const searchProcess = (value) => {
        if (value === '') {
            message.error('请输入车牌号');
            return;
        }
        console.log("搜索内容：", value);
        setPictures([]);

        fetch('http://192.168.69.169:5000/licence-plate', {
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
                <Search
                    placeholder="请输入车牌号"
                    enterButton="嗖嗖嗖搜索"
                    size="large"
                    onSearch={searchProcess}
                />
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