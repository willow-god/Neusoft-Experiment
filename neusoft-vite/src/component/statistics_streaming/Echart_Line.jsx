import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const Echart_Line = ({ pedestrianData, vehicleData }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            const chart = echarts.init(chartRef.current);

            // 数据处理，将 pedestrianData 和 vehicleData 合并成一组数据
            const data = [
                ...pedestrianData.map(item => ({ time: item.time, value: item.count, type: 'Pedestrian' })),
                ...vehicleData.map(item => ({ time: item.time, value: item.count, type: 'Vehicle' })),
            ];

            const option = {
                title: {
                    text: '人流车流数据统计',
                },
                tooltip: {
                    trigger: 'axis',
                },
                legend: {
                    data: ['Pedestrian', 'Vehicle'],
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: [...new Set(data.map(item => item.time))],
                },
                yAxis: {
                    type: 'value',
                },
                series: [
                    {
                        name: 'Pedestrian',
                        type: 'line',
                        data: data.filter(item => item.type === 'Pedestrian').map(item => item.value),
                    },
                    {
                        name: 'Vehicle',
                        type: 'line',
                        data: data.filter(item => item.type === 'Vehicle').map(item => item.value),
                    },
                ],
            };

            chart.setOption(option);

            // 当组件销毁时销毁图表实例
            return () => {
                // chart.dispose();
            };
        }
    }, [pedestrianData, vehicleData]);

    return <div ref={chartRef} style={{ width: '100%', height: '100%', padding: '20px'}} />;
};

export default Echart_Line;