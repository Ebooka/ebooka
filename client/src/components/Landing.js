import React, { Component } from 'react';
import FiltersList from './FiltersList';
import WritingsList from './WritingsList';
import { Container, Spinner } from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getWritings, getWritingsWithFilters, getWritingsWithFiltersAndBlocked, getWritingsWithBlocked } from '../actions/writingActions';
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

    componentDidUpdate(prevProps) {
        if(prevProps.writing.writings?.length < this.props.writing.writings?.length)
            this.setState({ incremented: false });
        console.log(this.state.checkedAuth, this.state.initialLoad, this.props.location.search);
        if(this.props.auth.user && this.state.initialLoad) {
            console.log('aca');
            if(this.props.location.search !== undefined && this.props.location.search !== '') {
                console.log('aca 2');
                this.props.getWritingsWithFiltersAndBlocked(this.props.location.search.split('?')[1], this.props.auth.user.id, this.state.pageNumber);
            } else {
                console.log('getWritingsWithBlocked')
                this.props.getWritingsWithBlocked(this.props.auth.user.id, this.state.pageNumber);
            }
            this.setState({ initialLoad: false });
        } else if(!this.props.auth.user && this.state.initialLoad){
            if(this.props.location.search !== undefined && this.props.location.search !== '') {
                this.props.getWritingsWithFilters(this.props.location.search.split('?')[1], this.state.pageNumber);
            } else {
                this.props.getWritings(this.state.pageNumber);
            }
            this.setState({ initialLoad: false });
        }
    }

    checkPosition = () => {
        if(!this.state.incremented && !this.state.initialLoad) {
            const container = document.getElementById('main');
            const top = container.scrollTop;
            const height = container.scrollHeight;
            if (top > Math.floor(height / 4)) {
                const nextPage = this.state.pageNumber + 1;

                this.setState({pageNumber: nextPage, incremented: true});
            }
        }
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        if(this.state.checkedAuth) {
            return (
                <div id="main" className="container p-0"
                     style={{position: 'fixed', top: 90, overflowY: 'scroll', left: '50%', transform: 'translate(-50%, 0)', maxWidth: '100%', height: '85vh'}}
                     onScroll={this.checkPosition}>
                    { !isAuthenticated &&
                        <div className="container banner">
                            <img src={`/assets/banner.jpg`} alt="banner" style={{minHeight: '50vh', height: '85vh', width: '100%'}}/>
                            <div className="welcome-header">Tu espacio para expresarte</div>
                            <div className="welcome-mid">Inspirate</div>
                            <div className="welcome-footer">Lee y escribí, donde y cuando quieras</div>
                        </div>
                    }
                    <div className="row" style={{width: '90%', display: 'flex', flexWrap: 'column', marginLeft: 'auto', marginRight: 'auto', marginTop: '1.5rem'}}>
                        <div className="col-md-3 col-12 ml-auto mr-auto">
                            <FiltersList/>
                            <hr/>
                            <EnterpriseLinks/>
                            <hr/>
                        </div>
                        <div className="col-md-9 col-12">
                            <WritingsList expanded={false}/>
                        </div>
                    </div>
                </div>
            )
        } else {
            return  <Container style={{textAlign: 'center'}}>
                        <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
                    </Container>

        }
    }
}

const mapStateToProps = (state) => ({
    writing: state.writing,
    auth: state.auth
});

export default connect(mapStateToProps, { getWritings, getWritingsWithFilters, getWritingsWithBlocked, getWritingsWithFiltersAndBlocked })(Landing);
