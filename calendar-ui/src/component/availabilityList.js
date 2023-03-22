import React, { useEffect, useState } from 'react';

import moment from 'moment'
import api from "../services/api";
import { useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Modal from 'react-bootstrap/Modal';
import Spinner from 'react-bootstrap/Spinner';

export default function AvailabilityList(props) {
    const token = useSelector((state) => state.user.token)
    const role = useSelector((state) => state.user.role)

    const [availability, setAvailability] = useState([]);
    const [selectedId, setSelectedId] = useState("");
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [show, setShow] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const handleClose = () => setShow(false);

    function showConfirmation(id) {
        setSelectedId(id);
        setShow(true);
    }

    function removeReg() {
        setIsLoading(true);
        api.post("/availability/" + selectedId, {
            _method: "DELETE"
        },
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then((response) => {
                setError(false)
                setSuccessMsg(response.data.message);
                setSuccess(true);
                setShow(false);
                loadAvailability();
                setIsLoading(false);
                props.callback();
            })
            .catch((err) => {
                var errors = [];
                if (err.response.data.errors !== undefined) {
                    for (var key in err.response.data.errors) {
                        for (var msg in err.response.data.errors[key]) {
                            errors.push(err.response.data.errors[key][msg]);
                        }
                    }
                    setErrorMsg(errors);
                } else {
                    errors.push(err.response.data.message);
                    setErrorMsg(errors)
                }
                setError({ error: true })
            });

    }

    function loadAvailability() {
        api.get("/availability/daily/" + moment(props.date).format('YYYY-MM-DD'), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then((response) => {
                var newEvents = [];
                for (var key in response.data) {
                    newEvents.push(response.data[key]);
                }
                setAvailability(newEvents);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err)
            });
    }

    function selectAvailability(id) {
        setIsLoading(true);
        api.post("/interview", {
            availability_id: id
        },
            {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
            .then((response) => {
                setError(false)
                setSuccessMsg(response.data.message);
                setSuccess(true);
                setShow(false);
                loadAvailability();
                setIsLoading(false);
                props.callback();
            })
            .catch((err) => {
                var errors = [];
                if (err.response.data.errors !== undefined) {
                    for (var key in err.response.data.errors) {
                        for (var msg in err.response.data.errors[key]) {
                            errors.push(err.response.data.errors[key][msg]);
                        }
                    }
                    setErrorMsg(errors);
                } else {
                    errors.push(err.response.data.message);
                    setErrorMsg(errors)
                }
                setError({ error: true })
            });
    }

    useEffect(() => {
        loadAvailability();
    }, []);

    return (<>
        {error &&
            <Alert key="danger" variant="danger" className="mt-2">
                <ul>
                    {errorMsg.map((msg) => (
                        <li>{msg}</li>
                    ))}
                </ul>
            </Alert>
        }
        {success &&
            <Alert key="success" variant="success" className="mt-2">
                {successMsg}
            </Alert>
        }
        {role == 'candidate' && <p>Select when you are available.</p>}
        <Table className='mt-2'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Start time</th>
                    <th>Start end</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {isLoading ?
                    <tr>
                        <td colspan="4" className="text-center"><Spinner animation="border" /></td>
                    </tr>
                    : (
                        availability.length > 0 ? (
                            availability.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.date}</td>
                                        <td>{item.start_time}</td>
                                        <td>{item.end_time}</td>
                                        <td>
                                            {role == 'interviewer' ? (
                                                <>
                                                    <Button variant="warning" size="sm" onClick={() => { props.changeEditMode(true, item.id) }}>Edit</Button>
                                                    <Button style={{ marginLeft: 5 }} variant="danger" size="sm" onClick={() => showConfirmation(item.id)}>Remove</Button>
                                                </>
                                            ) : (
                                                <Button variant="primary" size="sm" onClick={() => selectAvailability(item.id)}>Select</Button>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colspan="4">No availability on this day.</td>
                            </tr>
                        )
                    )}
            </tbody>
        </Table>
        <Modal show={show} onHide={handleClose} >
            <Modal.Header style={{ backgroundColor: "#343A40", color: "white" }} closeButton >
                <Modal.Title style={{ backgroundColor: "#343A40", color: "white" }}>Are you sure you want to delete this availability?</Modal.Title>
            </Modal.Header>
            <Modal.Footer style={{ backgroundColor: "#343A40", color: "white" }}>
                <Button variant="success" onClick={removeReg}>
                    Yes
                </Button>
                <Button variant="danger" onClick={handleClose}>
                    No
                </Button>
            </Modal.Footer>
        </Modal>
    </>
    )
}