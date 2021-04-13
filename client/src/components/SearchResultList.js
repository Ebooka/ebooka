import React, { Component } from 'react'
import Result from './Result';
import '../style/ResultsFilter.css';

class SearchResultList extends Component {

    writingsResult = () => (
            <div>
                <h5>Escritos publicados:</h5>
                {this.props.filter ?
                    this.props.results.map(result => (
                        <Result data={result} type={'writing'}/>
                    ))
                    :
                    this.props.results[0].map(result => (
                        <Result data={result} type={'writing'}/>
                    ))
                }
            </div>
    )

    usersResult = () => (
        <div>
            <h5>Usuarios:</h5>
            {this.props.filter ?
                this.props.results.map(result => (
                    <Result data={result} type={'user'}/>
                ))
               :
                this.props.results[1].map(result => (
                    <Result data={result} type={'user'}/>
                ))
            }
        </div>
    )

    filterByWriting = (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = window.location.href.split('?')[0] + '?filter=writings';
    }

    filterByUsername = (event) => {
        event.preventDefault();
        event.stopPropagation();
        window.location.href = window.location.href.split('?')[0] + '?filter=users';
    }

    filters = () => (
        <div className="filter-container">
            <div className="writings-clickable" onClick={this.filterByWriting}>
                <img src="/assets/book.png" width="50" height="50" alt="icono-escritos"/>
                <label className="filter-label">Escritos</label>
            </div>
            <div className="users-clickable" onClick={this.filterByUsername}>
                <img src="/assets/user.png" width="50" height="50" alt="icono-usuarios"/>
                <label className="filter-label">Usuarios</label>
            </div>
        </div>
    )

    render() {
        if(!this.props.filter && this.props.results[0].length === 0 && this.props.results[1].length === 0) {
            return (
                <div style={{position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)'}}>
                    <h4>No se han encontrado resultados</h4>
                </div>
            );
        } else if(this.props.filter) {
            return (
                <div className="container" style={{display: 'flex', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%', overflowY: 'scroll'}}>
                    <div className="row">
                        <div className="col-sm-3">
                            <h3>Resultados de la búsqueda <i>{this.props.term}</i></h3>
                            <hr/>
                            <h5>Filtros</h5>
                            {this.filters()}
                        </div>
                        <div className="col-sm-9">
                            {this.props.filter === 'writings' ? this.writingsResult() : this.usersResult()}
                        </div>
                    </div>
                </div>
            );
        } else {
            return (
                <div className="container" style={{display: 'flex', position: 'fixed', top: 90, left: '50%', transform: 'translate(-50%, 0)', height: '90%', overflowY: 'scroll'}}>

                    <div className="row">
                        <div className="col-sm-3">
                            <h3>Resultados de la búsqueda <i>{this.props.term}</i></h3>
                            <hr/>
                            {this.props.results[0].length > 0 && this.props.results[1].length > 0 ? <h5>Filtros</h5> : null}
                            {this.props.results[0].length > 0 && this.props.results[1].length > 0 ? this.filters() : null}
                        </div>
                        <div className="col-sm-9">
                            {this.props.results[0].length > 0 ? this.writingsResult() : null}
                            {this.props.results[1].length > 0 ? this.usersResult() : null}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default SearchResultList
