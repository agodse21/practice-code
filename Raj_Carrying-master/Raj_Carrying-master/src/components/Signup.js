import React, { useState, useEffect } from 'react';
import { validate, outcomes, groupInfo } from '../config/SignupConfig';
import "./MarfatiyaWise.css";
import "./AutoSuggest.css";
import "./Form.css"; // right checkboxes
import "./AccountMasterForm.css";
import "./Signup.css";
import { SERVER_URL } from "../config/config";
import { useHistory } from 'react-router-dom';
import Popup from 'reactjs-popup';

const dataObject = {
    name: "",
    password: "",
    confirmPassword: "",
    branch_list: [],
    menu_list: [],
    role_id: "",
    new_role_name: "",
    user_id: 0,
    existing_user: false,
    activation_status: "",
    email: "",
    email_password: "",
}

// const responseObject

function Signup() {
    const [userData, setUserData] = useState(dataObject);
    const [roleIdList, setRoleIdList] = useState([]);
    const [menuList, setMenuList] = useState([]);
    const history = useHistory();
    const [submitted, setSubmitted] = useState(false);
    const [responseFromServer, setResponseFromServer] = useState({});

    async function fetchData() {
        let api = SERVER_URL + "/user/Role-Info";
        await fetch(api)
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                // console.log(data);
                setRoleIdList(data);
            })

        api = SERVER_URL + '/user/menu-info';
        const resp = await fetch(api);
        const data = await resp.json();

        console.log("menu list", data);

        setMenuList(data);
    }
    useEffect(() => {
        console.log('reload')

        fetchData();
    }, [])

    // useEffect(() => {
    //     console.log(userData)
    // })

    const handleChange = (e) => {
        console.log(e.target.name, e.target.value);
        let val = e.target.value;

        // console.log("object is : ", userData);

        setUserData({
            ...userData,
            [e.target.name]: val
        })
    }

    const handleRoleIdChange = async (e) => {
        // console.log("E.target -> ", e.target);

        let val = e.target.value;
        if (val == "none") {
            setUserData({
                ...userData,
                role_id: '',
                menu_list: []
            })
        }
        else {
            // api call
            const api = SERVER_URL + `/user/menu-info/${val}`;
            await fetch(api)
                .then((response) => response.json())
                .then((data) => {
                    // console.log(data, " -- ", typeof data);
                    setUserData({
                        ...userData,
                        role_id: val,
                        menu_list: data,
                    })
                })

        }
    }

    async function signupUser(credentials) {

        // console.log("inside signup user");

        return fetch(SERVER_URL + "/user/Submit-updated", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify(credentials)
        })
            .then((response) => {
                // console.log(response);
                return response.json();
            })
            .then((data) => {
                console.log(data);
                setSubmitted(true);
                setResponseFromServer(data);
                if (data.flag == true) {
                    fetchData();
                }
            })
            .catch((error) => console.log(error));
    }

    const resetForm = () => {
        setUserData(dataObject);
        setResponseFromServer({});
        setSubmitted(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userData.existing_user == false) {
            const response = validate(userData);
            if (response != 0) {
                window.alert(outcomes[response]);
                return;
            }
        }

        const dataToSend = {
            name: userData.name,
            password: userData.password,
            branch_list: userData.branch_list,
            menu_list: userData.menu_list,
            role_id: userData.role_id,
            new_role_name: userData.new_role_name,
            is_new_role: userData.new_role_name.length > 0,
            user_id: userData.user_id,
            existing_user: userData.existing_user,
            mail: userData.email,
            mail_password: userData.email_password,
        }   

        console.log("data to send : ", dataToSend);
        if (dataToSend.new_role_name.length > 0) {
            // for (let key in roleIdList) {
            //     if (roleIdList[key] == dataToSend.new_role_id) {
            //         window.alert("New Role Id can not be same as existing one.");
            //         return;
            //     }
            // }
            // if (roleIdList.indexOf(dataToSend.new_role_id) > -1) {
            //     window.alert("New Role Id can not be same as existing one.");
            //     return;
            // }
            if (dataToSend.branch_list.length == 0) {
                window.alert("To add New Role, atleast one branch should be there.");
                return;
            }
        }
        await signupUser(dataToSend);
    }

    const handleSelectAllBranch = (e) => {
        const oldBranchList = [...userData.branch_list];
        if (oldBranchList.length == groupInfo['group-3'].length) {
            setUserData({ ...userData, branch_list: [] });
            return;
        }

        const newBranchList = [];
        for (let obj of groupInfo['group-3']) {
            const { key } = obj;
            newBranchList.push(key);
        }

        setUserData({ ...userData, branch_list: newBranchList });
    }

    const handleSelectAllMenu = (e) => {

        const oldMenuList = [...userData.menu_list];
        if (oldMenuList.length == Object.keys(menuList).length) {
            setUserData({ ...userData, menu_list: [] });
            return;
        }

        let newMenuList = [];
        Object.keys(menuList).forEach(row => newMenuList.push(parseInt(row)))
        console.log(newMenuList);

        setUserData({ ...userData, menu_list: newMenuList });
    }

    const handleBranchItemChange = (key) => {
        // console.log(key)  

        const newBranchList = [...userData.branch_list];

        const index = newBranchList.indexOf(key);
        if (index > -1) {
            newBranchList.splice(index, 1);
        }
        else {
            newBranchList.push(key);
        }

        // console.log(newBranchList)

        setUserData({ ...userData, branch_list: newBranchList });
    }

    const handleMenuItemChange = (key) => {
        const newMenuList = [...userData.menu_list];

        const index = newMenuList.indexOf(key);
        if (index > -1) {
            newMenuList.splice(index, 1);
        }
        else {
            newMenuList.push(key);
        }

        // console.log(newBranchList)

        setUserData({ ...userData, menu_list: newMenuList });
    }

    async function checkUserExist(userName) {
        const api = SERVER_URL + "/user/check-user";
        const credentials = { name: userName };
        await fetch(api, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: JSON.stringify(credentials),
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                let exist = data["existing_user"];

                if (exist == true) {
                    const newBranchList = [];
                    for (let obj of data["branch_list"]) {
                        newBranchList.push(obj["branch_id"]);
                    }
                    resetForm();
                    setUserData((userData) => ({
                        ...userData,
                        name: data["name"],
                        branch_list: newBranchList,
                        menu_list: data["menu_list"],
                        role_id: String(data["role_id"]),
                        user_id: data["user_id"],
                        existing_user: true,
                        email: data["mail"]
                    }));
                }
            })
            .catch((error) => console.log(error))
    }

    const handleEnter = (event) => {
        if (event.key.toLowerCase() === "enter") {
            const form = event.target.form;

            const eventName = event.target.name;

            if (eventName === "name") {
                const value = event.target.value;

                checkUserExist(value);
            }
            // console.log({form});
            const index = [...form].indexOf(event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    };

    const handleActivationChange = async (e) => {
        const name = e.target.name;
        const value = e.target.value;

        console.log({ name, value });
        let status = value;

        if (status.length > 0) {
            const userId = parseInt(userData.user_id);
            status = parseInt(status);
            const url = SERVER_URL + "/user/change-active"
                + `/${userId}`
                + `?status=${status}`

            const resp = await fetch(url);
            const data = await resp.json();
            console.log({ data });
        }

        setUserData({
            ...userData,
            [name]: status,
        })
    }

    return (
        <div>
            <div>
                <Popup
                    open={submitted}
                    modal
                    closeOnDocumentClick={false}
                >
                    {(close) => (
                        <div className="pop-up-container">
                            <div className="pop-up-header">
                                {responseFromServer.flag == true ?
                                    <div> Success :) </div>
                                    : <div> Something went wrong ): </div>
                                }
                                <div>
                                    <a className="pop-up-close btn" onClick={close}>
                                        &times;
                                    </a>
                                </div>
                            </div>
                            {responseFromServer.flag == true ?
                                <div className='pop-up-fields'>
                                    {
                                        Object.keys(responseFromServer).map(key => {
                                            return (
                                                key == "flag" ? <div /> :
                                                <div className='pop-up-field'>
                                                    <div className="pop-up-field-label">{key} : </div>
                                                    <div className="pop-up-field-value">
                                                        {responseFromServer[key]}
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                :
                                <div className='pop-up-fields'>
                                    <div className='pop-up-field'>
                                        <div className="pop-up-field-label">Error : </div>
                                        <div className="pop-up-field-value">
                                            {responseFromServer.message}
                                        </div>
                                    </div>
                                </div>
                            }
                            <div className="pop-up-actions">
                                <button
                                    className="pop-up-button"
                                    onClick={() => {
                                        resetForm();
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

            <div className='page-marfatiya-wise'>
                <div className='signup-form-container'>
                    <div className='form-header' >Sign Up</div>
                    <div className='signup-wrapper'>
                        <div className='input-wrapper'>
                            <form className='item-1'>
                                <div className='signup-form-row'>
                                    <label className='form-label'> UserName </label>
                                    <input
                                        disabled={userData.existing_user}
                                        onKeyDown={handleEnter}
                                        className='form-input'
                                        type="text"
                                        name="name"
                                        value={userData.name}
                                        onChange={handleChange}
                                        onKeyPress={(a) => {
                                            if (a.key == "Enter") {
                                                console.log(a.key);
                                                makeFocusOnParticularField("password");
                                            }
                                        }}
                                    />
                                    <br />
                                </div>


                                <div className='signup-form-row'>
                                    <label className='form-label'> Password </label>
                                    <input disabled={userData.existing_user} onKeyDown={handleEnter} className='form-input' type="password" name="password" value={userData.password} onChange={handleChange} />
                                    <br />
                                </div>
                                
                                <div className='signup-form-row'>
                                    <label className='form-label'> Confirm Password </label>
                                    <input disabled={userData.existing_user} onKeyDown={handleEnter} className='form-input' type="password" name="confirmPassword" value={userData.confirmPassword} onChange={handleChange} />
                                    <br />
                                </div>

                                <div className='signup-form-row'>
                                    <label className='form-label'> Email </label>
                                    <input
                                        onKeyDown={handleEnter}
                                        className='form-input'
                                        type="text"
                                        name="email"
                                        value={userData.email}
                                        onChange={handleChange}
                                    />
                                    <br />
                                </div>

                                <div className='signup-form-row'>
                                    <label className='form-label'> Email Password </label>
                                    <input onKeyDown={handleEnter} className='form-input' type="password" name="email_password" value={userData.email_password} onChange={handleChange} />
                                    <br />
                                </div>
                                

                                {userData.existing_user && <div className='signup-form-row'>
                                    <label className='form-label'>
                                        Account Status
                                    </label>
                                    <select name='activation_status' onChange={handleActivationChange} value={userData.activation_status} className='form-input-two'>
                                        <option value="">Choose</option>
                                        <option value="1">Activate</option>
                                        <option value="0">Deactivate</option>
                                    </select>
                                    <br />
                                </div>}

                                <div className='signup-form-row'>
                                    <label className='form-label'> Role Id  </label>
                                    <div className='form-input-two'>
                                        <select style={{ width: "80%" }} disabled={userData.existing_user || userData.new_role_name.length > 0} name="role_id" value={userData.role_id} onChange={handleRoleIdChange}>
                                            <option value="none"> None </option>
                                            {
                                                Object.keys(roleIdList).map((key) => {
                                                    return <option value={roleIdList[key]}> {key} </option>
                                                })
                                            }
                                        </select>
                                        <button type="button" disabled={userData.role_id.length == 0} onClick={() => history.push("/edit-role-id", userData.role_id)}> Edit </button>
                                    </div>
                                    <br />
                                </div>

                                <div className='sub-item'>
                                    {/* <div className='signup-form-row'>
                                        <label className='form-label'>
                                            Add Role Id
                                        </label>
                                        <input onKeyDown={handleEnter} disabled={userData.role_id.length > 0} className='form-input' name="new_role_id" type='number' value={userData.new_role_id} onChange={handleChange} />
                                        <br />
                                    </div> */}
                                    <div className='signup-form-row'>
                                        <label className='form-label'> New Role Name </label>
                                        <input disabled={userData.role_id.length > 0} className='form-input' type="text" name="new_role_name" value={userData.new_role_name} onChange={handleChange} />
                                        <br />
                                    </div>
                                </div>
                            </form>

                            <div className='item-2'>
                                <label className="form-label">
                                    Party Belongs To Branch
                                </label>
                                <div className='form-input-box'>
                                    <button type='button' onClick={handleSelectAllBranch}>Select all</button> <br />
                                    <div id="signup-branch-name-div">
                                        {
                                            groupInfo['group-3'].map(({ key, branch_name }) => {
                                                return (
                                                    <>
                                                        <label>
                                                            <input
                                                                id={key}
                                                                name='branch_info'
                                                                type='checkbox'
                                                                value={branch_name}
                                                                checked={userData.branch_list.indexOf(key) > -1}
                                                                onChange={() => handleBranchItemChange(key)}
                                                            />
                                                            {branch_name}
                                                        </label> <br />
                                                    </>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                            </div>

                            <div className='item-2'>
                                <label className="form-label">
                                    Party Belongs To Menu Items
                                </label>
                                <div className='form-input-box'>
                                    <button type='button' disabled={userData.role_id.length > 0} onClick={handleSelectAllMenu}>Select all</button> <br />
                                    <div id="signup-branch-name-div">
                                        {
                                            Object.keys(menuList).map(id => {
                                                id = parseInt(id);
                                                const name = menuList[id];
                                                return (
                                                    <>
                                                        <label>
                                                            <input
                                                                disabled={userData.role_id.length > 0}
                                                                id={id}
                                                                name='menu_item'
                                                                type='checkbox'
                                                                value={name}
                                                                checked={userData.menu_list.indexOf(id) > -1}
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

                        </div>
                        <div className='item-3'>
                            <button className='signup-button' type="submit" onClick={handleSubmit}> Submit </button>
                            <button className='signup-button' type="button" onClick={resetForm}> Clear </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
