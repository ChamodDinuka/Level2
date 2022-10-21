import React, { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from 'axios'
import {message} from 'antd'

const localizer = momentLocalizer(moment);
const DnDCalendar = withDragAndDrop(Calendar);


function EventCalender() {
    const [reservations, setReservations] = useState<any[]>([])
    const baseUrl = process.env.REACT_APP_BASE_URL
    useEffect(() => {
        getReservation();
    }, [])
    const getReservation = async () => {
        let tempData=[] as any
        await axios.get(`${baseUrl}/reservations`)
            .then(response => {
                response?.data?.map((data:any)=>{
                    return tempData.push({id:data._id,title:data.typeName+"("+data.time+")"+"-"+data.clientName+"("+data.status+")",start:data.date,end:data.date,client:data.client,type:data.type,stylist:data.stylist,status:data.status,time:data.time})
                })
                setReservations(tempData);
            }).catch(function (error) {
            });
    }
    const onEventResize = (data:any) => {
        
      };
    
    const  onEventDrop =async (data:any) => {
        const temData = {
            "client": data.event.client,
            "type": data.event.type,
            "stylist": data.event.stylist,
            "status": data.event.status,
            "date": moment(data.start).format('YYYY-MM-DD'),
            "time": data.event.time
        }
        if(reservations.find(reservation => reservation.stylist === temData.stylist && reservation.time === temData.time && reservation.start === temData.date)){
            message.error("Time slot is unavailable")
        }else{
        await axios.put(`${baseUrl}/reservations/${data.event.id}`, temData)
                .then(response => {
                    message.success('Successfully updated')
                    getReservation()
                }).catch(function (error) {
                    message.error(error.response.data.error)
                });
            }
      };
  return (
    <div >
        <DnDCalendar
          defaultDate={moment().toDate()}
          defaultView="month"
          events={reservations}
          localizer={localizer}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          views={['month']}
          style={{height: "100vh",padding:10,alignItems:"center",justifyContent:"center",flexDirection:"column" }}
        />
    </div>
  )
}

export default EventCalender