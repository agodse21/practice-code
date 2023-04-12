// window.addEventListener("Fyear-Changed", () => {
//     console.log("Hello!!!");
//     // window.location.reload();
//     getLoggedinFyear();
// })

const getLoggedinFyear = (sessionObject) => {
    console.log(sessionObject);

    console.log("Amm >> ");
    let year = sessionObject?.sessionVariables?.financial_year ?? "22-23";
    year = year.split("-");

    const start_fyear = "04/01/20" + year[0];
    const end_fyear = "03/31/20" + year[1];

    
    const ans =  {
        start_fyear: formatDate(new Date(start_fyear)),
        end_fyear: formatDate(new Date(end_fyear)),
    }
    console.log({year, ans});
    return ans;
}

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

export default getLoggedinFyear;