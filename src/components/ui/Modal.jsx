import React from "react";

const Modal = ({ show, title, onClose, children, footer }) => {
  if (!show) return null;

  return (
    <>
      <div className="modal d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">

            {/* Header */}
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>

              <button
                type="button"
                className="btn-close"
                onClick={onClose}
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body">{children}</div>

            {/* Footer opcional */}
            {footer && <div className="modal-footer">{footer}</div>}
          </div>
        </div>
      </div>

      {/* Fondo oscuro */}
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default Modal;