import React from 'react'
import { Button, Form, Input, Col, message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../../App.css'
import axios from 'axios'
import moment from 'moment';

function Registration() {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    const onFinish = async (values: any) => {
        let token = searchParams.get("token")
        let tokenEmail;
        if (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            tokenEmail = JSON.parse(jsonPayload).data.email

            if (values.email === tokenEmail) {
                Object.assign(values, { "joinDate": moment(new Date()).format('YYYY-MM-DD'), "role": 'admin', "key":values.email})
                console.log(values)
                await axios.post('http://localhost:5000/register', values)
                    .then(response => {
                        localStorage.setItem('user', JSON.stringify(response.data))
                        message.success("Successfully registered")
                        navigate("../dashboard");
                    }).catch(function (error) {
                        message.error(error.response.data.error)
                    });
            } else {
                message.error("This email not the requested email by admin")
            }
        } else {
            message.error("You need a token to create account")
        }
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
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: 'Please input your First Name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: 'Please input your Last Name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: 'Please input correct Email!', type: 'email' }]}
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
                    rules={[{ required: true, message: 'Please check your password!' }, ({ getFieldValue }) => ({
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