import React, { useState, useEffect, useRef } from "react";
import "./DropdownMenu.css";
import { checkAccess } from "../utils/apiUtils";
import { useHistory } from "react-router-dom";
// import { ReactComponent as CogIcon } from './icons/cog.svg';
// import { ReactComponent as ChevronIcon } from './icons/chevron.svg';
import { ReactComponent as ArrowIcon } from "./icons/arrow.svg";
// import { ReactComponent as BoltIcon } from './icons/bolt.svg';
import { CSSTransition } from "react-transition-group";
// TODO: Use of status and menuitem without children
function DropdownMenu(props) {
  const [activeMenu, setActiveMenu] = useState(props.name);
  const [menuHeight, setMenuHeight] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setMenuHeight(dropdownRef.current?.firstChild.offsetHeight);
  }, []);

  function calcHeight(el) {
    const height = el.offsetHeight;
    setMenuHeight(height);
  }

  function DropdownItem(props) {
    console.log("DROP DOWN",props);
    const outsideUrls = ["https://www.gstsearch.in/verify.html", "https://download.anydesk.com/AnyDesk.exe"];

    const history = useHistory();
    const handleClick = function () {
      if (typeof props.goToMenu === "string")
        return setActiveMenu(props.goToMenu);
      if (props.goToMenu && props.goToMenu.children.length > 0)
        return setActiveMenu(props.goToMenu.name);
      else props.openState(false);

      if(outsideUrls.indexOf(props.goToMenu.url) > -1) {
          window.open(props.goToMenu.url);
          return;
      }
      return props.goToMenu.url != "" && history.push(props.goToMenu.url);
    };
    
    if (props.url != "") {
      module = props.url.replace("/", "");
      module = module.split("?")[0]

      // console.log("PROPS URL", module);

      let acc = checkAccess(module) || (outsideUrls.indexOf(props.url) > -1);
      
      // console.log("ACC-ACC", acc);
      if (!acc) {
        return <a></a>;
      }
    }
    return (
      <a href="#" className="menu-item" onClick={handleClick}>
        {props.leftIcon && (
          <span className="icon-button">{props.leftIcon}</span>
        )}
        {props.text}
        <span className="icon-right">{props.rightIcon}</span>
      </a>
    );
  }

  return (
    <div className="dropdown" style={{ height: menuHeight }} ref={dropdownRef}>
      <CSSTransition
        in={activeMenu === props.name}
        timeout={500}
        classNames="menu-primary"
        unmountOnExit
        onEnter={calcHeight}
      >
        <div className="menu">
          {props.dropDownMenuItems.map((subMenuItem) => (
            <DropdownItem
              text={subMenuItem.name}
              url={subMenuItem.url}
              goToMenu={subMenuItem}
              openState={props.openState}
            />
          ))}

          {/* <DropdownItem>My Profile</DropdownItem>
          <DropdownItem
            // leftIcon={<CogIcon />}
            // rightIcon={<ChevronIcon />}
            goToMenu="settings">
            Settings
          </DropdownItem>
          <DropdownItem
            // leftIcon="🦧"
            // rightIcon={<ChevronIcon />}
            goToMenu="animals">
            Animals
          </DropdownItem> */}
        </div>
      </CSSTransition>

      {props.dropDownMenuItems.map((subMenuItem) => (
        <CSSTransition
          in={activeMenu === subMenuItem.name}
          timeout={500}
          classNames="menu-secondary"
          unmountOnExit
          onEnter={calcHeight}
        >
          <div className="menu">
            <DropdownItem
              goToMenu={props.name}
              text={subMenuItem.name}
              url={subMenuItem.url}
              leftIcon={<ArrowIcon />}
              openState={props.openState}
            />
            {subMenuItem.children.map((lastItem) => (
              <DropdownItem
                text={lastItem.name}
                goToMenu={lastItem}
                openState={props.openState}
                url={lastItem.url}
              />
            ))}
          </div>
        </CSSTransition>
      ))}
    </div>
  );
}

export default DropdownMenu;
