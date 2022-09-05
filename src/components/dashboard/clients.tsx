import React, { useState, useRef, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table, Row, Col, Modal, Form, message } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
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

type DataIndex = keyof DataType;

function Clients() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [client, setClient] = useState([])
    const [action,setAction] = useState('create')
    const formRef = React.createRef<FormInstance>();

    useEffect(() => {
        getClient();
    }, [])

    const getClient = async () => {
        await axios.get('http://localhost:5000/clients')
            .then(response => {
                setClient(response.data);
            }).catch(function (error) {
            });
    }
    const deleteClient = async (id:String) => {
        await axios.delete(`http://localhost:5000/clients/${id}`)
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
    const showModalUpdate = (data:any) => {
        setAction('update')
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
        Object.assign(values,{"key":values.email})
        await axios.post('http://localhost:5000/clients', values)
            .then(response => {
                message.success('Successfully created')
                formRef.current!.resetFields();
                setIsModalVisible(false);
                getClient();
            }).catch(function (error) {
                message.error(error.response.data.error)
            });
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error("Fill the form")
    };
    const showDeleteConfirm = (data:any) => {
        confirm({
            title: 'Are you sure delete this client',
            icon: <ExclamationCircleOutlined />,
            content: data.firstName+" "+data.lastName,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteClient(data._id)
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleSearch = (
        selectedKeys: string[],
        confirm: (param?: FilterConfirmProps) => void,
        dataIndex: DataIndex,
    ) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
        clearFilters();
        setSearchText('');
    };

    const getColumnSearchProps = (dataIndex: DataIndex): ColumnType<DataType> => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText((selectedKeys as string[])[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes((value as string).toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: text =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    const columns: ColumnsType<DataType> = [
        {
            title: 'First Name',
            dataIndex: 'firstName',
            key: 'firstName',
            width: '30%',
            ...getColumnSearchProps('firstName'),
            sorter: (a, b) => a.firstName.length - b.firstName.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Last Name',
            dataIndex: 'lastName',
            key: 'lastName',
            width: '20%',
            ...getColumnSearchProps('lastName'),
            sorter: (a, b) => a.lastName.length - b.lastName.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
            width: '20%',
            ...getColumnSearchProps('email'),
            sorter: (a, b) => a.email.length - b.email.length,
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
                    <Button type="primary" onClick={()=>showModalUpdate(record)}>Update</Button>
                    <Button type="dashed" danger onClick={()=>showDeleteConfirm(record)}>Delete</Button>
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
            <Table columns={columns} dataSource={client} />
            <Modal title={action === 'create' ? "New client" :"Update client"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={false} >
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
                >
                    <Form.Item
                        label="First Name"
                        name="firstName"
                        rules={[{ required: true, message: 'Please input your First Name!' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Last Name"
                        name="lastName"
                        rules={[{ required: true, message: 'Please input your Last Name!' }]}
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
                        label="Telephone"
                        name="telephone"
                        rules={[{ required: true, message: 'Please input your password!' }]}
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