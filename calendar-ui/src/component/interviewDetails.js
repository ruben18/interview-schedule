
import React, { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import api from "../services/api";
import { useSelector } from 'react-redux'
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';

export function InterviewDetails(props) {
    const token = useSelector((state) => state.user.token)
    const role = useSelector((state) => state.user.role)

    const [date, setDate] = useState();
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (props.id != "") {
            api.get("/interview/" + props.id + "/edit", {
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            })
                .then((response) => {
                    setDate(response.data.availability.date);
                    setStartTime(response.data.availability.start_time);
                    setEndTime(response.data.availability.end_time);
                    if (role == "candidate") {
                        setName(response.data.availability.interviewer.name);
                        setEmail(response.data.availability.interviewer.email);
                    } else {
                        setName(response.data.candidate.name);
                        setEmail(response.data.candidate.email);
                    }
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err)
                });
        }
    }, []);

    return (
        <Form>
            <h4 className="mt-2">Interview details</h4>
            {isLoading ? (
                <Col className="col-12 text-center">
                    <Spinner animation="border" />
                </Col>
            ) : (<>
                <Form.Group className="mb-3" controlId="formBasicDate">
                    <Form.Label className="m-2 mb-0" style={{ fontWeight: "bold" }}>Date: </Form.Label>
                    {date}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicTimeStart">
                    <Form.Label className="m-2 mb-0" style={{ fontWeight: "bold" }}>Time Start: </Form.Label>
                    {startTime}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicTimeEnd">
                    <Form.Label className="m-2 mb-0" style={{ fontWeight: "bold" }}>Time End: </Form.Label>
                    {endTime}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicTimeEnd">
                    <Form.Label className="m-2 mb-0" style={{ fontWeight: "bold" }}>{role == 'candidate' ? "Interviewer Name" : "Candidate Name"}: </Form.Label>
                    {name}
                </Form.Group>
                <Form.Group className="mb-3" controlId="formBasicTimeEnd">
                    <Form.Label className="m-2 mb-0" style={{ fontWeight: "bold" }}>{role == 'candidate' ? "Interviewer Email" : "Candidate Email"}: </Form.Label>
                    {email}
                </Form.Group>
            </>)}
        </Form>
    )
}