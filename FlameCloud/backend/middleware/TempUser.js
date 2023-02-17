// import { LocalStorage } from "node-localstorage";
const LocalStorage = require('node-localstorage').LocalStorage;
const localStorage = new LocalStorage('./scratch');
const SaveTempUser = (user) => {
    localStorage.setItem("telegram_Login_user_id", user);
    
};

module.exports = {
  SaveTempUser
};
