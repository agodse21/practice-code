const SERVER_IP = "localhost";
const SERVER_PORT = "8000";
const TRANSPORTER_NAME = "RAJ CARRYING CARGO PVT LTD"


const USE_OVERLAY = true;

const getLocalFlag = () => {
    try{
        let lo = localStorage.getItem("local_flag") === 'true';
        console.log("Inansdsnns", lo);
      return lo
    } catch(e){
      return false
    }
  }
var SERVER_URL = ""
if (getLocalFlag()){
    console.log("in if")
    SERVER_URL = "http://192.168.1.143:8000";
}
else{
    console.log("in else")
    SERVER_URL = "http://43.252.197.60:8000";
    // const SERVER_URL = "https://d7edf369be0e55.localhost.run";
}
// SERVER_URL = "http://" + SERVER_IP + ":" + SERVER_PORT;

export { SERVER_URL, USE_OVERLAY, TRANSPORTER_NAME};