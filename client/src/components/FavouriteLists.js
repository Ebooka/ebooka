import React, {Component} from 'react';
import Writing from './Writing';
import Ad from './Ad';
import '../style/WritingsList.css'

class FavouriteLists extends Component {

    render() {
        let favs = this.props.favs;
        return (
            <div style={{maxHeight: '90vh', width: '100%', padding: 0}}>
                {favs ? favs.map((writing, idx) => {
                    if(idx % 4 === 3)
                        return (
                            <div>
                                <Ad/>
                                <Writing current={writing} expanded={"true"}/>
                            </div>);
                    return (<Writing current={writing} expanded={"true"}/>);
                }) : null}
            </div>
        );
    }
}

export default FavouriteLists;