import React,{ useEffect, useState } from 'react'
import { Layout} from 'antd';
import './dashboard.css'
import Charts from './charts'
import Reservation from './reservation'
import Admin from './admin'
import Clients from './clients'
import EventCalendar from './eventCalender'
import {CustomerServiceOutlined, LineChartOutlined, UsergroupAddOutlined, UserAddOutlined, CalendarOutlined} from '@ant-design/icons'

function Dashboard() {
    const { Sider, Content } = Layout;
    const [ tab, setTab ] = useState("dashboard")
    const [isDesktop, setDesktop] = useState(window.innerWidth > 770);

    useEffect(()=>{
        setTab("Dashboard");
    },[])
    const updateMedia = () => {
        setDesktop(window.innerWidth > 770);
      };
      useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
      });
    return (
        <>
        <Layout>
            {isDesktop ?
        <Sider>
            <ul>
                <li id="side" onClick={()=>setTab("Dashboard")}><LineChartOutlined /> Dashboard</li>
                <li id="side" onClick={()=>setTab("Clients")}><UsergroupAddOutlined /> Clients</li>
                <li id="side" onClick={()=>setTab("Reservations")}><CustomerServiceOutlined /> Reservations</li>
                <li id="side" onClick={()=>setTab("Admins")}><UserAddOutlined /> Admins</li>
                <li id="side" onClick={()=>setTab("Calendar")}><CalendarOutlined /> Calendar</li>
            </ul>
        </Sider>:
        <></>}
        <Content >
            {tab === "Dashboard" && <Charts/>}
            {tab === "Clients" && <Clients/>}
            {tab === "Reservations" && <Reservation/>}
            {tab === "Admins" && <Admin/>}
            {tab === "Calendar" && <EventCalendar/>}
        </Content>
      </Layout>
      </>
  )
}

export default Dashboard