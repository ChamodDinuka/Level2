import React, { useEffect, useState } from 'react'
import { Pie, Bar } from '@ant-design/plots';
import axios from 'axios'

function Charts() {
    const [pieData, setPieData] = useState([])
    const [barData, setBarData] = useState([])

    const dataBar = [
        {
            label: 'Mon.',
            type: 'kalpana',
            value: 2800,
        },
        {
            label: 'Mon.',
            type: 'series2',
            value: 2260,
        },
        {
            label: 'Tues.',
            type: 'kalpana',
            value: 1800,
        },
        {
            label: 'Tues.',
            type: 'series2',
            value: 1300,
        },
        {
            label: 'Wed.',
            type: 'series1',
            value: 950,
        },
        {
            label: 'Wed.',
            type: 'series2',
            value: 900,
        },
        {
            label: 'Thur.',
            type: 'series1',
            value: 500,
        },
        {
            label: 'Thur.',
            type: 'series2',
            value: 390,
        },
        {
            label: 'Fri.',
            type: 'series1',
            value: 170,
        },
        {
            label: 'Fri.',
            type: 'series2',
            value: 100,
        },
    ];
    useEffect(() => {
        getData();
    }, [])
    const getData = async () => {
        await axios.get('http://localhost:5000/pie')
            .then(response => {
                setPieData(response.data);
                console.log(response.data)
            }).catch(function (error) {
            });
    }
    const pie = {
        appendPadding: 10,
        data: pieData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'outer',
        },
        interactions: [
            {
                type: 'element-active'
            },
        ],
    };
    const bar = {
        appendPadding: 10,
        data: dataBar,
        isGroup: true,
        xField: 'value',
        yField: 'label',
        // color: ['#1383ab', '#c52125'],
        seriesField: 'type',
        marginRatio: 0,
    };
    return (
        <>
            <Pie {...pie } />
            <Bar {...bar} />
            </>
    )
}

export default Charts