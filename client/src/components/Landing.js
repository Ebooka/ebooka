import React, { Component } from 'react';
import FiltersList from './FiltersList';
import WritingsList from './WritingsList';
import { connect } from 'react-redux';
import '../style/OverlayBanner.css';
import EnterpriseLinks from "./EnterpriseLinks";

class Landing extends Component {

    state = {
        checkedAuth: false,
        pageNumber: 0,
        incremented: false,
        getter: null,
        initialLoad: true,
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        return (
            <div id="main"
                 className="container p-0"
                 style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', maxWidth: '100%', height: '85vh'}}
            >
                { !isAuthenticated &&
                    <div className="container banner">
                        {/* <img src={`/assets/banner.jpg`} alt="banner" style={{minHeight: '50vh', height: '85vh', width: '100%'}}/>
                        <div className="welcome-header">Tu espacio para expresarte</div>
                        <div className="welcome-mid">Inspirate</div>
                        <div className="welcome-footer">Lee y escribí, donde y cuando quieras</div>*/}
                    </div>
                }
                <div className="row" style={{width: '90%', display: 'flex', flexWrap: 'column', marginLeft: 'auto', marginRight: 'auto', marginTop: '1.5rem'}}>
                    <div className="col-md-3 col-12 ml-auto mr-auto">
                        <FiltersList showCategories/>
                        <hr/>
                        <EnterpriseLinks/>
                        <hr/>
                    </div>
                    <div className="col-md-9 col-12" style={{paddingRight: 0}}>
                        <WritingsList expanded={false}/>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    writing: state.writing,
    auth: state.auth
});

export default connect(mapStateToProps, null)(Landing);
