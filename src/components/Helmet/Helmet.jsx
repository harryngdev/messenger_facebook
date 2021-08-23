import React from "react";
import PropTypes from "prop-types";

const Helmet = ({ title, children }) => {
  document.title = title + "Messenger";

  return <>{children}</>;
};

Helmet.propTypes = {
  title: PropTypes.string,
};

export default Helmet;
