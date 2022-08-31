import React from 'react'
import { Button, Form, Input, Col } from 'antd';
import '../../App.css'

function Registration() {
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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
                    name="first_name"
                    rules={[{ required: true, message: 'Please input your First Name!'}]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Last Name"
                    name="last_name"
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
                    name="confirm_password"
                    rules={[{ required: true, message: 'Please check your password!' }]}
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