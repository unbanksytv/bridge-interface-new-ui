import React, { useState } from "react";
import Close from "../../assets/img/icons/close.svg";
import { Modal } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";
import tronPopUpIcon from "../../assets/img/icons/tronPopUp.png";
import FileCopy from "../../assets/img/icons/FileCopy.svg";
import CopyHover from "../../assets/img/icons/CopyHover.svg";
import copyTT from "../../assets/img/icons/copytoclip.svg";
import copiedIcon from "../../assets/img/icons/copiedtoclip.svg";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setTronPopUp } from "../../store/reducers/generalSlice";

export default function TronPopUp() {
    const [onHover, setOnHover] = useState();
    const [copied, setCopied] = useState();
    const tronPopUp = useSelector((state) => state.general.tronPopUp);
    const dispatch = useDispatch();
    const copy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    function handleClose() {
        dispatch(setTronPopUp(false));
    }

    return (
        <Modal show={tronPopUp} onHide={() => handleClose()}>
            <Modal.Header className="border-0">
                <div className="tron-PopUp__header">
                    <img
                        className="tron-PopUp__icon"
                        src={tronPopUpIcon}
                        alt=""
                    />
                    <Modal.Title>To continue bridging: </Modal.Title>
                </div>
                <span
                    className="CloseModal"
                    onHide={() => dispatch(setTronPopUp(false))}
                    onClick={() => dispatch(setTronPopUp(false))}
                >
                    <img src={Close} alt="" />
                </span>
            </Modal.Header>
            <Modal.Body className="modalBody text-center">
                <div className="tron-PopUp__list">
                    <div className="list__item">1. Copy link below</div>
                    <div className="list__item">2. Open Tronlink App</div>
                    <div className="list__item">
                        3. Paste link to Tronlink browser
                    </div>
                    <div className="list__item">4. Enjoy 😉</div>
                </div>
                <div className="tron-modal__link">
                    <div className="link__items">
                        <div className="tron-modal_address">
                            https://bridge.xp.network
                        </div>
                        {onHover && <img className="copyTronTT" src={copyTT} />}
                        {copied && (
                            <img className="copyTronTTc" src={copiedIcon} />
                        )}
                        <CopyToClipboard text={"https://bridge.xp.network"}>
                            <div className="tron-modal__copyIcon">
                                <img
                                    onClick={() => copy()}
                                    onMouseOver={() => setOnHover(true)}
                                    onMouseOut={() => setOnHover(false)}
                                    onMouseDown={() => setCopied(true)}
                                    onMouseUp={() => setCopied(false)}
                                    src={onHover ? CopyHover : FileCopy}
                                />
                            </div>
                        </CopyToClipboard>
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
