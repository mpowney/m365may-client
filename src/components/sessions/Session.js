import React from 'react';
// import { useParams } from 'react-router-dom';
import { AnimationStyles } from '@fluentui/react/lib/Styling';

import axios from 'axios';
import './Session.css';
import SpeakerProfile from '../speakers/Speaker';
import { Icon } from '@fluentui/react';

class Session extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sessionData: null,
            isError: false,
            isLoading: true
        };

    }

    componentDidMount() {
        
        const { match: { params } } = this.props.match ? this.props : { match: {params: {} } };
        axios.get(`https://click.m365may.com/calendar/session/${params.id || this.props.id}`).then( response => {
            this.setState({
                isLoading: false,
                sessionData: response.data
            });
        }).catch( error => { 
            this.setState({
                isLoading: false,
                isError: true,
                sessionData: null
            });
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
                        <span><a href={`https://click.m365may.com/calendar/session/${params.id || this.props.id}?ical`}><Icon iconName="CalendarReply" /> Add to calendar</a></span>
                    </div>
                    <div className="sessionSpeakers">
                        {this.state.sessionData.speakers.map( speaker => {
                            return <SpeakerProfile disableBorder={true} disablePadding={true} id={speaker.id} />
                        })}
                    </div>
                </div>);
      
    }
};

export default Session;
