
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import api from "../services/api";
import { useSelector } from 'react-redux'
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';

export function AvailabilityForm(props) {
    const token = useSelector((state) => state.user.token)
    
    const [id, setId] = useState(props.id);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState([]);
    const [successMsg, setSuccessMsg] = useState("");
    const [success, setSuccess] = useState(false);
    const [date, setDate] = useState(props.date);
    const [startTime, setStartTime] = useState(props.startTime);
    const [endTime, setEndTime] = useState(props.endTime);
    const [show, setShow] = useState(false);

    const [isLoading, setIsLoading] = useState(true);

    const handleClose = () => setShow(false);

    function showConfirmation() {
        setShow(true);
    }

    function removeReg() {
        api.post("/availability/" + id, {
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
                setIsLoading(false);
                setId("");
                setDate(props.date);
                setStartTime("");
                setEndTime("");
                props.callback();
            })
            .catch((err) => {
                console.log(err);
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
                    setErrorMsg(errors);
                }
                setError({ error: true })
                setIsLoading(false);

            });
    }

    function handleSubmit(event) {
        setIsLoading(true);
        event.preventDefault();
        if (id != "") {
            api.post("/availability/" + id, {
                date: date,
                start_time: startTime,
                end_time: endTime,
                _method: "PUT"
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
                    setIsLoading(false);
                });
        } else {
            api.post("/availability", {
                date: date,
                start_time: startTime,
                end_time: endTime
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
                    setStartTime("");
                    setEndTime("");
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
                    setError({ error: true });
                    setIsLoading(false);
                });
        }
    }

    useEffect(() => {
        if (id != "") {
            api.get("/availability/" + id + "/edit", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => {
                    setDate(response.data.date);
                    setStartTime(response.data.start_time);
                    setEndTime(response.data.end_time);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err)
                });
        }else{
            setIsLoading(false);
        }
    }, []);

    return (
        <Form onSubmit={handleSubmit}>
            <h4 className="mt-2">{id != "" ? "Edit availability" : "Add new availability"}</h4>
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
            {isLoading ? (
                <Col className="col-12 text-center">
                    <Spinner animation="border" />
                </Col>
            ) : (
                <>
                    <Form.Group className="mb-3" controlId="formBasicDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" placeholder="Enter date" value={date} onChange={e => setDate(e.target.value)} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicStartTime">
                        <Form.Label>Time Start</Form.Label>
                        <Form.Control type="time" placeholder="00:00" value={startTime} onChange={e => setStartTime(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicEndTime">
                        <Form.Label>Time End</Form.Label>
                        <Form.Control type="time" placeholder="00:00" value={endTime} onChange={e => setEndTime(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit">
                        Save
                    </Button>
                    {id != "" &&
                        <Button style={{ marginLeft: 5 }} variant="danger" onClick={() => showConfirmation()}>Remove</Button>
                    }

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
            )}
        </Form>

    )
}