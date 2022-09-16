import React, { useState, useRef, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef, Result } from 'antd';
import { Button, Input, Space, Table, Row, Col, Modal, Form, DatePicker, Select, message, TimePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import axios from "axios";
import './dashboard.css'
import { isDisabled } from '@testing-library/user-event/dist/utils';

const { confirm } = Modal;
const { Option } = Select;
const format = 'HH:mm';

interface DataType {
    key: number;
    client: string;
    clientName: string,
    typeName: string,
    type: string;
    date: string;
    time: string;
    status: string;
}

type DataIndex = keyof DataType;


function Reservation() {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef<InputRef>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const formRef = React.createRef<FormInstance>();
    const [client, setClient] = useState([]);
    const [dataSource, setDataSource] = useState([] as any)
    const [types, setTypes] = useState([]);
    const [stylist, setStylist] = useState([])
    const [selectedReservation, setSelectedReservation] = useState([])
    const [action, setAction] = useState('create')
    const [form] = Form.useForm();
    const [reservations, setReservation] = useState([]);

    useEffect(() => {
        getClient();
        getType();
        getReservation();
        getStylish();
    }, [])

    const getClient = async () => {
        await axios.get('http://localhost:5000/clients')
            .then(response => {
                setClient(response.data);
            }).catch(function (error) {
            });
    }
    const getType = async () => {
        await axios.get('http://localhost:5000/types')
            .then(response => {
                setTypes(response.data);
            }).catch(function (error) {
            });
    }
    const getStylish = async () => {
        await axios.get('http://localhost:5000/users')
            .then(response => {
                setStylist(response.data);
            }).catch(function (error) {
            });
    }
    const getReservation = async () => {
        await axios.get('http://localhost:5000/reservations')
            .then(response => {
                setReservation(response.data);
                setDataSource(response.data)
            }).catch(function (error) {
            });
    }
    const deleteReservation = async (id: String) => {
        await axios.delete(`http://localhost:5000/reservations/${id}`)
            .then(response => {
                getReservation();
                message.success('Successfully deleted')
            }).catch(function (error) {
            });
    }
    const showModal = () => {
        setAction('create')
        setIsModalVisible(true);
    };
    const showModalUpdate = (data: any) => {
        const temData = {
            "client": data.client,
            "type": data.type,
            "stylist": data.stylist,
            "status": data.status,
            "date": moment(data.date),
            "time": moment(data.time)
        }
        setAction('update')
        setSelectedReservation(data._id)
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
        let selectedClient = client.find(result => result['_id'] === values.client)
        let selectedType = types.find(result => result['_id'] === values.type)
        let name, type

        if (selectedClient)
            name = selectedClient['firstName'] + " " + selectedClient['lastName'];

        if (selectedType)
            type = selectedType['type'];

        Object.assign(values, { "key": action === 'create' ? reservations.length + 1 : values.key, "clientName": name, "typeName": type })
        console.log(values)
        values.time = moment(values.time).format('hh:mm')
        values.date = moment(values.date).format('YYYY-MM-DD')

        if (action === 'create') {
            await axios.post('http://localhost:5000/reservations', values)
                .then(response => {
                    message.success('Successfully created')
                    formRef.current!.resetFields();
                    setIsModalVisible(false);
                    getReservation();
                }).catch(function (error) {
                    message.error("Fill the form correctly")
                });
        }

        if (action === 'update') {
            await axios.put(`http://localhost:5000/reservations/${selectedReservation}`, values)
                .then(response => {
                    message.success('Successfully updated')
                    formRef.current!.resetFields();
                    setIsModalVisible(false);
                    getReservation();
                }).catch(function (error) {
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
    const showDeleteConfirm = (data: any) => {
        confirm({
            title: 'Are you sure delete this reservation',
            icon: <ExclamationCircleOutlined />,
            content: '',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                deleteReservation(data._id)
            },
            onCancel() {
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
            dataIndex: 'clientName',
            key: 'clientName',
            width: '20%',
            ...getColumnSearchProps('client'),
            sorter: (a, b) => a.client.length - b.client.length,
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Type',
            dataIndex: 'typeName',
            key: 'typeName',
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
                    <Button type="primary" onClick={() => showModalUpdate(record)}>Update</Button>
                    <Button type="dashed" danger onClick={() => showDeleteConfirm(record)}>Delete</Button>
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
    const disabledHours = () => {
        const hours = [];
    
        for (let min = 0,max=23; min < 8; min++,max--) {
          hours.push(min);
          hours.push(max);
        }
    
        return hours;
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
            <Row>
                <Input
                    placeholder="Search"
                    value={searchText}
                    onChange={e => {
                        const currValue = e.target.value;
                        setSearchText(currValue);
                        const filteredData = reservations.filter((entry: any) =>
                            entry['clientName'].toUpperCase().includes(currValue.toUpperCase()) ||
                            entry['typeName'].toUpperCase().includes(currValue.toUpperCase())
                            //entry.firstName.includes(currValue)
                        );
                        setDataSource(filteredData);
                        if (currValue.length === 0) {
                            getReservation()
                        }
                    }}
                />
            </Row>
            <br />
            <Table columns={columns} dataSource={dataSource} style={{ overflow: "scroll" }} />
            <Modal title={action === 'create' ? "New reservation" : "Update reservation"} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={false} >
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
                        label="Name"
                        name="client"
                        rules={[{ required: true, message: 'Please input your First Name!' }]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={onGenderChange}
                            allowClear
                        >
                            {client && client.map((data: any) => {
                                return (
                                    <Option value={data._id} key={data._id}>{data.firstName + " " + data.lastName}</Option>
                                )
                            })}
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
                            {types && types.map((data: any) => {
                                return (
                                    <Option value={data._id} key={data._id}>{data.type}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Stylist"
                        name="stylist"
                        rules={[{ required: true, message: 'Please input your stylist!' }]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={onGenderChange}
                            allowClear
                        >
                            {stylist && stylist.map((data: any) => {
                                return (
                                    <Option value={data._id} key={data._id}>{data.firstName + " " + data.lastName}</Option>
                                )
                            })}
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please input your stylist!' }]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={onGenderChange}
                            allowClear

                        >
                            <Option value="Scheduled" >Scheduled</Option>
                            <Option value="Completed">Completed</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Date"
                        name="date"
                        rules={[{ required: true, message: 'Please input your date!', type: 'date' }]}
                    >
                        <DatePicker disabledDate={(current) => {
                            let customDate = moment().format("YYYY-MM-DD");
                            return current && current < moment(customDate, "YYYY-MM-DD");
                        }} />
                    </Form.Item>
                    <Form.Item
                        label="Time"
                        name="time"
                        rules={[{ required: true, message: 'Please input your Time!' }]}
                    >
                        <TimePicker allowClear name="time" format={format} minuteStep={60} disabledHours={disabledHours}/>
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