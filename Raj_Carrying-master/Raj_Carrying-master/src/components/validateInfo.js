export default function validateInfo(values) {
  let errors = {};
  console.log("asddfssdfghgfdsdfghgfdsdfghgfdfgh   lil", values);

  if (values.hasOwnProperty("Destination")) {
    if (!values.Destination.trim()) {
      errors.Destination = "Required Field";
    } else {
      errors.Destination = "";
    }
  }
  if (values.hasOwnProperty("bilty_id")) {
    if (!values.bilty_id.trim()) {
      errors.bilty_id = "Required Field";
    } else {
      errors.bilty_id = "";
    }
  }

  // else if (!/^[A-Za-z]+/.test(values.name.trim())) {
  //   errors.name = 'Enter a valid name';
  // }

  // if (!values.email) {
  //   errors.email = 'Email required';
  // } else if (!/\S+@\S+\.\S+/.test(values.email)) {
  //   errors.email = 'Email address is invalid';
  // }
  // if (!values.password) {
  //   errors.password = 'Password is required';
  // } else if (values.password.length < 6) {
  //   errors.password = 'Password needs to be 6 characters or more';
  // }

  // if (!values.password2) {
  //   errors.password2 = 'Password is required';
  // } else if (values.password2 !== values.password) {
  //   errors.password2 = 'Passwords do not match';
  // }
  return errors;
}
