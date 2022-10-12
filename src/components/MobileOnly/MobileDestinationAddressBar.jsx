import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setDepartureOrDestination, setReceiver, setSwitchDestination } from '../../store/reducers/generalSlice';
import ChainSwitch from '../Buttons/ChainSwitch'
import RedClose from "../../assets/img/icons/RedClose.svg";
import "./Mobile.css"

export default function MobileDestinationAddressBar() {
  const dispatch = useDispatch();
  const to = useSelector((state) => state.general.to);
  const handleChange = (e) => {
    dispatch(setReceiver(e.target.value));
  };

  function handleSwitchChain() {
    dispatch(setDepartureOrDestination("destination"))
    dispatch(setSwitchDestination(true));
  }
  const alert = useSelector((state) => state.general.pasteDestinationAlert);

  useEffect(() => {}, [to]);

  return (
    <div className="mobile-destination__container">
        <div className="mobile-destination__header">
          <div className="mobile-destination__subtitle">
            <div>Destination Chain</div>
          </div>
          <ChainSwitch assignment={"to"} func={handleSwitchChain} />
        </div>
        <div className={!alert ? "mobile-destination__address" : "mobile-destination__address desti-alert"}>
          <input
            onChange={(e) => handleChange(e)}
            type="text"
            placeholder="Paste destination address"
          />
          <span className="invalid">
            <img src={RedClose} alt="Close" /> Invalid address
          </span>
        </div>
    </div>
  )
}
