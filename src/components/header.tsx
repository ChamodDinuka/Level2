import React from 'react'
import '../App.css'
import { Button, PageHeader } from 'antd';
import {useNavigate} from 'react-router-dom'

function Header() {
    const navigate = useNavigate();
    const routeChange = ( path:string) => {
        navigate(path);
    };
    return (
        <div className="site-page-header-ghost-wrapper">
            <PageHeader
                ghost={false}
                title="Salon"
                extra={[
                    <Button key="2" type="primary" onClick={()=>routeChange("")}>Log in</Button>,
                    <Button key="1" type="primary" onClick={()=>routeChange("signup")}>Sign up</Button>
                ]}
            ></PageHeader>
        </div>
    )
}

export default Header