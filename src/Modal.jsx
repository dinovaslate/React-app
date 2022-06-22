import React from "react";
import ReactDOM from "react-dom";

const Modal = ({ children, header, setAction, img }) => {
  return ReactDOM.createPortal(
    <div className="ui dimmer modals visible active">
      <div className="ui standard modal visible active">
        <i class="close icon" onClick={() => setAction(false)}></i>
        <div className="header">{header}</div>
        <div class="image content">
          {img !== undefined && (
            <div className="ui image medium">
              <img
                src={img.src ? img.src : img}
                alt={img.alt ? img.alt : "Image"}
              />
            </div>
          )}
          <div class="description">{children}</div>
        </div>
        <div class="actions">
          <div class="ui black deny button" onClick={() => setAction(false)}>
            Nope
          </div>
          <div
            class="ui positive right labeled icon button"
            onClick={() => setAction(true)}
          >
            Affirmative
            <i class="checkmark icon"></i>
          </div>
        </div>
      </div>
    </div>,
    document.querySelector("#modal")
  );
};

export default Modal;
