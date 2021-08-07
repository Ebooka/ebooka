import {Alert, Modal, ModalBody, ModalHeader} from "reactstrap";
import {FacebookShareButton, TwitterShareButton, WhatsappShareButton} from "react-share";
import React, {useState} from "react";

const ShareModal = ({
    isOpen,
    toggleShareModal,
    currentId
}) => {

    const [success, setSuccess] = useState(false);

    const copyLinkToClipboard = (event) => {
        event.preventDefault();
        event.stopPropagation();
        let dummyInput = document.createElement('textarea');
        dummyInput.value = window.location.href + 'read/' + currentId;
        document.body.appendChild(dummyInput);
        dummyInput.select();
        dummyInput.focus();
        document.execCommand('copy');
        setSuccess(true);
    }

    return (
        <Modal isOpen={isOpen}
               toggle={toggleShareModal}
               style={{position: 'fixed', top: '25%', left: '50%', transform: 'translate(-50%, 0)'}}
        >
            <ModalHeader toggle={toggleShareModal}>Compartir escrito</ModalHeader>
            <ModalBody id="modal-share-body">
                <div style={{display: 'flex', flexDirection: 'row', width: 300, justifyContent: 'space-evenly'}}>
                    <FacebookShareButton url={'http://somosebooka.com/read/' + currentId}>
                        <p className="fa fa-facebook" style={{fontSize: 25}}/>
                    </FacebookShareButton>
                    <TwitterShareButton url={'http://somosebooka.com/read/' + currentId}>
                        <p className="fa fa-twitter" style={{fontSize: 25}}/>
                    </TwitterShareButton>
                    <WhatsappShareButton url={'http://somosebooka.com/read/' + currentId}>
                        <p className="fa fa-whatsapp" style={{fontSize: 24}}/>
                    </WhatsappShareButton>
                    <div onClick={copyLinkToClipboard} id="copy-link">
                        <p className="fa fa-link"/>
                    </div>
                </div>
                <Alert color={'success'} isOpen={success} toggle={() => setSuccess(!success)}>Enlace copiado al portapapeles</Alert>
            </ModalBody>
        </Modal>
    );
}

export default ShareModal;
