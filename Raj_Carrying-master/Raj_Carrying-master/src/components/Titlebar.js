import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Titlebar.css";
// import Newmenu from './Newmenu';
import { TRANSPORTER_NAME } from "../config/config";
const screenfull = require("screenfull");

function Titlebar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const [visible, setVisible] = useState(false);

  const getLocalFlag = () => {
    try {
      return localStorage.getItem("local_flag") === "true";
    } catch (e) {
      return false;
    }
  };
  const setLocalFlag = () => {
    try {
      localStorage.setItem("local_flag", JSON.stringify(!isLocal));
    } catch (e) {
      console.log("Errorr asdf", e.message);
    }

    setIsLocal(!isLocal);
  };
  const [isLocal, setIsLocal] = useState(getLocalFlag());
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  const displayMenu = () => {
    setVisible(true);
  };

  const hideMenu = () => {
    setVisible(false);
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener("resize", showButton);

  if (screenfull.isEnabled) {
    screenfull.on("change", () => {
      console.log("Am I fullscreen?", screenfull.isFullscreen ? "Yes" : "No");
    });
  }

  const toggleFullScreen = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle();
    }
  };

  return (
    <>
      <nav className="titlebar">
        <div
          className="titlebar-container"
          onMouseLeave={hideMenu}
          onMouseOver={displayMenu}
        >
          <Link to="/" className="titlebar-logo" onClick={closeMobileMenu}>
          {TRANSPORTER_NAME}
            {/* <i className="fab fa-typo3" /> */}
          </Link>

          {/* <a
            className="log-out-container"
            href="https://www.gstsearch.in/verify.html "
          >
            GST
          </a> */}

          {/* <a
            className="log-out-container"
            href="https://download.anydesk.com/AnyDesk.exe"
          >
            Anydesk
          </a> */}

          <button className="log-out-container" onClick={setLocalFlag}>
            {isLocal ? "Local" : "Global"}
          </button>

          {/* <label className="log-out-container">DHRUMIL:9978961139</label> */}
          <label className="log-out-container">
                Logged in Year: {JSON.parse(sessionStorage.getItem("financial_year"))?.financial_year}
          </label>

          {/* <button className="log-out-container" onClick={toggleFullScreen}>
            Toggle Screen
          </button> */}

          {/* <Newmenu isVisible={visible} /> */}
        </div>
      </nav>
    </>
  );
}

export default Titlebar;

// import React, { useState, useEffect } from 'react';
// import { Button } from './Button';
// import { Link } from 'react-router-dom';
// import './Titlebar.css';
// import Newmenu  from "./Newmenu"

// function Titlebar() {
//   const [click, setClick] = useState(false);
//   const [button, setButton] = useState(true);

//   const handleClick = () => setClick(!click);
//   const closeMobileMenu = () => setClick(false);

//   const showButton = () => {
//     if (window.innerWidth <= 960) {
//       setButton(false);
//     } else {
//       setButton(true);
//     }
//   };

//   useEffect(() => {
//     showButton();
//   }, []);

//   window.addEventListener('resize', showButton);

//   const [visible, setVisible] = useState(false)

//   const displayMenu = () => {
//       setVisible(true)
//   }
//   const hideMenu = () => {
//       setVisible(false)
//   }

//   return (
//     <div className="block"
//         onMouseLeave={hideMenu}>
//         <Newmenu isVisible={visible} />
//     </div>
//   );
// }

// export default Titlebar;
