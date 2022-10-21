import React, { useState, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Row, Col, Modal, Form, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from "axios";
import type { FormInstance } from 'antd/es/form';

const { confirm } = Modal;
interface DataType {
    key: string;
    firstName: string;
    lastName: string;
    mobile: string;
    email: string;
}

function Clients() {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [client, setClient] = useState([] as any)
    const [dataSource, setDataSource] = useState([] as any)
    const [selectedClient, setSelectedClient] = useState([])
    const [action, setAction] = useState('create')
    const formRef = React.createRef<FormInstance>();
    const [form] = Form.useForm();
    const baseUrl = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        getClient();
    }, [])

    const getClient = async () => {
        await axios.get(`${baseUrl}/clients`)
            .then(response => {
                setClient(response.data);
                setDataSource(response.data)
            }).catch(function (error) {
            });
    }
    const deleteClient = async (id: String) => {
        await axios.delete(`${baseUrl}/clients/${id}`)
            .then(response => {
                getClient();
                message.success('Successfully deleted')
            }).catch(function (error) {
            });
    }
    const showModal = () => {
        setAction('create')
        setIsModalVisible(true);
    };
    const showModalUpdate = (data: any) => {
        setAction('update')
        setSelectedClient(data._id)
        form.setFieldsValue(data);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        formRef.current!.resetFields();
        setIsModalVisible(false);
    };
    const onFinish = async (values: any) => {
        Object.assign(values, { "key": values.email })
        if (action === 'create') {
            await axios.post(`${baseUrl}/clients`, values)
                .then(response => {
                    message.success('Successfully created')
                    formRef.current!.resetFields();
                    setIsModalVisible(false);
                    getClient();
                }).catch(function (error) {
                    message.error(error.response.data.error)
                });
        }
        if (action === 'update') {
            await axios.put(`${baseUrl}/clients/${selectedClient}`, values)
                .then(response => {
                    message.success('Successfully updated')
                    formRef.current!.resetFields();
                    setIsModalVisible(false);
                    getClient();
                }).catch(function (error) {
                    message.error(error.response.data.error)
                });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error("Fill the form")
    };
    const showDeleteConfirm = (data: any) => {
        confirm({
            title: 'Are you sure delete this client',
            icon: <ExclamationCircleOutlined />,
            content: data.firstName + " " + data.lastName,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteClient(data._id)
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
            width: '20%',
            sorter: (a, b) => a.email.localeCompare(b.email),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Phone Number',
            dataIndex: 'telephone',
            key: 'telephone',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={() => showModalUpdate(record)}>Update</Button>
                    <Button type="dashed" danger onClick={() => showDeleteConfirm(record)}>Delete</Button>
                </Space>
            ),
        },
    ];
    return (
        <div className="client_table">
            <Row style={{ "marginBottom": 10, "marginTop": 10 }}>
                <Col span={12}>
                    <h2>Clients</h2>
                </Col>
                <Col span={12}>
                    <Button id="login" type="primary" onClick={showModal}>
                        New client
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
                        const filteredData = client.filter((entry: any) =>
                            entry['firstName'].includes(currValue) || 
                            entry['lastName'].includes(currValue)  ||
                            entry['email'].includes(currValue)
                            //entry.firstName.includes(currValue)
                        );
                        setDataSource(filteredData);
                        if (currValue.length === 0) {
                            getClient()
                        }
                    }}
                />
            </Row>
            <br/>
            <Table columns={columns} dataSource={dataSource} style={{overflow:"scroll"}} pagination={{ defaultPageSize: 10}}/>
            <Modal title={action === 'create' ? "New client" : "Update client"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={false} >
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
                        validateTrigger={action === 'create' ? 'onSubmit':'onChange'}
                        rules={[{ required: true, message: 'Please input correct Email!', type: 'email' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Telephone"
                        name="telephone"
                        validateTrigger="onSubmit"
                        rules={[{ required: true, message: 'Please input correct phone number!', type: 'string', pattern:/^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|912)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/ }]}
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

export default Clients