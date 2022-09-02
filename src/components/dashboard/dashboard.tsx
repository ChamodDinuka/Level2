import React,{ useEffect, useState } from 'react'
import { Layout } from 'antd';
import './dashboard.css'
import Charts from './charts'
import Reservation from './reservation'
import Admin from './admin'
import Clients from './clients'

function Dashboard() {
    const { Sider, Content } = Layout;
    const [ tab, setTab ] = useState("dashboard")

    useEffect(()=>{
        setTab("Dashboard");
    },[])
    return (
        <Layout>
        <Sider>
            <ul>
                <li id="side" onClick={()=>setTab("Dashboard")}>Dashboard</li>
                <li id="side" onClick={()=>setTab("Clients")}>Clients</li>
                <li id="side" onClick={()=>setTab("Reservations")}>Reservations</li>
                <li id="side" onClick={()=>setTab("Admins")}>Admins</li>
            </ul>
        </Sider>
        <Content>
            {tab === "Dashboard" && <Charts/>}
            {tab === "Clients" && <Clients/>}
            {tab === "Reservations" && <Reservation/>}
            {tab === "Admins" && <Admin/>}
        </Content>
      </Layout>
  )
}

export default Dashboard