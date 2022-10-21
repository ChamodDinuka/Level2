import React, { useState, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Row, Col, Modal, Form, DatePicker, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import './dashboard.css'
import axios from 'axios'
import moment from 'moment';
import emailjs from 'emailjs-com'
import type { FormInstance } from 'antd/es/form';

const { confirm } = Modal;

interface DataType {
    key: string;
    firstName: string;
    lastName: string;
    joinDate: string;
    email: string;
}


function Admin() {
    const [searchText, setSearchText] = useState('');
    const [users, setUsers] = useState([])
    const [dataSource, setDataSource] = useState([] as any)
    const formRef = React.createRef<FormInstance>();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedAdmin,setSelectedAdmin]=useState('')
    const [action, setAction] = useState('create')
    const [form] = Form.useForm();
    const [data, setData] = useState({
        link: "",
        email: ""
    })

    const service = process.env.REACT_APP_EMAIL_SERVICE as string
    const template = process.env.REACT_APP_EMAIL_TEMPLATE as string
    const emailId = process.env.REACT_APP_EMAIL_ID
    const baseUrl = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        getUsers();
    },[])

    const getUsers = async () => {
        await axios.get(`${baseUrl}/users`)
            .then(response => {
                setUsers(response.data);
                setDataSource(response.data)
            }).catch(function (error) {
            });
    }

    const showModal = () => {
        setAction('create')
        setIsModalVisible(true);
    };
    const showModalUpdate = (data:any) => {
        const temData = {
            "firstName": data.firstName,
            "lastName": data.lastName,
            "joinDate": moment(data.joinDate),
            "email": data.email
        }
        setAction('update')
        setSelectedAdmin(data._id)
        form.setFieldsValue(temData);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => { 
        setIsModalVisible(false);
        form.resetFields()
    };
    const onFinish = async (values: any) => {
        values.joinDate = moment(values.joinDate).format('YYYY-MM-DD')
        Object.assign(values, { "key": values.email })
        if (action === 'create') {
            await axios.post(`${baseUrl}/token`, values)
                .then(response => {
                    let token = response.data.token
                    let link = `http://localhost:3000/signup?token=${token}`
                    setData({ ...data, link: link, email: values.email })
                    emailjs.send(service, template, data, emailId)
                        .then((result) => {
                            message.success('Successfully Invited')
                            handleCancel();
                        }, (error) => {
                        });
                }).catch(function (error) {
                });

        }
        if( action ==='update'){
            await axios.put(`${baseUrl}/users/${selectedAdmin}`, values)
                .then(response => {
                    message.success('Successfully updated')
                    handleCancel();
                    getUsers();
                }).catch(function (error) {
                    message.error("Fill the form correctly")
                });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error("Fill the form correctly")
    };
    const deleteUser = async (id: String) => {
        await axios.delete(`${baseUrl}/users/${id}`)
            .then(response => {
                getUsers();
                message.success('Successfully deleted')
            }).catch(function (error) {
            });
    }
    const showDeleteConfirm = (data: any) => {
        confirm({
            title: 'Are you sure delete this admin',
            icon: <ExclamationCircleOutlined />,
            content: data.firstName+" "+data.lastName,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteUser(data._id)
            },
            onCancel() {
            },
        });
    };
    const columns: ColumnsType<DataType> = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            width: '30%',
            sorter: (a, b) => a.firstName.localeCompare(b.firstName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '20%',
            sorter: (a, b) => a.lastName.localeCompare(b.lastName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '30%',
            sorter: (a, b) => a.email.localeCompare(b.email),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Joined date',
            dataIndex: 'joinDate',
            key: 'joinDate',
        },
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <Button type="primary" onClick={()=>showModalUpdate(record)}>Update</Button>
        //             <Button type="dashed" danger onClick={()=>showDeleteConfirm(record)}>Delete</Button>
        //         </Space>
        //     ),
        // },
    ];
    return (
        <div className="client_table">
            <Row style={{ "marginBottom": 10, "marginTop": 10 }}>
                <Col span={12}>
                    <h2>Admins</h2>
                </Col>
                <Col span={12}>
                    <Button id="login" type="primary" onClick={showModal}>
                        New admin
                    </Button>
                </Col>
            </Row>
            <Row>
                <Input
                    placeholder="Search"
                    value={searchText}
                    onChange={e => {
                        const currValue = e.target.value;
                        setSearchText(currValue);
                        const filteredData = users.filter((entry: any) =>
                            entry['firstName'].includes(currValue) || 
                            entry['lastName'].includes(currValue)  ||
                            entry['email'].includes(currValue)
                        );
                        setDataSource(filteredData);
                        if (currValue.length === 0) {
                            getUsers()
                        }
                    }}
                />
            </Row>
            <br/>
            <Table columns={columns} dataSource={dataSource} style={{overflow:"scroll"}}/>
            <Modal title={action === 'create' ? "New admin" : "Update admin"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={false} >
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
                    {action === 'update' ?
                    <>
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
                    </>:''}
                    <Form.Item
                        label="Email"
                        name="email"
                        validateTrigger="onSubmit"
                        rules={[{ required: true, message: 'Please input your Email!', type: 'email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item wrapperCol={{ span: 24 }}>
                        <Button id="login" type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default Admin