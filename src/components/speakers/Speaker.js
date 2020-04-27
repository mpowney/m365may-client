import React from 'react';
// import { useParams } from 'react-router-dom';

import axios from 'axios';
import './Speaker.css';
import { Shimmer, ShimmerElementsGroup, ShimmerElementType } from '@fluentui/react';

class SpeakerProfile extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            speakerData: null,
            isError: false,
            isLoading: true
        };

    }

    componentDidMount() {
        
        const { match: { params } } = this.props.match ? this.props : { match: {params: {} } };
        axios.get(`https://click.m365may.com/data/speaker/${params.id || this.props.id}`).then( response => {
            this.setState({
                isLoading: false,
                speakerData: response.data
            });
        }).catch( error => { 
            this.setState({
                isLoading: false,
                isError: true,
                speakerData: null
            });
        });
    }
        
    render() {


        
        return (
            <div className="speakerProfile" style={{border: this.props.disableBorder ? `none` : undefined }}>
                { this.state.isLoading ? 
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col">
                            <Shimmer style={{marginBottom: 8}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[
                                    { type: ShimmerElementType.circle, height: 80 },
                                    { type: ShimmerElementType.gap, width: 10, height: 80 },
                                ]} /> }/>
                        </div>
                        <div className="ms-Grid-col ms-hiddenMdDown">
                            <Shimmer width={200} style={{marginBottom:6, marginTop: 8}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 20, width: 200 } ]} />} />
                            <Shimmer width={520} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 520 } ]} />} />
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-hiddenLgUp">
                            <Shimmer width={200} style={{marginBottom:9, marginTop: 8}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 200 } ]} />} />
                            <Shimmer width={280} style={{marginBottom:9 }} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 280 } ]} />} />
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col ms-hiddenMdDown">
                            <Shimmer width={660} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                    shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 660 } ]} />} />
                            <Shimmer width={680} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 680 } ]} />} />
                            <Shimmer width={650} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 650 } ]} />} />
                            <Shimmer width={660} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 660 } ]} />} />
                            <Shimmer width={320} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 320 } ]} />} />
                        </div>
                        <div className="ms-Grid-col ms-sm12 ms-hiddenLgUp">
                            <Shimmer width={260} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                    shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 260 } ]} />} />
                            <Shimmer width={300} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 300 } ]} />} />
                            <Shimmer width={290} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 290 } ]} />} />
                            <Shimmer width={270} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 270 } ]} />} />
                            <Shimmer width={120} style={{marginBottom:9}} customElementsGroup={<ShimmerElementsGroup
                                shimmerElements={[ { type: ShimmerElementType.line, height: 15, width: 120 } ]} />} />
                        </div>
                    </div>
                </div>
                :
                <div className="ms-Grid" dir="ltr">
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col">
                            { this.state.speakerData && <div style={{backgroundImage: `url(${this.state.speakerData.profilePicture}`}} className={`profileImage ms-motion-fadeIn`}></div> }
                        </div>
                        <div className="ms-Grid-col">
                            { this.state.speakerData && <>
                                <div className="fullName">{this.state.speakerData.fullName}</div>
                                <div className="tagLine">{this.state.speakerData.tagLine}</div>
                            </>}
                        </div>
                    </div>
                    <div className="ms-Grid-row">
                        <div className="ms-Grid-col">
                            { this.state.speakerData && <div className="bio" dangerouslySetInnerHTML={{__html: (this.state.speakerData.bio || "").replace(/\r\n/gi, "<br/>")}}></div> }
                        </div>
                    </div>
                </div>}

            </div>
        );
      
    }
};

export default SpeakerProfile;
