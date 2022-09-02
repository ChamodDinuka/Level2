import React, { useState,useRef } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table, Row, Col, Modal, Form, DatePicker, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { TimePicker } from 'antd';
import moment from 'moment';
import './dashboard.css'

const { confirm } = Modal;
const { Option } = Select;
const format = 'HH:mm';

interface DataType {
    key: string;
    name: string;
    type: string;
    date: string;
    time: string;
    status: string;
}

type DataIndex = keyof DataType;

const data: DataType[] = [
    {
        key: '1',
        name: 'Hair cut',
        type: 'Tatto',
        date: '2021-12-12',
        time: '09:00',
        status: 'Complated'
    },
    {
        key: '2',
        name: 'Joe',
        type: 'Tattoo',
        date: '2021-12-12',
        time: '09:30',
        status: 'Sheduled'
    },
    {
        key: '3',
        name: 'Jim',
        type: 'Hair cut',
        date: '2021-12-13',
        time: '10:00',
        status: 'Complated'
    },
    {
        key: '4',
        name: 'Jim',
        type: 'Hair coloring',
        date: '2021-11-12',
        time: '12:30',
        status: 'Complated'
    },
    {
        key: '5',
        name: 'Jim',
        type: 'Hair coloring',
        date: '2022-02-12',
        time: '15:30',
        status: 'Sheduled'
    },
];

function Reservation() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const formRef = React.createRef<FormInstance>();

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };
    const onFinish = (values: any) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
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
    const showDeleteConfirm = () => {
        confirm({
            title: 'Are you sure delete this resevation',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
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
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            ...getColumnSearchProps('name'),
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Type',
            dataIndex: 'type',
            key: 'type',
            width: '15%',
            ...getColumnSearchProps('type'),
            sorter: (a, b) => a.type.length - b.type.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            ...getColumnSearchProps('date'),
            sorter: (a, b) => a.date.length - b.date.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Time',
            dataIndex: 'time',
            key: 'time',
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button type="primary" onClick={showModal}>Update</Button>
                    <Button type="dashed" danger onClick={showDeleteConfirm}>Delete</Button>
                </Space>
            ),
        },
    ];
    const onGenderChange = (value: string) => {
        switch (value) {
          case 'male':
            formRef.current!.setFieldsValue({ note: 'Hi, man!' });
            return;
          case 'female':
            formRef.current!.setFieldsValue({ note: 'Hi, lady!' });
            return;
          case 'other':
            formRef.current!.setFieldsValue({ note: 'Hi there!' });
        }
      };
    return (
        <div className="client_table">
            <Row style={{ "marginBottom": 10, "marginTop": 10 }}>
                <Col span={12}>
                    <h2>Reservations</h2>
                </Col>
                <Col span={12}>
                    <Button id="login" type="primary" onClick={showModal}>
                        New reservation
                    </Button>
                </Col>
            </Row>
            <Table columns={columns} dataSource={data} />
            <Modal title="New Client" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={false} >
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
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your First Name!' }]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={onGenderChange}
                            allowClear
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            <Option value="other">other</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{ required: true, message: 'Please input your Last Name!' }]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={onGenderChange}
                            allowClear
                        >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            <Option value="other">other</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please input your date!', type: 'date' }]}
                    >
                        <DatePicker />
                    </Form.Item>
                    <Form.Item
                        label="Time"
                        name="time"
                        rules={[{ required: true, message: 'Please input your Time!' }]}
                    >
                        <TimePicker defaultValue={moment('12:08', format)} format={format} />
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

export default Reservation