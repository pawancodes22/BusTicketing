import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "./index.css";
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
  } = busDetails;

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      contentClassName="custom-modal"
    >
      <Modal.Header closeButton className="custom-modal-header">
        {bookingDataStatus !== statusCodes.success && (
          <Modal.Title className="modal-title">
            Confirm Your Journey
          </Modal.Title>
        )}
      </Modal.Header>

      <Modal.Body className="custom-modal-body">
        <h4 className="bus-title">
          {busName} <span>{busType}</span>
        </h4>

        <p className="time-text">
          {departureDate} {departureTime} → {arrivalDate} {arrivalTime}
        </p>

        <div className="seat-container">
          {selectedSeats.map((seatItem, index) => (
            <span key={index} className="seat-tag">
              {seatItem}
            </span>
          ))}
        </div>

        <div className="total-fare">
          Total Fare <span>₹{selectedSeats.length * fare}</span>
        </div>
      </Modal.Body>

      <Modal.Footer className="custom-modal-footer">
        <Button onClick={props.onHide} className="cancel-btn">
          Close
        </Button>

        <Button
          className="confirm-btn"
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
