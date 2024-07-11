import React, { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Upload, message, Input } from 'antd';
import Echart_Line from './Echart_Line';
import Echart_Column from './Echart_Column';
import '/src/css/statistic.css';

const App = () => {
    const [videoFile, setVideoFile] = useState(null);
    const [videoURL, setVideoURL] = useState(null);
    const [pedestrianCount, setPedestrianCount] = useState([]);
    const [vehicleCount, setVehicleCount] = useState([]);
    const [pedestriansPerInterval, setPedestriansPerInterval] = useState([]);
    const [vehiclesPerInterval, setVehiclesPerInterval] = useState([]);
    const [interval, setInterval] = useState(250);
    const [loadings, setLoadings] = useState(false);

    const uploadProps = {
        fileList: videoFile ? [videoFile] : [],
        customRequest: ({ file, onSuccess, onError }) => {
            setVideoFile(file);
            // setVideoURL(URL.createObjectURL(file));
            onSuccess(null, file);
            message.success('视频上传成功');
        },
        showUploadList: true,
    };

    const handleProcess = () => {
        if (!videoFile) {
            message.error('请先上传视频！');
            return;
        }

        setLoadings(true);

        const formData = new FormData();
        formData.append('video', videoFile);
        formData.append('interval', interval);

        fetch('http://192.168.6.118:5000/video', {
            method: 'POST',
            body: formData,
        })
            .then((response) => response.json())
            .then((data) => {
                const pedestrianCounts = data.pedestrian_counts.slice(-30).map((count, index) => ({ time: index, count }));
                const vehicleCounts = data.vehicle_counts.slice(-30).map((count, index) => ({ time: index, count }));
                setPedestrianCount(pedestrianCounts);
                setVehicleCount(vehicleCounts);
                setVideoURL(data.processed_video_url);
                setPedestriansPerInterval(data.pedestrians_per_interval.slice(-30).map((count, index) => ({ time: index, count })));
                setVehiclesPerInterval(data.vehicles_per_interval.slice(-30).map((count, index) => ({ time: index, count })));
                message.success('处理成功！');
            })
            .catch((error) => {
                console.error('错误:', error);
                message.error('处理失败！');
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
            
            <div className='VideoBodyUp'>
                <div className='radiusBox' style={{ width: '492px', height: '275px', border: '1px solid #d9d9d9', marginTop: '16px' }}>
                    {videoURL ? (
                        <video className='radiusBox' width="100%" controls autoPlay>
                            <source src={videoURL} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#aaa' }}>
                            视频展示区域，请先上传视频
                        </div>
                    )}
                </div>
                <div className='radiusBox' style={{ width: '787px', height: '275px', border: '1px solid #d9d9d9', marginTop: '16px' }}>
                    <Echart_Column pedestrianData={pedestriansPerInterval} vehicleData={vehiclesPerInterval} />
                </div>
            </div>
            <div className='radiusBox' style={{ width: '1300px', height: '330px', border: '1px solid #d9d9d9', marginTop: '16px' }}>
                <Echart_Line pedestrianData={pedestrianCount} vehicleData={vehicleCount} />
            </div>
        </div>
    );
};

export default App;