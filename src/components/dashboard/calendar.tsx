import React, { useState, useEffect } from 'react'
import type { BadgeProps } from 'antd';
import { Badge, Calendar } from 'antd';
import type { Moment } from 'moment';
import './chart.css'
import axios from 'axios'

function CalendarView() {
    const [reservations, setReservations] = useState<any[]>([])
    const baseUrl = process.env.REACT_APP_BASE_URL
    useEffect(() => {
        getReservation();
    }, [])
    const getReservation = async () => {
        await axios.get(`${baseUrl}/reservations`)
            .then(response => {
                setReservations(response.data);
            }).catch(function (error) {
            });
    }
    const getListData = (value: Moment) => {
        let listData: any[] = [];
        let tempData
        tempData = reservations.filter(data => data.date === value.format('YYYY-MM-DD'))
        {
            tempData && tempData.map((data: any) => {
                listData.push({ type: data['status'] === 'Scheduled' ? 'warning' : 'success', content: data['typeName'] })
            })
        }
        return listData! || [];
    };

    const getMonthData = (value: Moment) => {
        if (value.month() === 8) {
            return 1394;
        }
    };
    const monthCellRender = (value: Moment) => {
        const num = getMonthData(value);
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null;
    };

    const dateCellRender = (value: Moment) => {
        const listData = getListData(value);
        return (
            <ul className="events">
                {listData.map(item => (
                    <li key={item.content}>
                        <Badge status={item.type as BadgeProps['status']} text={item.content} />
                    </li>
                ))}
            </ul>
        );
    };
    return (
        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
    )
}

export default CalendarView