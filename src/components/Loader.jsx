import React from 'react';

const Loader = ({ active }) => {
  return (
    <>
      <div className={`loader-container ${active && 'active'}`}>
        <div class="kinetic"></div>
        <h1 className="ui header white">Loading...</h1>
      </div>
    </>
  );
};

export default Loader;
