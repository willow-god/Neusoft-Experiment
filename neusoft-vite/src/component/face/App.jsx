import React, { useState, useEffect } from 'react';
import { message, Select, Card, Upload, Image, Button } from 'antd';
import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import '/src/css/face.css';

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
    const [uploadFile, setUploadFile] = useState(null); // 保存上传的图像文件
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

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
    };

    const handleChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
        if (newFileList.length > 0) {
            setUploadFile(newFileList[0].originFileObj);
        } else {
            setUploadFile(null);
        }
    };

    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('您只能上传 JPG/PNG 文件!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片大小必须小于 2MB!');
        }
        setFileList([file]);
        return isJpgOrPng && isLt2M;
    };

    const customRequest = ({ file, onSuccess }) => {
        // 阻止默认上传行为
        onSuccess("ok");
    };

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

    const searchProcess = () => {
        if (!uploadFile) {
            message.error('请上传图片');
            return;
        }

        if (!selectedVideo) {
            message.error('请选择数据来源');
            return;
        }

        setLoadings(true);

        const formData = new FormData();
        formData.append('image', uploadFile);
        const videoInfo = JSON.parse(selectedVideo);
        formData.append('sourceFileName', videoInfo.fileName);
        formData.append('sourceUploadTime', videoInfo.uploadTime);

        setPictures([]);

        fetch('http://localhost:5000/face-detect', {
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
    };

    return (
        <div>
            <div className='search'>
                <div className='face_button'>
                    <Upload
                        listType="picture"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                        beforeUpload={beforeUpload}
                        customRequest={customRequest}
                    >
                        <Button icon={<UploadOutlined />}>上传人脸</Button>
                    </Upload>
                    <Select
                        className='face_select'
                        showSearch
                        placeholder="选择数据来源"
                        optionFilterProp="label"
                        filterSort={(optionA, optionB) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        options={videoOptions}
                        onChange={value => setSelectedVideo(value)}
                    />
                    <Button
                        className='face_button_search'
                        type="primary"
                        onClick={searchProcess}
                        loading={loadings}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        点击查询
                    </Button>
                </div>
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
                    <Card className='face_card' key={index} >
                        <div className='face_pic' >
                            <Image
                                src={item.similar_face}
                                alt='similar_face'
                            />
                        </div>
                        <p>时间：{item.time}</p>
                        <p>相似度：{((1 - item.distance) * 100).toFixed(2)}%</p>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default App;
