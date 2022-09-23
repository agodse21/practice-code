declare type data = {
    title: string;
    status: boolean;
    id: number;
};
declare const todos: data;
declare type studNameType = {
    first_name: string;
    last_name: string;
};
declare const sname: studNameType;
declare const getName: ({ first_name, last_name }: studNameType) => string;
declare type AddressType = {
    houseNumber: number;
    street: string;
    city: string;
    state: string;
    postalCode: number;
    country: string;
};
declare const Address: AddressType;
