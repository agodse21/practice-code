import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import "./Signup.css";
import { SERVER_URL } from "../config/config";
import "./EditRoleId.css";

function EditRoleId() {
    const location = useLocation();
    const defaultRoleId = location.state ? location.state : 1;
    // console.log(defaultRoleId);
    const [roleId, setRoleId] = useState(defaultRoleId);
    const [menuList, setMenuList] = useState([]);
    const [wholeMenuList, setWholeMenuList] = useState([]);
    const [roleIdList, setRoleIdList] = useState([]);
    const [userList, setUserList] = useState([]);

    async function fetchMenuList() {
        console.log("inside menu list2");
        const api = SERVER_URL + `/user/menu-info/${roleId}`;
        await fetch(api)
            .then((response) => response.json())
            .then((data) => {
                console.log({data});
                setMenuList(data);
            })
    }

    async function fetchUserList() {
        // console.log("insied user list");
        const api = SERVER_URL + `/user/user-info/${roleId}`;
        await fetch(api)
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                const newUserList = [];
                for (let obj of data) {
                    newUserList.push(obj['user_name']);
                }
                setUserList(newUserList);
                // console.log("user list done", userList);
            })
    }

    async function fetchRoleIdList() {
        const api = SERVER_URL + "/user/Role-Info";

        await fetch(api)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log({data});
                setRoleIdList(data);
            })
    }

    const fetchWholeMenuList = async() => {
        const api = SERVER_URL + '/user/menu-info';
        const resp = await fetch(api);
        const data = await resp.json();

        console.log("menu list1", data);

        setWholeMenuList(data);
        fetchMenuList();
    }

    useEffect(() => {
        fetchWholeMenuList();
        fetchUserList();
        fetchRoleIdList();
    }, [roleId]);

    useEffect(() => {
    }, [])

    const handleMenuItemChange = (key) => {
        const newMenuList = [...menuList];

        key = parseInt(key);
        const index = newMenuList.indexOf(key);
        if (index > -1) {
            newMenuList.splice(index, 1);
        }
        else {
            newMenuList.push(key);
        }

        console.log(newMenuList)

        setMenuList(newMenuList);
        // console.log(menuList);
    }

    const handleRoleIdChange = async (e) => {
        const value = e.target.value;
        console.log("role id : ", value);
        setRoleId(value);
    }

    const handleSubmit = async () => {
        const api = SERVER_URL + `/user/menu-info/${roleId}`;

        console.log("Data to send : ", menuList);
        await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify(menuList),
        })
            .then(response => response.json())
            .then((data) => {
                console.log(data);
                window.alert(data["Message"]);
            })
    }

    const handleSelectAllMenu = (e) => {

        const oldMenuList = [...menuList];
        if (oldMenuList.length == Object.keys(wholeMenuList).length) {
            setMenuList([]);
            return;
        }

        const newMenuList = [];
        for (let key in wholeMenuList) {
            newMenuList.push(parseInt(key));
        }

        setMenuList(newMenuList);
    }

    return (
        <div className='page-marfatiya-wise'>
            <div className='form-container'>
                <div className='form-header' >Edit Menu List</div>

                <div className='main-wrapper'>
                    <div className='role-wrapper'>
                        <label className='text-style'> Role Id  </label>
                        <div>
                            <select className='select-style' name="role_id" value={roleId} onChange={handleRoleIdChange}>
                                {
                                    Object.keys(roleIdList).map((key) => {
                                        return <option value={roleIdList[key]}> {key} </option>
                                    })
                                }
                            </select>
                        </div>
                    </div> <br />
                    <div className='edit-role-input-wrapper'>
                        <div className='role-item'>
                            <label className="my-form-label">
                                Party Belongs To Menu Items
                            </label>
                            <div className='form-input-box'>
                                <button type='button' onClick={handleSelectAllMenu} >Select all</button> <br />
                                <div id="edit-role-branch-name-div">
                                    {
                                        Object.keys(wholeMenuList).map(id => {
                                            id = parseInt(id);
                                            const name = wholeMenuList[id];
                                            return (
                                                <>
                                                    <label>
                                                        <input
                                                            id={id}
                                                            name='menu_item'
                                                            type='checkbox'
                                                            value={name}
                                                            checked={menuList.indexOf(id) > -1}
                                                            onChange={() => handleMenuItemChange(id)}
                                                        />
                                                        {name}
                                                    </label> <br />
                                                </>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="role-item">
                            <div className='my-form-label'> Related Users </div>
                            <div className='name-wrapper'>
                                {
                                    userList.map((name) => {
                                        return (
                                            <div className='each-name'>
                                                {name}
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <button className='button-item' type='submit' onClick={handleSubmit}> Edit </button>
                </div>
            </div>
        </div>
    )
}

export default EditRoleId
