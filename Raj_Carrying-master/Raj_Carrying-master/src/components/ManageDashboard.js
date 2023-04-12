import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Signup.css";
import { SERVER_URL } from "../config/config";
import "./EditRoleId.css";
import Popup from 'reactjs-popup';


const dataObject = {
    menuList: {},
}

function ManageDashboard({ sessionObject }) {
    // console.log(defaultRoleId);
    const [submitted, setSubmitted] = useState(false);
    const [menuList, setMenuList] = useState([]);


    useEffect(() => {
        const getMenuInfo = async () => {
            const url = SERVER_URL + 
            `/user_dashboard/${sessionObject.sessionVariables.user_id}/${sessionObject.sessionVariables.role_id}`;

            const resp = await fetch(url);
            if(resp.ok) {
                const menuInfo = await resp.json();
                setMenuList(menuInfo);
                // console.log(menuInfo);
            }
        }

        getMenuInfo();
    }, [])

    const handleMenuItemChange = (id) => {
        const newMenuList = [...menuList];

        menuList.forEach(menuItem => {
            if(menuItem.menu_id == id) {
                menuItem.selected = !menuItem.selected;
            }
        })

        setMenuList(newMenuList);
    }

    const handleSubmit = async () => {
        const api = SERVER_URL + `/user_dashboard/save_menu`;

        let menuIds = [];
        menuList.forEach((menuItem) => {
            if(menuItem.selected) {
                menuIds.push(menuItem.menu_id);
            }
        })

        const dataToSend = {
            user_id: sessionObject.sessionVariables.user_id,
            menus: menuIds,
        }

        const resp = await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify(dataToSend),
        })
        
        if(resp.ok) {
            setSubmitted(true);
        }
    }

    const handleSelectAllMenu = (e) => {

        const oldMenuList = [...menuList];
        let totalSelected = 0;
        oldMenuList.forEach(menuItem => totalSelected += menuItem.selected);

        if(totalSelected < menuList.length) {
            oldMenuList.map(menuItem => menuItem.selected = true);
            setMenuList(oldMenuList);
        }
        else {
            oldMenuList.map(menuItem => menuItem.selected = false);
            setMenuList(oldMenuList);
        }
    }

    // useEffect(() => {
    //     console.log(menuList);
    // })

    return (
        <div className='page-marfatiya-wise'>
            <div>
                <Popup
                    open={submitted}
                    modal
                    closeOnDocumentClick={false}
                >
                    {(close) => (
                        <div className="pop-up-container">
                            <div className="pop-up-header">
                                Successful!
                                <div>
                                    <a className="pop-up-close btn" onClick={() => {
                                        window.location.reload();
                                        close();
                                    }}>
                                        &times;
                                    </a>
                                </div>
                            </div>
                            <div className='pop-up-fields'>
                                    <div className='pop-up-field'>
                                        <div className="pop-up-field-value">
                                            Login again to see the changes.
                                        </div>
                                    </div>
                                </div>
                            <div className="pop-up-actions">
                                <button
                                    className="pop-up-button"
                                    onClick={() => {
                                        window.location.reload();
                                        close();
                                    }}
                                >
                                    Okay
                                </button>
                            </div>
                        </div>
                    )}
                </Popup>
            </div>
            <div className='form-container'>
                <div className='form-header' >Manage Dashboard</div>
                <div className='main-wrapper'>
                    <div className='role-wrapper'>
                        <label className='text-style'> User </label>
                        <input 
                            value={sessionObject.sessionVariables.user_name}
                            disabled ={true}
                        />
                    </div> <br />
                    <div className='edit-role-input-wrapper'>
                        <div className='role-item'>
                            <label className="my-form-label">
                                Modules
                            </label>
                            <div className='form-input-box'>
                                <button type='button' onClick={handleSelectAllMenu} >Select all</button> <br />
                                <div id="edit-role-branch-name-div">
                                    {
                                        menuList.map(menuItem => {
                                            return (
                                                <>
                                                    <label>
                                                        <input
                                                            id={menuItem.menu_id}
                                                            name='menu_item'
                                                            type='checkbox'
                                                            value={menuItem.menu_id}
                                                            checked={menuItem.selected}
                                                            onChange={() => handleMenuItemChange(menuItem.menu_id)}
                                                        />
                                                        {menuItem.menu_name}
                                                    </label> <br />
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="role-item">
                            <div className='my-form-label'> Selected Modules </div>
                            <div className='name-wrapper'>
                                {
                                    menuList.map((menuItem) => 
                                        menuItem.selected ?  <div className='each-name'> 
                                            {menuItem.menu_name}
                                        </div>
                                        :  <></>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <button className='button-item' type='submit' onClick={handleSubmit}> Save </button>
                </div>
            </div>
        </div>
    )
}

export default ManageDashboard
