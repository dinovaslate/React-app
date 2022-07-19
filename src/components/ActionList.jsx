import React, { useState, useCallback } from 'react';
import { useDidMount, useWillUnmount } from 'rooks';
const ActionList = ({ children, id, hover, style, start }) => {
  const [open, setOpen] = useState(false);
  const clickOutside = useCallback((e) => {
    if (document.getElementById(id).contains(e.target)) return;
    setOpen(false);
  }, []);
  useDidMount(() => {
    document
      .getElementById(id)
      .addEventListener(`${hover ? 'mouseover' : 'click'}`, () => {
        setOpen(!open);
      });
    document.body.addEventListener(
      `${hover ? 'mouseover' : 'click'}`,
      clickOutside,
      true
    );
  });
  useWillUnmount(() => {
    document.body.removeEventListener(
      `${hover ? 'mouseover' : 'click'}`,
      clickOutside,
      true
    );
  });
  return (
    <>
      <div
        className={`list-content ${start && 'start'} ${open && 'active'}`}
        style={style}
      >
        {children}
      </div>
    </>
  );
};

export default ActionList;
