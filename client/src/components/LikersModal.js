import React, {Component} from "react";
import {Modal, ModalBody, ModalHeader, Spinner} from "reactstrap";
import LikeRow from "./LikeRow";

class LikersModal extends Component {


    render() {
        return (
            <Modal className={'my-modal'}
                   isOpen={this.props.isOpen}
                   toggle={this.props.toggle}>
                <ModalHeader>Me gusta</ModalHeader>
                <ModalBody>
                {
                    !this.props.loading &&
                    this.props.likes.length > 0 &&
                    this.props.likes.map(like => <LikeRow like={like}/>)
                }
                {
                    !this.props.loading &&
                    this.props.likes.length === 0 &&
                    <span>A nadie le ha gustado este escrito aún. ¡Se el primero!</span>
                }
                {
                    (this.props.loading || !this.props.likes) &&
                        <div className={'spinner-container'}>
                            <Spinner size={'sm'}/>
                        </div>
                }
                </ModalBody>
            </Modal>
        )
    }
}

export default LikersModal;
