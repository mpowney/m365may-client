import React from 'react';
// import { useParams } from 'react-router-dom';
import { AnimationStyles } from '@fluentui/react/lib/Styling';

import axios from 'axios';
import './Session.css';
import SpeakerProfile from '../speakers/Speaker';
import JoinNow from './JoinNow';
import { Icon } from '@fluentui/react';
import { SESSIONS_JSON, VIDEOS_JSON } from './../../index';

class Session extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sessionData: null,
            videosData: [],
            isError: false,
            isLoading: true
        };

        this.cycleCheckSessions = this.cycleCheckSessions.bind(this);

    }

    componentDidMount() {
        
        const bufferMinutes = parseInt(this.getParameterByName('buffer') || 5);
        const offsetMinutes = parseInt(this.getParameterByName('offset') || 0);

        const bufferMilliseconds = bufferMinutes * 60 * 1000;
        const offsetMilliseconds = offsetMinutes * 60 * 1000;

        const now = new Date(new Date().getTime() + offsetMilliseconds);
        const nowISO = now.toISOString();
        console.log(`Current time: ${now}, ${offsetMinutes}`);

        const { match: { params } } = this.props.match ? this.props : { match: {params: {} } };
        axios.get(SESSIONS_JSON).then( response => {
            const filteredSession = response.data[0].sessions.filter(session => { return session.id === (params.id || this.props.id) });
            if (filteredSession && filteredSession.length && filteredSession.length > 0) {
                this.setState({
                    isLoading: false,
                    sessionData: this.checkSession(filteredSession[0], nowISO, bufferMilliseconds)
                });
            } else {
                this.setState({
                    isLoading: false
                });
            }
        }).catch( error => { 
            axios.get(`${process.env.REACT_APP_AZ_FUNCTION_HOST}/calendar/session/${params.id || this.props.id}`).then( response => {
                this.setState({
                    isLoading: false,
                    sessionData: this.checkSession(response.data, nowISO, bufferMilliseconds)
                });
            }).catch( error => { 
                this.setState({
                    isLoading: false,
                    isError: true,
                    sessionData: null
                });
            });
        });

        axios.get(VIDEOS_JSON).then( response => {
            this.setState({
                videosData: response.data
            });
        }).catch(error => {
            this.setState({
                videosData: []
            });
        });

        window.setInterval(this.cycleCheckSessions, 20000);

    }
        
    checkSession(session, nowISO, bufferMilliseconds) {

        if (session) {

            const forceLiveLink = (this.getParameterByName('force') || "").length > 0;

            if (forceLiveLink || (new Date(nowISO).getTime() > new Date(session.startsAt).getTime() - bufferMilliseconds
                && new Date(nowISO).getTime() < new Date(session.endsAt).getTime() + bufferMilliseconds)) {
                    session.showLiveLink = true;
            }

        }

        return session;
    }

    getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    cycleCheckSessions() {
        const bufferMinutes = parseInt(this.getParameterByName('buffer') || 5);
        const offsetMinutes = parseInt(this.getParameterByName('offset') || 0);

        const bufferMilliseconds = bufferMinutes * 60 * 1000;
        const offsetMilliseconds = offsetMinutes * 60 * 1000;

        const now = new Date(new Date().getTime() + offsetMilliseconds);
        const nowISO = now.toISOString();
        console.log(`Current time: ${now}, ${offsetMinutes}`);

        this.setState({
            sessionData: this.checkSession(this.state.sessionData, nowISO, bufferMilliseconds)
        });
    }

    render() {

        const { DateTime } = require("luxon");
        const { match: { params } } = this.props.match ? this.props : { match: {params: {} } };

        return this.state.sessionData && (
                <div className="sessionItem" key={this.state.sessionData.id} style={AnimationStyles.slideDownIn20}>
                    <div className="sessionTitle">
                        {this.state.sessionData.title}
                    </div>
                    <div className="sessionDescription">
                        {this.state.sessionData.description}
                    </div>
                    <div className="sessionTime">
                        <span>{DateTime.fromISO(this.state.sessionData.startsAt).toFormat('EEE d MMM h:mma')} - {DateTime.fromISO(this.state.sessionData.endsAt).toFormat('h:mma')}</span>
                    </div>
                    <div className="sessionTimespan">
                        <span>{DateTime.fromISO(this.state.sessionData.endsAt).diff(DateTime.fromISO(this.state.sessionData.startsAt), 'minutes').minutes} minutes</span>
                    </div>
                    <div className="sessionCalendarLink">
                        <span><a href={`${process.env.REACT_APP_AZ_FUNCTION_HOST}/calendar/session/${params.id || this.props.id}?ical`}><Icon iconName="CalendarReply" /> Add to calendar</a></span>
                    </div>
                    {this.state.sessionData.showLiveLink && <JoinNow href={`${process.env.REACT_APP_AZ_FUNCTION_HOST}/redirect/session/${this.state.sessionData.id}/`} label={` Join now`} /> }
                    {(this.state.videosData.filter(video => { return (video.RowKey || video.rowKey) === this.state.sessionData.id; }).length > 0) && <div className="sessionVideoLink">
                            <span><a href={`${process.env.REACT_APP_AZ_FUNCTION_HOST}/redirect/video/${this.state.sessionData.id}/`} target="_blank"><Icon iconName="MSNVideosSolid" /> Watch the recording</a></span>
                        </div>}
                    <div className="sessionSpeakers">
                        {this.state.sessionData.speakers.map( speaker => {
                            return <SpeakerProfile disableBorder={true} disablePadding={true} id={speaker.id} />
                        })}
                    </div>
                </div>);
      
    }
};

export default Session;
