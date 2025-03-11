import { createPortal } from "react-dom";

const ModalPortal = ({ children }) => {
  let modalRoot = document.getElementById("modal-root");

  // Create modal root if it doesn't exist
  if (!modalRoot) {
    modalRoot = document.createElement("div");
    modalRoot.id = "modal-root";
    document.body.appendChild(modalRoot);
  }

  return createPortal(children, modalRoot);
};

export default ModalPortal;
