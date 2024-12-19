function sleep() {
  // console.log(typeof(time))
  let time=2000;
return new Promise((res, rej) => {
    if (typeof time != Number) {
      rej("Please Type a number");
      //   return;
    } else {
      setTimeout(() => {
        res({ status: 200 });
      }, time);
    }
  });
//   console.log(x);
}

sleep()
  .then((res) => {
    console.log(res);
  })
  .catch((e) => console.log(e));
