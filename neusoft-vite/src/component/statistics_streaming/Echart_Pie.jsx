import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Echart_Pie = ({ pedestrianData, vehicleData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const chartInstance = echarts.init(chartRef.current);

            console.log('Pedestrian Data:', pedestrianData);
            console.log('Vehicle Data:', vehicleData);

            // 确保数据数组不为空
            if (pedestrianData.length > 0 && vehicleData.length > 0) {
                const option = {
                    title: {
                        text: '人和车实时数据',
                        left: 'center'
                    },
                    tooltip: {
                        trigger: 'item'
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left'
                    },
                    series: [
                        {
                            name: '数量',
                            type: 'pie',
                            radius: '50%',
                            data: [
                                { value: pedestrianData[pedestrianData.length - 1].count, name: '人' },
                                { value: vehicleData[vehicleData.length - 1].count, name: '车' }
                            ],
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                };

                chartInstance.setOption(option);
            }

            // 清理函数
            return () => {
                // chartInstance.dispose();
            };
        }
    }, [pedestrianData, vehicleData]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%', padding: '20px'}} />;
};

export default Echart_Pie;
