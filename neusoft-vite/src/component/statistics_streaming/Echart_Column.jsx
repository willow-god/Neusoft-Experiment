import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Echart_Column = ({ pedestrianData, vehicleData }) => {
    const chartRef = useRef(null);
    let chartInstance = null; // 用于存储 ECharts 实例的引用

    useEffect(() => {
        if (chartRef.current) {
            // 初始化 ECharts 实例
            chartInstance = echarts.init(chartRef.current);

            // 数据处理，将 pedestrianData 和 vehicleData 合并成一组数据
            const data = [
                ...pedestrianData.map(item => ({ time: item.time, value: item.count, type: 'Pedestrian' })),
                ...vehicleData.map(item => ({ time: item.time, value: item.count, type: 'Vehicle' })),
            ];

            const option = {
                title: {
                    text: '人车通过数量统计',
                },
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data: ['Pedestrian', 'Vehicle'],
                },
                xAxis: {
                    type: 'category',
                    data: [...new Set(data.map(item => item.time))],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: 'Pedestrian',
                        type: 'bar',
                        data: data.filter(item => item.type === 'Pedestrian').map(item => item.value),
                    },
                    {
                        name: 'Vehicle',
                        type: 'bar',
                        data: data.filter(item => item.type === 'Vehicle').map(item => item.value),
                    },
                ],
            };

            // 设置图表配置项
            chartInstance.setOption(option);

            // 使用 ResizeObserver 监听容器大小变化
            const resizeObserver = new ResizeObserver(() => {
                chartInstance.resize();
            });

            resizeObserver.observe(chartRef.current);

            // 当组件销毁时取消监听
            return () => {
                // if (resizeObserver && chartRef.current) {
                //     resizeObserver.unobserve(chartRef.current);
                // }
                // chartInstance.dispose();
            };
        }
    }, [pedestrianData, vehicleData]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%', padding: '20px'}} />;
};

export default Echart_Column;
