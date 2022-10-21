import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Col, message, Result } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom'
import '../../App.css'
import axios from 'axios'
import moment from 'moment';

function Registration() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [hasAccount, setHasAccount] = useState(false);
    const [hasExpired, setHasExpired] = useState(false)
    const [form] = Form.useForm();

    useEffect(() => {
        let token = searchParams.get("token")
        let tokenEmail;
        if (token) {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            tokenEmail = JSON.parse(jsonPayload).data.email
            form.setFieldsValue({
                email:tokenEmail
            })
            let tokenExp = new Date(JSON.parse(jsonPayload).exp * 1000)
            let dateNow = new Date();

            if (tokenExp < dateNow) {
                checkUser(tokenEmail, true)
            }else{
                checkUser(tokenEmail, false)
            }
            
        }
    }, [])
    const checkUser = async (email: string,exp:Boolean) => {
        const data: any = { email: email }
        await axios.post('http://localhost:5000/check', data)
            .then(response => {
                console.log(response)
                if (response.data === true) {
                    setHasAccount(true)
                } else {
                    setHasAccount(false)
                }
            }).catch(function (error) {
            });
            if(exp){
                setHasExpired(true)
            }else{
                setHasExpired(false)
            }
            
    }
    const onFinish = async (values: any) => {
        let token = searchParams.get("token")
        let tokenEmail;
        if (token) {
            let base64Url = token.split('.')[1];
            let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            tokenEmail = JSON.parse(jsonPayload).data.email
            let tokenExp = new Date(JSON.parse(jsonPayload).exp * 1000)
            let dateNow = new Date();

            if (tokenExp < dateNow) {
                message.error("Token is expired")
            } else {
                if (values.email === tokenEmail) {
                    Object.assign(values, { "joinDate": moment(new Date()).format('YYYY-MM-DD'), "role": 'admin', "key": values.email })

                    await axios.post('http://localhost:5000/register', values)
                        .then(response => {
                            localStorage.setItem('user', JSON.stringify(response.data))
                            message.success("Successfully registered")
                            setTimeout(() => navigate("../dashboard"), 1000)
                        }).catch(function (error) {
                            message.error(error.response.data.error)
                        });
                } else {
                    message.error("This email not the requested email by admin")
                }
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
            {!hasAccount ?
                <>
                    {!hasExpired ?
                        <Form
                            name="basic"
                            labelCol={{ span: 8 }}
                            wrapperCol={{ span: 16 }}
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                            autoComplete="off"
                            labelAlign="left"
                            form={form}
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
                                <Input disabled={true}/>
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
                        :
                        <Result
                            status="warning"
                            title="Token is expired"
                        />
                    }
                </>
                :
                <Result
                    status="warning"
                    title="You already have an account"
                    extra={
                        <Button key="console" type="primary" onClick={()=>{navigate("../")}}>
                            Login
                        </Button>
                    }
                />
            }

        </div>
    )
}

export default Registration