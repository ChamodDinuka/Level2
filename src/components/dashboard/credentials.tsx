import React from 'react'
import { Button, Form, Input, Col, message, Result } from 'antd';
import axios from "axios";
import type { FormInstance } from 'antd/es/form';

function Credentials() {

    const [form] = Form.useForm();
    const baseUrl = process.env.REACT_APP_BASE_URL
    const formRef = React.createRef<FormInstance>();

    const onFinish = async (values: any) => {
        const loggedUser: any = localStorage.getItem("user")
        let base64Url = JSON.parse(loggedUser).token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        let id = JSON.parse(jsonPayload).id
        await axios.put(`${baseUrl}/reset/${id}`, { "password": values.password })
                .then(response => {
                    message.success('Successfully updated')
                    formRef.current!.resetFields();
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
                            ref={formRef}
                            form={form}
                        >
                            <Col offset={8} span={8} style={{ "textAlign": "center" }}><h3>Change Password</h3></Col>

                            <Form.Item
                                label="New Password"
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
                                    Update
                                </Button>
                            </Form.Item>
                        </Form>
    </div>
  )
}

export default Credentials