import React from 'react'
import { Button, Form, Input, Col, message } from 'antd';
import { useNavigate } from 'react-router-dom'
import '../../App.css'
import axios from 'axios'

function Registration() {
    const navigate = useNavigate();
    const onFinish = async (values: any) => {
        Object.assign(values,{"joinDate":new Date(),"role":'admin'})
        console.log(values)
        await axios.post('http://localhost:5000/register', values)
            .then(response => {
                localStorage.setItem('user', JSON.stringify(response.data))
                message.success("Successfully registered")
                navigate("../dashboard");
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
                <Col offset={8} span={8} style={{ "textAlign": "center" }}><h3>Sign Up</h3></Col>
                <Form.Item
                    label="First Name"
                    name="firstName"
                    rules={[{ required: true, message: 'Please input your First Name!'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    rules={[{ required: true, message: 'Please input your Last Name!'}]}
                >
                    <Input />
                </Form.Item>
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
                <Form.Item
                    label="Confirm Password"
                    name="confirmPassword"
                    hasFeedback
                    dependencies={['password']}
                    rules={[{ required: true, message: 'Please check your password!' },({ getFieldValue }) => ({
                        validator(rule, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject('The two passwords that you entered do not match!');
                        },
                      }),]}
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

export default Registration