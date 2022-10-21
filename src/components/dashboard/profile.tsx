import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Col, message } from 'antd';
import axios from "axios";

function Profile() {

    const [userId, setUserId] = useState('')
    const baseUrl = process.env.REACT_APP_BASE_URL
    const [form] = Form.useForm();

    useEffect(() => {
        getUser();
    }, [])
    const getUser = async () => {
        const loggedUser: any = localStorage.getItem("user")
        let base64Url = JSON.parse(loggedUser).token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        let id = JSON.parse(jsonPayload).id
        setUserId(id)
        await axios.get(`${baseUrl}/users/${id}`)
            .then(response => {
                const temData = {
                    "firstName": response.data.firstName,
                    "lastName": response.data.lastName,
                    "email": response.data.email
                }
                form.setFieldsValue(temData);
            }).catch(function (error) {
                // message.error(error.response.data.error)
            });
    }

    const onFinish = async (values: any) => {
        await axios.put(`${baseUrl}/users/${userId}`, values)
                .then(response => {
                    getUser()
                    message.success('Successfully updated')
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
                form={form}
            >

                <Col offset={8} span={8} style={{ "textAlign": "center" }}><h3>My Profile</h3></Col>
                <Form.Item
                    label="First Name"
                    name="firstName"
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: 'Please input your first name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="lastName"
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: 'Please input your last name!' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Email"
                    name="email"
                    validateTrigger="onSubmit"
                    rules={[{ required: true, message: 'Please input correct email!', type: 'email' }]}
                >
                    <Input />
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

export default Profile