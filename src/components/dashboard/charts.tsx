import React, { useEffect, useState } from 'react'
import { Pie, Bar } from '@ant-design/plots';
import axios from 'axios'

function Charts() {
    const [pieData,setPieData] = useState([])
    const [barData,setBarData] = useState([])
    // const data = [
    //     {
    //         type: 'Hair cut',
    //         value: 27,
    //     },
    //     {
    //         type: 'Hair coloring',
    //         value: 25,
    //     },
    //     {
    //         type: 'Tattoo',
    //         value: 18,
    //     },
    //     {
    //         type: 'Nail Polish',
    //         value: 15,
    //     },
    //     {
    //         type: 'Make up',
    //         value: 10,
    //     },
    //     {
    //         type: 'Tattoo',
    //         value: 5,
    //     },
    // ];
    const dataBar = [
        {
            label: 'Mon.',
            type: 'series1',
            value: 2800,
        },
        {
            label: 'Mon.',
            type: 'series2',
            value: 2260,
        },
        {
            label: 'Tues.',
            type: 'series1',
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
    useEffect(()=>{
        getData();
    },[])
    const getData=async()=>{
        await axios.get('http://localhost:5000/pie')
            .then(response => {
                setPieData(response.data);
                console.log(response.data)
            }).catch(function (error) {
            });
    }
    // const pie = {
    //     appendPadding: 10,
    //     data : pieData,
    //     angleField: 'value',
    //     colorField: 'type',
    //     radius: 0.9,
    //     label: {
    //         type: 'inner',
    //         offset: '-30%',
    //         content: (percent:any) => `${(percent * 100).toFixed(0)}%`,
    //         style: {
    //             fontSize: 14,
    //             textAlign: 'center',
    //         },
    //     },
    //     interactions: [
    //         {
    //             type: 'element-active',
    //         },
    //     ],
    // };
    const pie = {
        appendPadding: 10,
        data :pieData,
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
        <div className="main_chart">
            <Pie {...pie} />
            <Bar {...bar} />
        </div>
    )
}

export default Charts