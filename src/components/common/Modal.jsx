import Button from "./Button";
import "./Modal.css";

const Modal = ({ handleCloseClick, children }) => {
  return (
    <div className="modal-overlay" onClick={handleCloseClick}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <Button className="modal-close" onClick={handleCloseClick}>
            Close
          </Button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

export default Modal;

