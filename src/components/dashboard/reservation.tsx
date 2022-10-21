import React, { useState, useEffect } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Input, Space, Table, Row, Col, Modal, Form, DatePicker, Select, message, TimePicker } from 'antd';
import type { FormInstance } from 'antd/es/form';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import axios from "axios";
import './dashboard.css'

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


function Reservation() {
    const [searchText, setSearchText] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const formRef = React.createRef<FormInstance>();
    const [client, setClient] = useState([]);
    const [dataSource, setDataSource] = useState([] as any)
    const [types, setTypes] = useState([]);
    const [stylist, setStylist] = useState([])
    const [selectedReservation, setSelectedReservation] = useState([])
    const [action, setAction] = useState('create')
    const [selectedStylist, setselectedStylist] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [blockedTimes, setBlockedTimes] = useState([])
    const [form] = Form.useForm();
    const [reservations, setReservation] = useState([]);
    const baseUrl = process.env.REACT_APP_BASE_URL

    useEffect(() => {
        getClient();
        getType();
        getReservation();
        getStylish();
    }, [])

    const getClient = async () => {
        await axios.get(`${baseUrl}/clients`)
            .then(response => {
                setClient(response.data);
            }).catch(function (error) {
            });
    }
    const getType = async () => {
        await axios.get(`${baseUrl}/types`)
            .then(response => {
                setTypes(response.data);
            }).catch(function (error) {
            });
    }
    const getStylish = async () => {
        await axios.get(`${baseUrl}/users`)
            .then(response => {
                setStylist(response.data);
            }).catch(function (error) {
            });
    }
    const getReservation = async () => {
        await axios.get(`${baseUrl}/reservations`)
            .then(response => {
                setReservation(response.data);
                setDataSource(response.data)
            }).catch(function (error) {
            });
    }
    const deleteReservation = async (id: String) => {
        await axios.delete(`${baseUrl}/reservations/${id}`)
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
            "time": moment(data.time,"HH:mm")
        }
        setAction('update')
        setSelectedReservation(data._id)
        setSelectedDate(data.date)
        setselectedStylist(data.stylist)
        form.setFieldsValue(temData);
        setIsModalVisible(true);
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        formRef.current!.resetFields();
        setSelectedDate('')
        setselectedStylist('')
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
        values.time = moment(values.time).format('hh:mm')
        values.date = moment(values.date).format('YYYY-MM-DD')

        if (action === 'create') {
            await axios.post(`${baseUrl}/reservations`, values)
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
            await axios.put(`${baseUrl}/reservations/${selectedReservation}`, values)
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
    const columns: ColumnsType<DataType> = [
        {
            title: 'Name',
            dataIndex: 'clientName',
            key: 'clientName',
            width: '20%',
            sorter: (a, b) => a.clientName.localeCompare(b.clientName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Type',
            dataIndex: 'typeName',
            key: 'typeName',
            width: '15%',
            sorter: (a, b) => a.typeName.localeCompare(b.typeName),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Date',
            dataIndex: 'date',
            key: 'date',
            width: '15%',
            sorter: (a, b) => a.date.localeCompare(b.date),
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
    const disabledHours =() => {
        const hours = [] as any;
        let currentTime = new Date().getHours();
        let currentDate = moment(new Date()).format('YYYY-MM-DD')

        if(currentTime >= 8 && currentDate == selectedDate){
            for(let min = 8;min <= currentTime;min++){
                hours.push(min)
            }
        }
    
        for (let min = 0,max=23; min < 8; min++,max--) {
          if(max >= 18){
            hours.push(min)
            hours.push(max);
          }else{
            hours.push(min);
          }
        }
        return hours.concat(blockedTimes)
      };
    const getHourse=async()=>{
        await axios.get(`${baseUrl}/blocked?id=${selectedStylist}&date=${selectedDate}`)
            .then(response => {
                setBlockedTimes(response.data)    
            }).catch(function (error) {
            });
    }
    const onStylistSelect=(e:any)=>{
        setselectedStylist(e);
    }
    const onDateSelect=(e:any)=>{
        setSelectedDate(moment(e).format('YYYY-MM-DD'))
    }
    useEffect(()=>{
        if(selectedDate !=='' && selectedStylist !== ''){
            getHourse();
         }
    },[selectedDate,selectedStylist])
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
                            entry['clientName'].includes(currValue) ||
                            entry['typeName'].includes(currValue)
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
                        validateTrigger="onSubmit"
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
                        validateTrigger="onSubmit"
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
                        validateTrigger="onSubmit"
                        rules={[{ required: true, message: 'Please input your stylist!' }]}
                    >
                        <Select
                            placeholder="Select a option and change input text above"
                            onChange={(e)=>onStylistSelect(e)}
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
                        validateTrigger="onSubmit"
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
                        validateTrigger="onSubmit"
                        rules={[{ required: true, message: 'Please input your date!', type: 'date' }]}
                    >
                        <DatePicker disabledDate={(current) => {
                            let customDate = moment().format("YYYY-MM-DD");
                            return current && current < moment(customDate, "YYYY-MM-DD");
                        }} onChange={(e)=>onDateSelect(e)}/>
                    </Form.Item>
                    <Form.Item
                        label="Time"
                        name="time"
                        validateTrigger="onSubmit"
                        rules={[{ required: true, message: 'Please input your Time!' }]}
                    >
                        <TimePicker allowClear name="time" format={format} minuteStep={60} disabledHours={disabledHours} disabled={selectedDate ==='' || selectedStylist === ''}/>
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