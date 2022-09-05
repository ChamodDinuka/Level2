import React from 'react'
import { Button, Form, Input, Col, message } from 'antd';
import '../../App.css'
import { useNavigate } from 'react-router-dom'
import axios from "axios";

function Login() {
    const navigate = useNavigate();
    const onFinish = async (values: any) => {
        await axios.post('http://localhost:5000/login', values)
            .then(response => {
                localStorage.setItem('user', JSON.stringify(response.data))
                navigate("dashboard");
            }).catch(function (error) {
                message.error(error.response.data.error)
            });

    };

    const onFinishFailed = (errorInfo: any) => {
        message.error("Fill the form")
    };

    return (
        <div className="login-form">
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                labelAlign="left"
            >
                <Col offset={8} span={8} style={{ "textAlign": "center" }}><h3>Log in</h3></Col>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item wrapperCol={{ span: 24 }}>
                    <Button id="login" type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default Login