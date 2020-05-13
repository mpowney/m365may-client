import React from 'react';
import { AnimationStyles } from '@fluentui/react/lib/Styling';

import './JoinNow.css';
import { Icon } from '@fluentui/react';

class JoinNow extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            videoIconCycle: 1,
        };

        this.cycleVideoIcons = this.cycleVideoIcons.bind(this);

    }

    componentDidMount() {
        
        this.cycleInterval = window.setInterval(this.cycleVideoIcons, 500);

    }

    componentWillUnmount() {

        window.clearInterval(this.cycleInterval);
        
    }
        
    cycleVideoIcons() {
        let videoIconCycle = this.state.videoIconCycle + 1;
        if (videoIconCycle > 3) {
            videoIconCycle = 1;
        }
        this.setState({
            videoIconCycle: videoIconCycle
        })
    }
    
    render() {

        return (<div className="sessionCalendarNowLive">
            <span><a href={this.props.href} target="_top">
                <Icon iconName="Volume3" className={`videoIcon videoIcon1 ${this.state.videoIconCycle < 3 && 'videoIconHidden'}`} style={{ ...AnimationStyles.fadeIn100 }} />
                <Icon iconName="Volume2" className={`videoIcon videoIcon2 ${this.state.videoIconCycle < 2 && 'videoIconHidden'}`} style={{ ...AnimationStyles.fadeIn100}} />
                <Icon iconName="Volume1" className={`videoIcon videoIcon3 `} style={{ ...AnimationStyles.fadeIn100}} /> {this.props.label}</a></span>
        </div>);
      
    }
};

export default JoinNow;
