import React, { Component } from 'react';
import axios from 'axios';
import BlockedAccount from './BlockedAccount';
import '../style/BlockedAccountsList.css';

export class BlockedAccountsList extends Component {
    
    state = {
        blockedAccounts: null,
    }

    componentDidMount() {
        const id = this.props.id;
        axios.get(`/api/users/blocked-accounts/${id}`)
            .then(res => {
                this.setState({ blockedAccounts: res.data })
            });
    }

    remove = (account) => {
        let copy = this.state.blockedAccounts;
        const idx = copy.indexOf(account);
        copy.splice(idx, 1);
        this.setState({ blockedAccounts: copy });
    }

    showAccounts = () => {
        if(this.state.blockedAccounts.length > 0) {
            return <div className={'blocked-accounts-container'}>
                {
                        this.state.blockedAccounts.map(account => (
                            <BlockedAccount account={account} action={this.remove}/>
                        ))
                }
            </div>;
            
        } else {
            return <h3>No hay cuentas bloqueadas</h3>
        }
    }

    render() {
        return this.state.blockedAccounts ? this.showAccounts() : 
            (
                <div style={{textAlign: 'center'}}>
                    <h3>Buscando...</h3>
                    <img src={'/assets/logo.png'} alt={'Loading'} height={50} width={50}/>
                </div>
            );
    }
}


export default BlockedAccountsList;
