import React from 'react'


let buttonStyle = {
    float:'right'
}

const Modal = ({ handleClose, show, children }) => {
    const showHideClassName = show ? "modal display-block" : "modal display-none";
  
    return (
      <div className={showHideClassName}>
        <section className="modal-main">
        <button style={buttonStyle} onClick={handleClose}>X</button>
          {children}
          
        </section>
      </div>
    );
  };

  export default Modal;