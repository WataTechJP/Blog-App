import { useEffect, useState } from "react";

import Button from "./Button";
import "./Modal.css";

const Modal = ({ handleCloseClick, children }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setVisible(true);
    }, 50);
  }, []);

  const closeModal = () => {
    setVisible(false);
    setTimeout(() => handleCloseClick(), 300);
  };

  return (
    <div 
      className={`modal-overlay ${visible ? "active" : ""}`} 
      onClick={closeModal}
    >
      <div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()} // Prevents modal from closing when clicked
      >
        <Button className="modal-close" onClick={closeModal}>✖ Close</Button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
