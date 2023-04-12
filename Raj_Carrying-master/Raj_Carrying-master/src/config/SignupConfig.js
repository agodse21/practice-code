

const outcomes = {
    0: "All set",
    1: "Passwords do not match",
    3: "Username can not be empty",
    4: "Password can not be empty",
    5: "Length of password should be more than 5",
}

const validate = ({ name, password, confirmPassword }) => {

    // if (typeof name === "undefined" || !name.length) {
    //     return 3;
    // }

    // if (typeof password === "undefined" || !password.length) {
    //     return 4;
    // }

    // if (password.length <= 5) {
    //     return 5;
    // }

    if (password !== confirmPassword) {
        return 1;
    }

    return 0;
}

const groupInfo = {
    "group-3": [
        { key: 1, branch_name: "Ahmedabad" },
        { key: 2, branch_name: "Narol" },
        { key: 3, branch_name: "Sarkhej" },
        { key: 4, branch_name: "Bhavnagar" },
        { key: 5, branch_name: "Mehsana" },
        { key: 6, branch_name: "Junagadh" },
        { key: 7, branch_name: "Aslali" },
        { key: 8, branch_name: "Bardoli" },
        { key: 9, branch_name: "Rajkot" },
        { key: 10, branch_name: "Morbi" },
        { key: 11, branch_name: "Ankleshwar" },
        { key: 12, branch_name: "Bilimora" },
        { key: 13, branch_name: "Kamrej" },
        { key: 14, branch_name: "Himmatnagar" },
        { key: 15, branch_name: "Palanpur" },
        { key: 16, branch_name: "Vadodara" },
        { key: 17, branch_name: "Patan" },
        { key: 18, branch_name: "Dasrath" },
        { key: 19, branch_name: "Gandhidham" },
        { key: 20, branch_name: "Surat" },
        { key: 21, branch_name: "Vapi" },
        { key: 22, branch_name: "Navsari" },
        { key: 23, branch_name: "Anand" },
        { key: 24, branch_name: "Bharuch" },
        { key: 25, branch_name: "Nadiad" },
        { key: 26, branch_name: "Unjha" },
        { key: 39, branch_name: "Bhuj" },
        { key: 28, branch_name: "Valsad" },
        { key: 29, branch_name: "Gondal" },
        { key: 30, branch_name: "Deesa" },
        { key: 31, branch_name: "Surendranagar" },
        { key: 32, branch_name: "Bhivandi" },
        { key: 33, branch_name: "Jamnagar" },
        { key: 34, branch_name: "Navagam" },
        { key: 168, branch_name: "Daman" },
        { key: 579, branch_name: "Silvasa" },
        { key: 628, branch_name: "Umergaon" },
    ],
    "group-menu": [
        {
            "id": 1,
            "name": "bilty"
        },
        {
            "id": 2,
            "name": "challan"
        },
        {
            "id": 3,
            "name": "mr"
        },
        {
            "id": 4,
            "name": "bilty-inquiry"
        },
        {
            "id": 5,
            "name": "mr-inquiry"
        },
        {
            "id": 6,
            "name": "inward"
        },
        {
            "id": 7,
            "name": "biltystatement"
        },
        {
            "id": 8,
            "name": "mrstatement"
        },
        {
            "id": 9,
            "name": "consignorbilling"
        },
        {
            "id": 10,
            "name": "pod_statement"
        },
        {
            "id": 11,
            "name": "crossingbilling"
        },
        {
            "id": 12,
            "name": "tripbhada"
        },
        {
            "id": 13,
            "name": "pod_challan"
        },
        {
            "id": 14,
            "name": "pod_challan_inward"
        },
        {
            "id": 15,
            "name": "crossingOutward"
        },
        {
            "id": 16,
            "name": "report-bilty"
        },
        {
            "id": 17,
            "name": "report-challan"
        },
        {
            "id": 18,
            "name": "ewbextensionreport"
        },
        {
            "id": 19,
            "name": "ackpendingpartyreport"
        },
        {
            "id": 20,
            "name": "general_rate_master"
        },
        {
            "id": 21,
            "name": "account_master"
        },
        {
            "id": 22,
            "name": "station_master"
        },
        {
            "id": 23,
            "name": "item_master"
        },
        {
            "id": 24,
            "name": "vehicle"
        },
        {
            "id": 25,
            "name": "party_rate_master"
        },
        {
            "id": 26,
            "name": "trip"
        },
        {
            "id": 27,
            "name": "crossingInward"
        },
        {
            "id": 28,
            "name": "branch-sel"
        },
        {
            "id": 29,
            "name": "account-transaction?voucher_type=jv"
        },
        {
            "id": 30,
            "name": "account-report"
        },
        {
            "id": 31,
            "name": "marfatiya-wise"
        },
        {
            "id": 32,
            "name": "report-trip"
        },
        {
            "id": 33,
            "name": "brokerage"
        },
        {
            "id": 34,
            "name": "brokerage-summary"
        },
        {
            "id": 35,
            "name": "bilty-ack"
        },
        {
            "id": 36,
            "name": "admin-report-bilty"
        },
        {
            "id": 37,
            "name": "report-vehicleregister"
        },
        {
            "id": 38,
            "name": "report-vehicle"
        },
        {
            "id": 39,
            "name": "vehicleregister"
        },
        {
            "id": 40,
            "name": "account-report"
        },
        {
            "id": 41,
            "name": "account-transaction?voucher_type=cp"
        },
        {
            "id": 42,
            "name": "account-transaction?voucher_type=cr"
        },
        {
            "id": 43,
            "name": "account-transaction?voucher_type=br"
        },
        {
            "id": 44,
            "name": "account-transaction?voucher_type=bp"
        },
        {
            "id": 45,
            "name": "account-transaction"
        },
        {
            "id": 46,
            "name": "report-bill"
        },
        {
            "id": 47,
            "name": "bill-paid"
        },
        {
            "id": 48,
            "name": "crossing-outward-report"
        },
        {
            "id": 49,
            "name": "outstanding-partywise"
        },
        {
            "id": 50,
            "name": "pl-report"
        },
        {
            "id": 51,
            "name": "tds-report"
        },
        {
            "id": 52,
            "name": "vinod-report"
        },
        {
            "id": 53,
            "name": "opening-balance"
        }
    ],
}

const comp = (a, b) => {
    return a.branch_name.localeCompare(b.branch_name);
}

let tmp = groupInfo["group-3"];
tmp.sort(comp);

export { validate, outcomes, groupInfo }