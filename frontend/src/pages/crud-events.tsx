import React, { useEffect, useState } from 'react';
import axios from 'axios';

type TEvent = {
    id?: number;
    start_time: string;
    end_time: string;
    name: string;
    place: string;
}

type TRes = {
    msg: string;
    data?: TEvent[];
}

const headers = {
    headers: {
        "Content-Type": "application/json",
    }
}

export default function CrudEventsPage() {
    useEffect(() => {
        getEvents();
    }, []);

    const [events, setEvents] = useState<TEvent[]>([]);
    const [newEvent, setNewEvent] = useState<TEvent>({
        id: 0,
        start_time: "00:00",
        end_time: "00:00",
        name: "",
        place: ""
    });

    const [isEditable, setIsEditable] = useState(false);
    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const data = events;
        data [e.target.name] = e.target.value;
        setEvent(data);
        setNewEvent({ ...newEvent, [e.target.name]: e.target.value });
    }

    const getEvents = async () => {
        try {
            const response = await axios.post<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/get`);
            if (response.data.data) {
                setEvents(response.data.data);
            }
        } catch (error) {
            alert(`Hubo un error al realizar la petición: ${error}`);
        }
    }

    const createEvent = async (id: number) => {
        try {
            const response = await axios.post<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/create`, newEvent, headers);
            getEvents();
        } catch (error) {
            alert(`Hubo un error al realizar la petición: ${error}`);
        }
    }
    
    const updateEvent = async () => {
        try {
            await axios.put<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/update/${newEvent.id}`,
                newEvent,
                headers
            );
            getEvents();
        } catch (error) {
            alert(`Hubo un error al realizar la petición: ${error}`);
        }
    }

    const deleteEvent = async (id: number) => {
        try {
            await axios.delete<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/delete/${id}`
            );
            getEvents();
        } catch (error) {
            alert(`Hubo un error al realizar la petición: ${error}`);
        }
    }

    const preUpdate = (e: TEvent)=> {
        setEvents(e);
        setIsEditable(true);
    }
    return (
        <div>
            <h1>CRUD de Eventos</h1>
            <div>
                <label htmlFor="name">Nombre del evento</label><br/>
                <input
                    type="text"
                    value={newEvent.name}
                    onChange={onChange}
                    name='name'
                />
                <label htmlFor="start_time">Hora de inicio</label><br/>
                <input
                    type="text"
                    value={newEvent.start_time}
                    onChange={onChange}
                    name='start_time'
                />
                <label htmlFor="end_time">Hora de fin</label><br/>
                <input
                    type="text"
                    value={newEvent.end_time}
                    onChange={onChange}
                    name='end_time'
                />
                <label htmlFor="place">Lugar del evento</label><br/>
                <input
                    type="text"
                    value={newEvent.place}
                    onChange={onChange}
                    name='place'
                />
            </div>
            <button onClick={createEvent}>Agregar Evento</button>
            <table>
                <thead>
                    <tr>
                        <th>Nombre de evento</th>
                        <th>Hora de inicio</th>
                        <th>Hora de fin</th>
                        <th>Lugar</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {events.map((event, index) => (
                        <tr key={index}>
                            <td>{event.name}</td>
                            <td>{event.start_time}</td>
                            <td>{event.end_time}</td>
                            <td>{event.place}</td>
                            <td>
                                <button onClick={() => deleteEvent(event.id ?? 0)}>Eliminar</button>
                            </td>
                            <td>
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                isEditable && (
                    <div>
                <label htmlFor="name">Nombre del evento</label><br/>
                <input
                    type="text"
                    value={newEvent.name}
                    onChange={onChange}
                    defaultValue={event.name}
                    name='name'
                />
                <label htmlFor="start_time">Hora de inicio</label><br/>
                <input
                    type="text"
                    value={newEvent.start_time}
                    onChange={onChange}
                    defaultValue={event.star_time}
                    name='start_time'
                />
                <label htmlFor="end_time">Hora de fin</label><br/>
                <input
                    type="text"
                    value={newEvent.end_time}
                    onChange={onChange}
                    defaultValue={event.end_time}
                    name='end_time'
                />
                <label htmlFor="place">Lugar del evento</label><br/>
                <input
                    type="text"
                    value={newEvent.place}
                    onChange={onChange}
                    defaultValue={event.place}
                    name='place'
                />
 <button onClick={() => updateEvent(event.id ?? 0)}>Guardar</button>
            </div>
                )
            }
        </div>
    ); 
}
