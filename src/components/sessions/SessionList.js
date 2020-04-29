import React from 'react';
import { Icon, DatePicker, DayOfWeek, DefaultButton, Dropdown, Callout, TextField, Shimmer } from '@fluentui/react';
import { AnimationStyles } from '@fluentui/react/lib/Styling';

import axios from 'axios';
import './SessionList.css';
import SpeakerProfile from '../speakers/Speaker';

class SessionList extends React.Component {

    constructor(props) {
        super(props);

        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(),  new Date().getDate());
        const startOfMay = new Date(2020, 4, 1);
        const endOfMay = new Date(2020, 5, 1);
        const dummySession = {
            "questionAnswers": [],
            "id": "0",
            "title": "dummy",
            "description": "dummy",
            "startsAt": "2020-05-01T03:00:00Z",
            "endsAt": "2020-05-01T03:45:00Z",
            "isServiceSession": false,
            "isPlenumSession": false,
            "speakers": [
              {
                "id": "aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee",
                "name": "dummy"
              }
            ],
            "categories": [],
            "roomId": 0,
            "room": "dummy"
        };

        let defaultDateFilterValue = today.getTime() < startOfMay.getTime() ? startOfMay : today;
        defaultDateFilterValue = today.getTime() > endOfMay.getTime() ? endOfMay : defaultDateFilterValue;

        this.state = {
            sessionData: [ { ...dummySession, id: "1"}, { ...dummySession, id: "2"}, { ...dummySession, id: "3"}, { ...dummySession, id: "4"}],
            sorting: [ { fieldName: 'startsAt', isSorted: true, isSortedDescending: false }],
            dateFilter: defaultDateFilterValue,
            speakerFilter: null,
            wordFilter: null,
            speakerCalloutTarget: null,
            speakerCalloutId: null,
            isLoading: true
        }

        this.updateDateFilter = this.updateDateFilter.bind(this);
        this.updateSpeakerFilter = this.updateSpeakerFilter.bind(this);
        this.updateWordFilter = this.updateWordFilter.bind(this);
        this.clickSpeaker = this.clickSpeaker.bind(this);
        this.clearSpeakerCallout = this.clearSpeakerCallout.bind(this);
    }

    componentDidMount() {
        axios.get('https://click.m365may.com/data/sessions').then( response => {
            this.setState({
                isLoading: false,
                sessionData: response.data[0].sessions
            });
        }).catch(error => {
            this.setState({
                isLoading: false,
                sessionData: []
            });
        })
    }
    
    applySorting(items, sorting) {
        let returnItems = [...(items || [])];
        for (const sortOption of sorting) {
            returnItems.sort((a, b) => {
                if (sortOption.isSortedDescending) {
                    if (a[sortOption.fieldName] > b[sortOption.fieldName]) {
                        return -1;
                    }
                    if (a[sortOption.fieldName] < b[sortOption.fieldName]) {
                        return 1;
                    }
                    return 0;
                } else {
                    if (a[sortOption.fieldName] < b[sortOption.fieldName]) {
                        return -1;
                    }
                    if (a[sortOption.fieldName] > b[sortOption.fieldName]) {
                        return 1;
                    }
                    return 0;
                }
            });
        }
        return returnItems;
    }

    updateDateFilter(value) {
        this.setState({
            dateFilter: value
        });
    }

    updateSpeakerFilter(el, selectedOption) {
        this.setState({
            dateFilter: null,
            speakerFilter: selectedOption.key
        });
    }

    updateWordFilter(el, value) {
        this.setState({
            wordFilter: value
        });
    }

    clickSpeaker(id) {
        this.setState({
            speakerCalloutTarget: `speaker-${id}`,
            speakerCalloutId: id
        })
    }
    clearSpeakerCallout() {
        this.setState({
            speakerCalloutTarget: null,
            speakerCalloutId: null
        })
    }
    
    render() {
        
        const DayPickerStrings = {
            months: [
              'January',
              'February',
              'March',
              'April',
              'May',
              'June',
              'July',
              'August',
              'September',
              'October',
              'November',
              'December',
            ],
          
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          
            days: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          
            shortDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
          
            goToToday: 'Go to today',
            prevMonthAriaLabel: 'Go to previous month',
            nextMonthAriaLabel: 'Go to next month',
            prevYearAriaLabel: 'Go to previous year',
            nextYearAriaLabel: 'Go to next year',
            closeButtonAriaLabel: 'Close date picker',
        };

        const { DateTime } = require("luxon");
        let items = this.state.sessionData;
        if (this.state.dateFilter && items) {
            items = items.filter(session => DateTime.fromISO(session.startsAt).toFormat('yyyy-MM-dd') === DateTime.fromJSDate(this.state.dateFilter).toFormat('yyyy-MM-dd'));
        }
        if (this.state.speakerFilter && items) {
            items = items.filter(session => session.speakers.filter(speaker => speaker.id === this.state.speakerFilter).length > 0);
        }
        if (this.state.wordFilter && items) {
            items = items.filter(session => (session.title || "").toLowerCase().indexOf(this.state.wordFilter.toLowerCase()) >= 0 || (session.description || "").toLowerCase().indexOf(this.state.wordFilter.toLowerCase()) >= 0);
        }
        if (!this.state.isLoading) items = this.applySorting(items, this.state.sorting);

        let speakers = [];
        if (this.state.sessionData) {
            for (const session of this.state.sessionData)
                for (const speaker of session.speakers)
                    if (speakers.filter(checkSpeaker => checkSpeaker.id === speaker.id).length === 0)
                        speakers.push( { name: speaker.name.trim(), id: speaker.id } );
        }
        speakers = this.applySorting(speakers, [ { fieldName: 'name', isSorted: true, isSortedDescending: false }]);

        return (
            <div className="sessionList">
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col">
                            <DatePicker
                                value={this.state.dateFilter}
                                label="Show sessions for"
                                className="datePicker"
                                firstDayOfWeek={DayOfWeek.Monday}
                                strings={DayPickerStrings}
                                placeholder="Select a date..."
                                ariaLabel="Select a date"
                                onSelectDate={this.updateDateFilter}
                                isMonthPickerVisible={false}
                            />
                            <DefaultButton onClick={() => { this.setState({dateFilter: null})}} text="Clear" className="clearDatePickerButton" />

                        </div>
                        <div className="ms-Grid-col">
                            <Dropdown 
                                selectedKey={this.state.speakerFilter}
                                placeholder="Select a speaker"
                                label="By speaker"
                                options={speakers.map(speaker => { return { key: speaker.id, text: speaker.name }})}
                                onChange={this.updateSpeakerFilter}
                                className="speakerDropDown" />
                            <DefaultButton onClick={() => { this.setState({speakerFilter: null})}} text="Clear" className="clearSpeakerButton" />
                        </div>
                        <div className="ms-Grid-col">
                            <TextField value={this.state.wordFilter} className="wordFilterTextField" label="Filter by words" iconProps={{ iconName: 'Search' }} onChange={this.updateWordFilter} />
                            <DefaultButton onClick={() => { this.setState({wordFilter: null})}} text="Clear" className="clearWordButton" />
                        </div>
                    </div>
                </div>

                {this.state.speakerCalloutId && <Callout
                    className="speakerCallout"
                    role="alertdialog"
                    gapSpace={0}
                    target={`.${this.state.speakerCalloutTarget}`}
                    onDismiss={this.clearSpeakerCallout}
                    setInitialFocus>
                        <SpeakerProfile id={this.state.speakerCalloutId} disableBorder={true} />
                    </Callout> }

                { items && items.map(session => {
                    return this.state.isLoading ? (
                            <div className="sessionItem" key={session.id} style={AnimationStyles.slideDownIn20}>
                                <div className="ms-Grid">
                                    <div className="ms-Grid-row">
                                        <div className="ms-Grid-col ms-hiddenLgDown">
                                            <Shimmer width={120} height={15} style={{marginBottom: 9}} />
                                            <div className="sessionTitle">
                                                <Shimmer width={360} height={20} style={{marginBottom: 12}} />
                                            </div>
                                            <div className="sessionDescription">
                                                <Shimmer width={820} height={15} style={{marginBottom: 9}} />
                                                <Shimmer width={870} height={15} style={{marginBottom: 9}} />
                                                <Shimmer width={850} height={15} style={{marginBottom: 9}} />
                                                <Shimmer width={860} height={15} style={{marginBottom: 9}} />
                                                <Shimmer width={400} height={15} style={{marginBottom: 9}} />
                                            </div>
                                            <div className="sessionTime">
                                                <Shimmer width={200} height={15} style={{marginBottom: 9}} />
                                            </div>
                                            <div className="sessionTimespan">
                                                <Shimmer width={90} height={15} style={{marginBottom: 9}} />
                                            </div>

                                        </div>
                                        <div className="ms-Grid-col ms-hiddenXlUp">
                                            <Shimmer width={120} height={15} style={{marginBottom: 9}} />
                                            <div className="sessionTitle">
                                                <Shimmer width={280} height={20} style={{marginBottom: 12}} />
                                            </div>
                                            <div className="sessionDescription">
                                                <Shimmer width={260} height={15} style={{marginBottom: 9}} />
                                                <Shimmer width={280} height={15} style={{marginBottom: 9}} />
                                                <Shimmer width={270} height={15} style={{marginBottom: 9}} />
                                                <Shimmer width={250} height={15} style={{marginBottom: 9}} />
                                                <Shimmer width={160} height={15} style={{marginBottom: 9}} />
                                            </div>
                                            <div className="sessionTime">
                                                <Shimmer width={200} height={15} style={{marginBottom: 9}} />
                                            </div>
                                            <div className="sessionTimespan">
                                                <Shimmer width={90} height={15} style={{marginBottom: 9}} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>)
                        :
                        (<div className="sessionItem" key={session.id} style={AnimationStyles.slideDownIn20}>
                                {session.speakers.map( speaker => {
                                    return <span className={`sessionSpeaker speaker-${speaker.id}`} key={speaker.id} onClick={() => this.clickSpeaker(speaker.id)}>{speaker.name}</span>
                                })}
                                <div className="sessionTitle">
                                    <a target="_top" href={`https://www.m365may.com/session-details/${session.id}`}>{session.title}</a>
                                </div>
                                <div className="sessionDescription">
                                    {session.description}
                                </div>
                                <div className="sessionTime">
                                    <span>{DateTime.fromISO(session.startsAt).toFormat('EEE d MMM h:mma')} - {DateTime.fromISO(session.endsAt).toFormat('h:mma')}</span>
                                </div>
                                <div className="sessionTimespan">
                                    <span>{DateTime.fromISO(session.endsAt).diff(DateTime.fromISO(session.startsAt), 'minutes').minutes} minutes</span>
                                </div>
                                <div className="sessionCalendarLink">
                                    <span><a href={`https://click.m365may.com/calendar/session/${session.id}?ical`}><Icon iconName="CalendarReply" /> Add to calendar</a></span>
                                </div>
                            </div>);

                })}
            </div>
        );
      
    }
};

export default SessionList;
