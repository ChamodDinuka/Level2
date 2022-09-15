import React,{ useEffect, useState } from 'react'
import { Layout, Drawer, Space, Button  } from 'antd';
import type { DrawerProps } from 'antd/es/drawer'
import './dashboard.css'
import Charts from './charts'
import Reservation from './reservation'
import Admin from './admin'
import Clients from './clients'
import Calendar from './calendar'

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
                <li id="side" onClick={()=>setTab("Dashboard")}>Dashboard</li>
                <li id="side" onClick={()=>setTab("Clients")}>Clients</li>
                <li id="side" onClick={()=>setTab("Reservations")}>Reservations</li>
                <li id="side" onClick={()=>setTab("Admins")}>Admins</li>
                <li id="side" onClick={()=>setTab("Calendar")}>Calendar</li>
            </ul>
        </Sider>:
        <></>}
        <Content >
            {tab === "Dashboard" && <Charts/>}
            {tab === "Clients" && <Clients/>}
            {tab === "Reservations" && <Reservation/>}
            {tab === "Admins" && <Admin/>}
            {tab === "Calendar" && <Calendar/>}
        </Content>
      </Layout>
      </>
  )
}

export default Dashboard