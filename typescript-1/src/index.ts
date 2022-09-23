// let name:string="amol";

let Fname:string="amol";
let age:number=23;
let isFetching :boolean=false;

let arr:Array<number>=[1,2,3,4];

let names: Array<string>;
names = ['ram', 'amol', 'sham','sunil'];
 
let tuple:[string,boolean]=["amol",false];

// create an enum
// it should have User, SuperUser, Admin, SuperAdmin

enum Users{
    User="amol"
    , SuperUser="albert", Admin="manish", SuperAdmin="nrupul"
};



function prod(x:number, y:number):number{
    return x * y ;
}
console.log(prod(2,4))



function divide(x:number, y:number):number{
    return x/y ;
}
console.log(divide(2,4))


function PrintName(ram:string):void{
console.log(ram)
};
