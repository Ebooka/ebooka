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
        incremented: false
    }

    static propTypes = {
        getWritings: PropTypes.func.isRequired,
        getWritingsWithFilters: PropTypes.func.isRequired,
        writing: PropTypes.object.isRequired,
    }

    componentDidMount() {
        if(this.props.location.search !== undefined && this.props.location.search !== '') {
            this.props.getWritingsWithFilters(this.props.location.search.split('?')[1], this.state.pageNumber);
        } else {
            this.props.getWritings(this.state.pageNumber);
        }
    }

    componentDidUpdate(prevProps) {
        if(prevProps.writing.writings && this.props.writing.writings && prevProps.writing.writings.length < this.props.writing.writings.length)
            this.setState({incremented: false});
        if(prevProps.auth.isLoading && !this.props.auth.isLoading)
            this.setState({ checkedAuth: true });
        if(this.props.auth.user !== prevProps.auth.user && this.props.auth.user) {
            if(this.props.location.search !== undefined && this.props.location.search !== '') {
                this.props.getWritingsWithFiltersAndBlocked(this.props.location.search.split('?')[1], this.props.auth.user.id, 1);
            } else {
                this.props.getWritingsWithBlocked(this.props.auth.user.id, 1);
            }
        }
    }

    checkPosition = () => {
        const container = document.getElementById('main');
        const top = container.scrollTop;
        const height = container.scrollHeight;
        if(top > Math.floor(height/4) && !this.state.incremented) {
            const nextPage = this.state.pageNumber + 1;
            this.props.getWritings(nextPage);
            this.setState({pageNumber: nextPage, incremented: true});
        }
    }

    render() {
        const { isAuthenticated } = this.props.auth;
        if(this.state.checkedAuth) {
            return (
                <div id="main" className="container p-0" style={{position: 'fixed', top: 90, overflowY: 'scroll', left: '50%', transform: 'translate(-50%, 0)', maxWidth: '100%', height: '85vh'}} onScroll={this.checkPosition}>
                    { !isAuthenticated ? (<div className="container banner">
                                            <img src={`/assets/banner.jpg`} alt="banner" style={{minHeight: '50vh', height: '85vh', width: '100%'}}/>
                                            <div className="welcome-header">Tu espacio para expresarte</div>
                                            <div className="welcome-mid">Inspirate</div>
                                            <div className="welcome-footer">Lee y escribí, donde y cuando quieras</div>
                                        </div>) : null
                    }
                    <div className="row" style={{width: '90%', display: 'flex', flexWrap: 'column', marginLeft: 'auto', marginRight: 'auto', marginTop: '1.5rem'}}>
                        <div className="col-md-3 col-12 ml-auto mr-auto">
                            <FiltersList/>
                            <hr/>
                            <EnterpriseLinks/>
                            <hr/>
                        </div>
                        <div className="col-md-9 col-12">
                            <WritingsList filteredWritings={this.writing} expanded={false}/>
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <Container style={{textAlign: 'center'}}>
                    <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
                </Container>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    writing: state.writing,
    auth: state.auth
});

export default connect(mapStateToProps, { getWritings, getWritingsWithFilters, getWritingsWithBlocked, getWritingsWithFiltersAndBlocked })(Landing);
