// 1
// create an interface for an object it should accept a title string 
// it should accept a status boolean it should accept an id number.
type data = {
    title: string;
    status: boolean;
    id: number;
}

const todos:data = {
    title: "Add Something",
    status: false,
    id: 1  
}


//2
// create a function getName it should accept an object firstname and lastname it should return fullname 
// keep lastname optional.if lastname does not exist then return only firstname make a interface for it
type studNameType= {
    first_name: string;
    last_name: string;
}

const sname:studNameType = {
    first_name: 'amol',
    last_name: 'godse',
}


const getName = ({first_name , last_name}:studNameType):string => {
   return `${first_name} ${last_name}`
}

//3
// create an interface Address it takes houseNumber street city state postalCode country
// add appropriate types

type AddressType= {
    houseNumber: number;
    street: string;
    city :string;
    state:string;
     postalCode:number;
      country:string;
}

const Address:AddressType= {
    houseNumber: 3,
    street:"station road",
    city :"Sambhajinagar",
    state:"maharshtra",
     postalCode:431001,
      country:"india"   
}

//4
// create a PersonDetails interface
// it should have
// Prefix optional
// phones array of numbers
// addresses array of Addresses
// email optional
// firstname
// lastname
// middlename optional
