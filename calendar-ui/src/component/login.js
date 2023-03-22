import React, { useState } from 'react';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Alert from 'react-bootstrap/Alert';
import api from "../services/api";
import { useDispatch } from 'react-redux'
import { login } from '../stores/userSlice'
import { useNavigate  } from "react-router-dom";


export default function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate ();


    const [email, setEmail]= useState("");
    const [password, setPassword] =useState("");
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState([]);

    function handleSubmit(event) {
        event.preventDefault();
        api.post("/login", {
            email: email,
            password: password
        })
            .then((response) => {
                dispatch(login(response.data));
                navigate('/dashboard');
            })
            .catch((err) => {
                var errors = [];
                if (err.response.data.errors !== undefined) {
                    for (var key in err.response.data.errors ) {
                        errors.push(err.response.data.errors[key]);
                    }
                    setErrorMsg(errors)
                } else {
                    errors.push(err.response.data.message);
                    setErrorMsg(errors)
                }
                setError({ error: true })
            });
    }

    return (
    <div className="container">
        <Row className="row vh-100 align-items-center justify-content-md-center">
            <Col className="col-6">
                <Card style={{ backgroundColor: "#343A40", color: "white" }}>
                    <Card.Body>
                        <Card.Title className="text-center">Interview Calendar</Card.Title>
                        <Form onSubmit={handleSubmit}>
                            {error &&
                                <Alert key="danger" variant="danger">
                                    <ul>
                                        {errorMsg.map((msg) => (
                                            <li>{msg}</li>
                                        ))}
                                    </ul>
                                </Alert>
                            }
                            <Form.Group className="mb-3" controlId="formBasicEmail">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" type="submit">
                                Sign in
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    </div>
    )
}