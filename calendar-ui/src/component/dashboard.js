import React, { useCallback, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Spinner from 'react-bootstrap/Spinner';
import Header from './theme/header'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import api from "../services/api";
import { connect } from 'react-redux'
import AvailabilityList from './availabilityList'
import { AvailabilityForm } from './availabilityDetails';
import InterviewList from './interviewList';
import { InterviewDetails } from './interviewDetails';
import { logout } from '../stores/userSlice'
import { useNavigate } from "react-router-dom";

class Dashboard extends React.Component {
    constructor(props,navigation) {
        super(props,navigation);
        this.state = {
            localizer: momentLocalizer(moment), show: false,
            selectedDate: "", startTime: null, endTime: null, editMode: false, availabilityId: "",
            detailMode: false, interviewId: "", events: [], key: "availabilites",
            isLoading: false
        }
    }


    handleClose = () => this.setState({ show: false });

    handleSelectSlot = ({ start, end, slots }) => {
        this.selectTab('availabilities');
        if (slots.length == 1 || this.props.user.role == 'candidate') {
            this.setState({ selectedDate: moment(start).format('YYYY-MM-DD') });
            this.setState({ EditMode: false });
            this.setState({ show: true });
        } else {
            this.setState({ selectedDate: moment(start).format('YYYY-MM-DD') });
            this.setState({ startTime: moment(start).format('HH:00') });
            this.setState({ endTime: moment(start).add(1, "hour").format('HH:00') });
            this.setState({ availabilityId: "" });
            this.setState({ editMode: true });
            this.setState({ show: true });
        }
    };

    handleSelectEvent = ({ start, id, type }) => {
        if (this.props.role == 'candidate') {
            this.selectTab('availabilities');
            this.setState({ selectedDate: moment(start).format('YYYY-MM-DD') });
            this.changeEditMode(false, "");
            this.setState({ show: true });
        } else {
            if (type == 'availability') {
                this.selectTab('availabilities');
                this.setState({ selectedDate: moment(start).format('YYYY-MM-DD') })
                this.changeEditMode(true, id);
                this.setState({ show: true });
            }
        }
        if (type == "interview") {
            this.selectTab('interviews');
            this.setState({ selectedDate: moment(start).format('YYYY-MM-DD') })
            this.changeDetailMode(true, id);
            this.setState({ show: true });
        }
    };
    changeEditMode(editMode, id) {
        this.setState({ availabilityId: id });
        this.setState({ editMode: editMode });
    }

    changeDetailMode(detailMode, id) {
        this.setState({ interviewId: id });
        this.setState({ detailMode: detailMode });
    }

    selectTab(k) {
        this.setState({ key: k });
        this.setState({ editMode: false });
        this.setState({ detailMode: false });
    }

    componentDidMount() {
        console.log("entrei");
        if (this.props.token == "") {
            //dispatch(logout());
            navigation.navigate('/');
        } else {
            this.loadAvailabilities();
        }
    }

    loadAvailabilities() {
        var newEvents = [];
        if (this.props.role == 'interviewer') {
            api.get("/availability", {
                headers: {
                    'Authorization': 'Bearer ' + this.props.token
                }
            })
                .then((response) => {
                    response.data.forEach((item) => {
                        var start_hour = item.start_time.split(":");
                        var end_hour = item.end_time.split(":");

                        var date = item.date.split('-');

                        var event = {
                            id: item.id,
                            title: "Availability @ " + moment(item.start_time, 'HH:mm:ss').format('HH:mm') + " - " + moment(item.end_time, 'HH:mm:ss').format('HH:mm'),
                            start: new Date(date[0], (date[1]) - 1, date[2], start_hour[0], 0, 0),
                            end: new Date(date[0], (date[1]) - 1, date[2], end_hour[0], 0, 0),
                            backgroundColor: "#5EBA7D",
                            type: "availability"
                        }
                        newEvents.push(event);
                    });
                    this.setState({ events: newEvents })
                })
                .catch((err) => {
                    console.log(err)
                }).finally((e) => {
                    this.loadInterviews(newEvents);
                });
        } else {
            api.get("/availability/free", {
                headers: {
                    'Authorization': 'Bearer ' + this.props.token
                }
            })
                .then((response) => {
                    response.data.forEach((item) => {
                        var start_hour = item.start_time.split(":");
                        var end_hour = item.end_time.split(":");

                        var date = item.date.split('-');

                        var event = {
                            id: item.id,
                            title: "Availability @ " + moment(item.start_time, 'HH:mm:ss').format('HH:mm') + " - " + moment(item.end_time, 'HH:mm:ss').format('HH:mm'),
                            start: new Date(date[0], (date[1]) - 1, date[2], start_hour[0], 0, 0),
                            end: new Date(date[0], (date[1]) - 1, date[2], end_hour[0], 0, 0),
                            backgroundColor: "#5EBA7D",
                            type: "availability"
                        }
                        newEvents.push(event);
                    });
                    this.setState({ events: newEvents })
                })
                .catch((err) => {
                    console.log(err)
                }).finally((e) => {
                    this.loadInterviews(newEvents);
                });
        }
    }

    loadInterviews(newEvents) {
        api.get("/interview", {
            headers: {
                'Authorization': 'Bearer ' + this.props.token
            }
        })
            .then((response) => {
                response.data.forEach((item) => {
                    var start_hour = item.availability.start_time.split(":");
                    var end_hour = item.availability.end_time.split(":");

                    var date = item.availability.date.split('-');
                    var event = {
                        id: item.id,
                        title: "Interview @ " + moment(item.availability.start_time, 'HH:mm:ss').format('HH:mm') + " - " + moment(item.availability.end_time, 'HH:mm:ss').format('HH:mm'),
                        start: new Date(date[0], (date[1]) - 1, date[2], start_hour[0], 0, 0),
                        end: new Date(date[0], (date[1]) - 1, date[2], end_hour[0], 0, 0),
                        backgroundColor: "blue",
                        type: "interview"
                    }
                    newEvents.push(event);
                });
                this.setState({ events: newEvents })
                this.setState({ isLoading: false });
            })
            .catch((err) => {
                console.log(err)
            });
    }

    render() {
        return (
            <Container fluid className="p-0">
                <Header></Header>
                <Container>
                    <Row className="mt-2">
                        <Col className="col-12">
                            <Card>
                                <Card.Header>Your Calendar</Card.Header>
                                <Card.Body>
                                    {this.props.role == 'interviewer' ? (

                                        <p>Select a day to list or create availability. You can list all your interviews too. </p>
                                    ) : (
                                        <p>See all interviewers availability, and select when you are available. </p>
                                    )}
                                    {this.state.isLoading ?
                                        <Col className="col-12 text-center">
                                            <Spinner animation="border" />
                                        </Col>
                                        :
                                        <Calendar
                                            localizer={this.state.localizer}
                                            startAccessor="start"
                                            endAccessor="end"
                                            onSelectSlot={this.handleSelectSlot}
                                            onSelectEvent={this.handleSelectEvent}
                                            events={this.state.events}
                                            selectable
                                            style={{ height: 500 }}
                                            views={
                                                {
                                                    month: true,
                                                    week: true,
                                                    day: true,
                                                }
                                            }
                                            eventPropGetter={(event) => {
                                                const backgroundColor = event.backgroundColor ? event.backgroundColor : 'blue';
                                                return { style: { backgroundColor } }
                                            }}
                                        />
                                    }
                                </Card.Body>
                            </Card>
                            <Modal show={this.state.show} onHide={this.handleClose} dialogClassName="modalWidth">
                                <Modal.Header closeButton>
                                    <Modal.Title>Day {this.state.selectedDate}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Tabs
                                        id="controlled-tab-example"
                                        activeKey={this.state.key}
                                        onSelect={(k) => this.selectTab(k)}
                                        className="mb-3">
                                        <Tab eventKey="availabilities" title="Availabilities">
                                            {this.props.role == 'interviewer' && (
                                                <Button variant="primary" onClick={() => { this.state.editMode ? this.changeEditMode(false, "") : this.changeEditMode(true, "") }}>{this.state.editMode ? "< Go Back to list" : "Add availability"}</Button>
                                            )}
                                            {this.state.editMode ?
                                                (
                                                    <AvailabilityForm date={this.state.selectedDate} id={this.state.availabilityId} startTime={this.state.startTime} endTime={this.state.endTime} callback={this.loadAvailabilities} />
                                                )
                                                : (
                                                    <AvailabilityList date={this.state.selectedDate} changeEditMode={this.changeEditMode} callback={this.loadAvailabilities} />
                                                )
                                            }
                                        </Tab>
                                        <Tab eventKey="interviews" title="Interviews">
                                            {this.state.detailMode ? (
                                                <>
                                                    <Button variant="primary" onClick={() => this.changeDetailMode(false, "")} >{"< Go Back to list"}</Button>
                                                    <InterviewDetails date={this.state.selectedDate} id={this.state.interviewId} />
                                                </>
                                            )
                                                :
                                                <InterviewList date={this.state.selectedDate} changeDetailMode={this.changeDetailMode} />
                                            }
                                        </Tab>
                                    </Tabs>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={this.handleClose}>
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </Container>)
    }
}

function mapStateToProps(state) {
    const { user } = state
    return user;
}

export default connect(mapStateToProps)(Dashboard);