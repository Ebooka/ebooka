import React, {Component} from 'react';
import { Container, Spinner } from 'reactstrap';
import { connect } from 'react-redux';
import Writing from './Writing';
import '../style/WritingsList.css'
import InfiniteScroll from 'react-infinite-scroll-component';
import {
    getWritings,
    getWritingsWithFilters,
    getWritingsWithFiltersAndBlocked,
    getWritingsWithBlocked,
    getGenre, getSubgenre
} from '../actions/writingActions';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

const FETCH_FUNCTIONS = {
    REGULAR: 'REGULAR',
    FILTERS_ONLY: 'FILTERS_ONLY',
    BLOCKED_ONLY: 'BLOCKED_ONLY',
    FILTER_AND_BLOCKED: 'FILTER_AND_BLOCKED',
    BY_GENRE: 'BY_GENRE',
    BY_SUBGENRE: 'BY_SUBGENRE',
};

class WritingsList extends Component {

    state = {
        totalCount: 0,
        page: 0,
        fetchFunction: null,
    };

    componentDidMount() {
        let url;
        if(this.props.subgenre) {
            url = `/api/writings/get-count-by-subgenre/${this.props.genre}/${this.props.subgenre}`;
            this.setState({fetchFunction: FETCH_FUNCTIONS.BY_SUBGENRE});
        } else if(this.props.genre) {
            url = `/api/writings/get-count-by-genre/${this.props.genre}`;
            this.setState({fetchFunction: FETCH_FUNCTIONS.BY_GENRE});
        } else if(this.props.user) {
            if(window.location.search !== undefined && window.location.search !== '') {
                const filters = this.props.location.search.split('?')[1];
                const userId = this.props.user.id;
                url = `/api/writings/get-count-filters-blocked/${filters}/${userId}/`;
                this.props.getWritingsWithFiltersAndBlocked(filters, userId, 0);
                this.setState({ fetchFunction: FETCH_FUNCTIONS.FILTER_AND_BLOCKED })
            } else {
                url = `/api/writings/get-count-blocked/${this.props.user.id}/`;
                this.setState({ fetchFunction: FETCH_FUNCTIONS.BLOCKED_ONLY })
            }
        } else {
            if(window.location.search !== undefined && window.location.search !== '') {
                const filters = this.props.location.search.split('?')[1];
                url = `/api/writings/get-count-filters/${filters}/`;
                this.setState({ fetchFunction: FETCH_FUNCTIONS.FILTERS_ONLY })
            } else {
                url = `/api/writings/get-count/`;
                this.setState({ fetchFunction: FETCH_FUNCTIONS.REGULAR })
            }
        }
        axios.get(url)
            .then(res => {
                this.setState({ totalCount: parseInt(res.data.count) });
                this.getNext();
            })
            .catch(err => this.setState({ totalCount: -1 }));
    }

    getNext = () => {
        const page = this.state.page;
        this.setState({ page: this.state.page + 1 });
        switch (this.state.fetchFunction) {
            case FETCH_FUNCTIONS.FILTER_AND_BLOCKED: {
                const filters = this.props.location.search.split('?')[1];
                const userId = this.props.user.id;
                this.props.getWritingsWithFiltersAndBlocked(filters, userId, page);
                break;
            }
            case FETCH_FUNCTIONS.FILTERS_ONLY: {
                const filters = this.props.location.search.split('?')[1];
                this.props.getWritingsWithFilters(filters, page);
                break;
            }
            case FETCH_FUNCTIONS.BLOCKED_ONLY: {
                const userId = this.props.user.id;
                this.props.getWritingsWithBlocked(userId, page);
                break;
            }
            case FETCH_FUNCTIONS.BY_GENRE: {
                this.props.getGenre(this.props.fullUrl, page);
                break;
            }
            case FETCH_FUNCTIONS.BY_SUBGENRE: {
                this.props.getSubgenre(this.props.fullUrl, page);
                break;
            }
            default: {
                this.props.getWritings(page);
                break;
            }
        }
    }

    loadedContent = () => {
        const style = this.props.style;
        if(this.props.writings && this.props.writings.length === 0)
            return (
                <Container style={{ textAlign: 'center', width: '100%' }}>
                    <h3>No hay resultados</h3>
                </Container>
            );
        else
            return (
                <div style={{overflowY: 'hidden', height: '85vh', maxHeight: '90vh', width: '100%', padding: 0, ...style}}>
                    <InfiniteScroll next={this.getNext}
                                    height={'100%'}
                                    hasMore={this.props.writings.length < this.state.totalCount}
                                    loader={<Spinner size={'sm'} color={'dark'}/>}
                                    dataLength={this.props.writings.length}
                    >
                    {this.props.writings.map((writing, idx) => {
                        /*if(idx % 4 === 3)
                            return (
                                <div>
                                    <Ad/>
                                    <Writing current={writing} expanded={this.props.expanded}/>
                                </div>);*/
                        return (<Writing current={writing} expanded={this.props.expanded}/>);
                    })}
                    </InfiniteScroll>
                </div>
            );
    };

    loadingContent = () => (
        <Container className="col-6" style={{ textAlign: 'center' }}>
            <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
        </Container>
    );

    render() {
        return (
            this.props.writings === null ? this.loadingContent() : this.loadedContent()
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.auth.user,
    writings: state.writing.writings,
});

export default connect(mapStateToProps, { getWritings, getGenre, getSubgenre, getWritingsWithFilters, getWritingsWithBlocked, getWritingsWithFiltersAndBlocked })(withRouter(WritingsList));
