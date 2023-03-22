import React, { useEffect, useState } from 'react';

import moment from 'moment'
import api from "../services/api";
import { useSelector } from 'react-redux'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

export default function InterviewList(props) {
    const token = useSelector((state) => state.user.token)
    const role = useSelector((state) => state.user.role)

    const [interview, setInterview] = useState([]);

    const [isLoading, setIsLoading] = useState(true);

    function loadInterview() {
        api.get("/interview/daily/" + moment(props.date).format('YYYY-MM-DD'), {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
            .then((response) => {
                var newEvents = [];
                for (var key in response.data) {
                    newEvents.push(response.data[key]);
                }
                setInterview(newEvents);
                setIsLoading(false);
            })
            .catch((err) => {
                console.log(err)
            });
    }

    useEffect(() => {
        loadInterview();
    }, []);

    return (<>
        {role == 'candidate' && <p>Your interviews.</p>}
        <Table className='mt-2'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Start time</th>
                    <th>Start end</th>
                    {role == 'candidate' ? (
                        <th>Interviewer Name</th>
                    ) : (
                        <th>Candidate Name</th>
                    )}
                    {role == 'candidate' ? (
                        <th>Interviewer Email</th>
                    ) : (
                        <th>Candidate Email</th>
                    )}
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {isLoading ?
                    <tr>
                        <td colspan="6" className="text-center"><Spinner animation="border" /></td>
                    </tr>
                    : (
                        interview.length > 0 ? (
                            interview.map((item) => {
                                return (
                                    <tr key={item.id}>
                                        <td>{item.availability.date}</td>
                                        <td>{item.availability.start_time}</td>
                                        <td>{item.availability.end_time}</td>
                                        {role == 'candidate' ? (
                                            <td>{item.interviewer.name}</td>
                                        ) : (
                                            <td>{item.candidate.name}</td>
                                        )}
                                        {role == 'candidate' ? (
                                            <td>{item.interviewer.email}</td>
                                        ) : (
                                            <td>{item.candidate.email}</td>
                                        )}
                                        <td><Button variant="primary" size="sm" onClick={() => props.changeDetailMode(true, item.id)}>View</Button></td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colspan="6">No interviews on this day.</td>
                            </tr>
                        )
                    )}
            </tbody>
        </Table>
    </>
    );
}