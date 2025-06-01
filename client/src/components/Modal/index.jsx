import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./index.css";
import { TbLayersSelected } from "react-icons/tb";
import statusCodes from "../../utils/statusCodes";

function MyVerticallyCenteredModal(props) {
  const { busDetails, selectedSeats, onConfirm, bookingDataStatus } = props;
  const {
    arrivalDate,
    arrivalTime,
    busName,
    busType,
    departureDate,
    departureTime,
    fare,
    noOfSeats,
    arrivalStation,
    departureStation,
  } = busDetails;
  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        {!bookingDataStatus === statusCodes.success ? (
          <Modal.Title id="contained-modal-title-vcenter">
            Confirm Your Journey Details
          </Modal.Title>
        ) : null}
      </Modal.Header>
      <Modal.Body className="modal-bg-img">
        <h4>
          {busName} - {busType}
        </h4>
        <p>
          {departureDate} {departureTime} → {arrivalDate} {arrivalTime}
        </p>
        <ul>
          {selectedSeats.map((seatItem, index) => (
            <li key={index}>{seatItem}</li>
          ))}
        </ul>
        <h4>Total Fare: ₹{selectedSeats.length * fare}</h4>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={props.onHide}
          className="border border-secondary bg-transparent"
        >
          Close
        </Button>
        <Button
          className="bg-primary"
          onClick={() => {
            props.onHide();
            onConfirm();
          }}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default MyVerticallyCenteredModal;
