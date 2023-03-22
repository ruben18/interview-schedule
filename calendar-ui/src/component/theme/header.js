import React from 'react';
import { useSelector,useDispatch } from 'react-redux'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { logout } from '../../stores/userSlice'
import { useNavigate  } from "react-router-dom";


export default function Header() {
    const name = useSelector((state) => state.user.name)
    const dispatch = useDispatch();
    const navigate = useNavigate ();

    function signOut(){
        dispatch(logout());
        navigate('/');
    }

    return (<Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand href="#home">Calendar Interview</Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end align-items-center">
                        <Navbar.Text>
                            Signed in as: {name}&nbsp;
                        </Navbar.Text>
                        <Button onClick={signOut} variant="danger">Sign out</Button>
                    </Navbar.Collapse>
                </Container>
            </Navbar>)
}


