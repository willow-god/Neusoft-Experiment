import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, Input } from 'antd';
import Echart_Line from './Echart_Line';
import Echart_Column from './Echart_Column';
import Echart_Pie from './Echart_Pie';
import '/src/css/statistic_streaming.css';

const App = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState(null);
    const [processedFrameURL, setProcessedFrameURL] = useState(null);
    const [pedestrianCount, setPedestrianCount] = useState([]);
    const [vehicleCount, setVehicleCount] = useState([]);
    const [pedestriansPerInterval, setPedestriansPerInterval] = useState([]);
    const [vehiclesPerInterval, setVehiclesPerInterval] = useState([]);
    const [interval, setInterval] = useState(250);
    const [loadings, setLoadings] = useState(false);
    let globalVariable = 0;

    const uploadProps = {
        fileList: videoFile ? [videoFile] : [],
        customRequest: ({ file, onSuccess, onError }) => {
            setVideoFile(file);
            setVideoURL(URL.createObjectURL(file));
            onSuccess(null, file);
            message.success('上传成功');
        },
        showUploadList: true,
    };

    const handleProcess = () => {
        if (!videoFile) {
            message.error('请先上传视频');
            return;
        }

        setLoadings(true);

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('interval', interval);

        fetch('http://localhost:5000/video-streaming', {
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
                                        setPedestrianCount(prevData => [...prevData, { time: globalVariable, count: data.people_count }]);
                                        setVehicleCount(prevData => [...prevData, { time: globalVariable, count: data.vehicle_count }]);
                                        setPedestriansPerInterval(prevData => [...prevData, { time: globalVariable, count: data.pedestrians_per_interval }]);
                                        setVehiclesPerInterval(prevData => [...prevData, { time: globalVariable, count: data.vehicles_per_interval }]);
                                        setProcessedFrameURL(data.frame_base64);
                                        globalVariable += 1;
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
            })
            .catch(error => {
                console.error('请求出错:', error);
                message.error('处理失败');
            }).finally(() => {
                setLoadings(false);
            });
    };

    return (
        <div>
            <div className='UploadVideo'>
                <Upload {...uploadProps}>
                    <Button icon={<UploadOutlined />}>上传视频</Button>
                </Upload>
                <Input
                    addonBefore="处理间隔"
                    addonAfter="毫秒(ms)"
                    value={interval}
                    onChange={(e) => setInterval(Number(e.target.value))}
                />
                <Button type="primary" onClick={handleProcess} loading={loadings}>开始处理</Button>
            </div>
            <div className='VideoBodyUp-stream'>
                <div className='radiusBox' style={{ width: '350px', height: '200px', border: '1px solid #d9d9d9', marginTop: '16px' }}>
                    {videoURL ? (
                        <video className='radiusBox' width="100%" controls autoPlay>
                            <source src={videoURL} type="video/mp4" />
                            您的浏览器不支持视频标签。
                        </video>
                    ) : (
                        <div className='radiusBox' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#aaa' }}>
                            视频展示区域，请先上传视频
                        </div>
                    )}
                </div>
                <div className='radiusBox current_frame' style={{ width: '350px', height: '200px', border: '1px solid #d9d9d9', marginTop: '16px' }}>
                    {processedFrameURL ? (
                        <img className='radiusBox' src={processedFrameURL} alt="Processed frame" style={{ width: '100%', height: '100%' }} />
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#aaa' }}>
                            处理帧展示区域
                        </div>
                    )}
                </div>
                <div className='radiusBox' style={{ width: '560px', height: '200px', border: '1px solid #d9d9d9', marginTop: '16px' }}>
                    <Echart_Pie pedestrianData={pedestrianCount} vehicleData={vehicleCount} />
                </div>
            </div>
            <div className='VideoBodyDown-stream'>
                <div className='radiusBox' style={{ width: '100%', height: '500px', border: '1px solid #d9d9d9', marginTop: '16px' }}>
                    <Echart_Column pedestrianData={pedestrianCount} vehicleData={vehicleCount} />
                </div>
                <div className='radiusBox' style={{ width: '100%', height: '500px', border: '1px solid #d9d9d9', marginTop: '16px' }}>
                    <Echart_Line pedestrianData={pedestriansPerInterval} vehicleData={vehiclesPerInterval} />
                </div>
            </div>

        </div>
    );
};

export default App;
