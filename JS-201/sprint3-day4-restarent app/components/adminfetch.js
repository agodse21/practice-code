let username = () => {
  let userarr = JSON.parse(localStorage.getItem("getusername"));
  userarr.map((ele) => {
    return ele.name;
  });
};

function getUsername(username, token) {
  let user = [];
  // let username=`amol12`;
  // let token=`38f23706dd31346bae3652c8f62382eb`
  fetch(`https://masai-api-mocker.herokuapp.com/user/${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      console.log("amol", res.name);

      user.push(res);
      localStorage.setItem("getusername", JSON.stringify(user));
      return res;
    })
    .catch((err) => {
      //   console.log(err.message);
      return err.message;
    });
}

export default getUsername;

//username=mol12
//pass 1234

// description: "admin"
// email: "amol1234@gmail.com"
// mobile: "455454545488"
// name: "amol"
// token: "38f23706dd31346bae3652c8f62382eb"
// username: "amol12"
