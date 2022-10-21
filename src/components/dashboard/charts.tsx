import React, { useEffect, useState } from 'react'
import { Pie, Bar } from '@ant-design/plots';
import axios from 'axios'
import {Table} from 'antd'
import type { ColumnsType } from 'antd/es/table';

function Charts() {
    const [pieData, setPieData] = useState([])
    const [barData, setBarData] = useState([])
    const baseUrl = process.env.REACT_APP_BASE_URL

    interface DataType {
        label: string;
        type: string;
        value: number;
    }

    useEffect(() => {
        getData();
    }, [])
    const getData = async () => {
        await axios.get(`${baseUrl}/pie`)
            .then(response => {
                setPieData(response.data);
            }).catch(function (error) {
            });
            await axios.get(`${baseUrl}/bar`)
            .then(response => {
                setBarData(response.data);
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
        data: barData,
        isGroup: true,
        xField: 'value',
        yField: 'label',
        // color: ['#1383ab', '#c52125'],
        seriesField: 'type',
        marginRatio: 0,
    };
    const columns: ColumnsType<DataType> = [
        {
            title: 'Stylist',
            dataIndex: 'type',
            key: 'type',
            width: '50%',
        },
        {
            title: 'Number of reservations (Weekly)',
            dataIndex: 'value',
            key: 'value',
            width: '50%'
        }
    ];
    return (
        <>
            <Pie {...pie }/>
            <br/>
            <Bar {...bar} />
            <Table columns={columns} dataSource={barData} style={{padding:10}} pagination={{ defaultPageSize: 10}}/>
            
            </>
    )
}

export default Charts