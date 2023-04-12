import './NavItem.css';
import React, { useState, useRef, useEffect } from 'react';
import DropdownMenu from './DropdownMenu';

function NavItem(props) {
  console.log("NAV ITEMS",props)
  const node = useRef();
  const [open, setOpen] = useState(false);

  // console.log("NODE", node.current);

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // inside clicK
      return;
    }
    // outside click
    setOpen(false);
  };

  const handleChange = selectedValue => {
    setOpen(false);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);
  
    return (
      <li ref={node} className="nav-item">
        <a href="#" className="nav-item-button" onClick={() => setOpen(!open)}>
            <div className="nav-item-text">
                {props.text}
            </div>

            {/* <div className="icon-button">
                {props.icon}
            </div>  */}
        </a>
  
        {open && (<DropdownMenu name={props.text} dropDownMenuItems={props.dropDownMenuItems} openState={setOpen}/>)}
      </li>
    );
  }

export default NavItem