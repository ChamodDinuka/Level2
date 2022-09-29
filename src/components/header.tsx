import React from 'react'
import '../App.css'
import { Button, PageHeader } from 'antd';
import {useNavigate} from 'react-router-dom'

function hasJWT() {
    let flag = false;
    //check user has JWT token
    const loggedUser: any = localStorage.getItem("user")
    if (loggedUser) {
      let base64Url = JSON.parse(loggedUser).token.split('.')[1];
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      let tokenExp = new Date(JSON.parse(jsonPayload).exp * 1000)
      let dateNow = new Date();
      tokenExp < dateNow ? flag = false : flag = true
  
    } else {
      flag = false
    }
    return flag
  }

function Header() {
    const navigate = useNavigate();
    const routeChange = ( path:string) => {
        navigate(path);
    };
    const logOut = ()=>{
        localStorage.removeItem("user")
        navigate("/")
    }
    return (
        <div className="site-page-header-ghost-wrapper">
            {hasJWT() === false?
            <PageHeader
                ghost={false}
                title="Salon"
                extra={[
                    <Button key="2" type="primary" onClick={()=>routeChange("")}>Log in</Button>,
                    <Button key="1" type="primary" onClick={()=>routeChange("signup")}>Sign up</Button>
                ]}
            ></PageHeader>
            :
            <PageHeader
                ghost={false}
                title="Salon"
                extra={[
                    <Button key="2" type="primary" onClick={()=>logOut()}>Log Out</Button>
                ]}
            ></PageHeader>
            }
        </div>
    )
}

export default Header