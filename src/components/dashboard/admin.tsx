import React, { useState, useRef, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Row, Col, Modal, Form, DatePicker,  InputRef, message } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
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

type DataIndex = keyof DataType;

function Admin() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [users, setUsers] = useState([])
    const [dataSource, setDataSource] = useState([] as any)
    const searchInput = useRef<InputRef>(null);
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

    useEffect(() => {
        getUsers();
    },[])

    const getUsers = async () => {
        await axios.get('http://localhost:5000/users')
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
        formRef.current!.resetFields();
        setIsModalVisible(false);
    };
    const onFinish = async (values: any) => {
        values.joinDate = moment(values.joinDate).format('YYYY-MM-DD')
        if (action === 'create') {
            await axios.post('http://localhost:5000/token', values)
                .then(response => {
                    let token = response.data.token
                    let link = `http://localhost:3000/signup?token=${token}`
                    setData({ ...data, link: link, email: values.email })
                    emailjs.send(service, template, data, emailId)
                        .then((result) => {
                            message.success('Successfully Invited')
                            handleCancel();
                            console.log(result)
                        }, (error) => {
                            console.log(error)
                        });
                }).catch(function (error) {
                });

        }
        if( action ==='update'){
            await axios.put(`http://localhost:5000/users/${selectedAdmin}`, values)
                .then(response => {
                    message.success('Successfully updated')
                    handleCancel();
                    getUsers();
                }).catch(function (error) {
                    console.log(error)
                    message.error("Fill the form correctly")
                });
        }
    };

    const onFinishFailed = (errorInfo: any) => {
        message.error("Fill the form correctly")
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
    const deleteUser = async (id: String) => {
        await axios.delete(`http://localhost:5000/users/${id}`)
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
                console.log('Cancel');
            },
        });
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
            title: 'Joined date',
            dataIndex: 'joinDate',
            key: 'joinDate',
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
                            entry['firstName'].toUpperCase().includes(currValue.toUpperCase()) || 
                            entry['lastName'].toUpperCase().includes(currValue.toUpperCase())  ||
                            entry['email'].toUpperCase().includes(currValue.toUpperCase())
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
                        label="Join Date"
                        name="joinDate"
                        rules={[{ required: true, message: 'Please input your join date!', type: 'date' }]}
                    >
                        <DatePicker disabledDate={(current) => {
                            let customDate = moment().format("YYYY-MM-DD");
                            return current && current < moment(customDate, "YYYY-MM-DD");
                        }}/>
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