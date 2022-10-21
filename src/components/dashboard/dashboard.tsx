import React, { useEffect, useState } from 'react'
import { Layout, Collapse } from 'antd';
import './dashboard.css'
import Charts from './charts'
import Reservation from './reservation'
import Admin from './admin'
import Clients from './clients'
import EventCalendar from './eventCalender'
import Profile from './profile'
import Credentials from './credentials'
import { CustomerServiceOutlined, DownOutlined, RightOutlined,InfoCircleOutlined, SettingOutlined, UserOutlined, LineChartOutlined, UsergroupAddOutlined, UserAddOutlined, CalendarOutlined } from '@ant-design/icons'

const { Panel } = Collapse;

function Dashboard() {
    const { Sider, Content } = Layout;
    const [tab, setTab] = useState("dashboard")
    const [isDesktop, setDesktop] = useState(window.innerWidth > 770);
    const [clicked, setClicked] = useState(false)

    useEffect(() => {
        setTab("Dashboard");
    }, [])
    const updateMedia = () => {
        setDesktop(window.innerWidth > 770);
    };
    useEffect(() => {
        window.addEventListener("resize", updateMedia);
        return () => window.removeEventListener("resize", updateMedia);
    });
    function createMarkup() {
        return (<><UserOutlined /> Account {clicked ?<DownOutlined  style={{"float":'right',"marginTop":4}} /> :<RightOutlined  style={{"float":'right',"marginTop":4}} />}</>);
   }
   const changeIcon=()=>{
    clicked ? setClicked(false):setClicked(true)
   }
    return (
        <>
            <Layout>
                {isDesktop ?
                    <Sider>
                        <ul>
                            <li id="side" onClick={() => setTab("Dashboard")}><LineChartOutlined /> Dashboard</li>
                            <li id="side" onClick={() => setTab("Clients")}><UsergroupAddOutlined /> Clients</li>
                            <li id="side" onClick={() => setTab("Reservations")}><CustomerServiceOutlined /> Reservations</li>
                            <li id="side" onClick={() => setTab("Admins")}><UserAddOutlined /> Admins</li>
                            <li id="side" onClick={() => setTab("Calendar")}><CalendarOutlined /> Calendar</li>
                            <Collapse accordion onChange={changeIcon}>
                                <Panel header={createMarkup()} key="1" showArrow={false} style={{"background":"cadetblue"}}>
                                    <li id="side" onClick={() => setTab("Profile")}>&nbsp; <InfoCircleOutlined /> Profile</li>
                                    <li id="side" onClick={() => setTab("Credentials")}>&nbsp; <SettingOutlined /> Credentials</li>
                                </Panel>
                            </Collapse>
                        </ul>
                    </Sider> :
                    <></>}
                <Content >
                    {tab === "Dashboard" && <Charts />}
                    {tab === "Clients" && <Clients />}
                    {tab === "Reservations" && <Reservation />}
                    {tab === "Admins" && <Admin />}
                    {tab === "Calendar" && <EventCalendar />}
                    {tab === "Profile" && <Profile />}
                    {tab === "Credentials" && <Credentials />}
                </Content>
            </Layout>
        </>
    )
}

export default Dashboard