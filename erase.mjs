// const dt = new Date("1988-04-19");
// const dtAt = new Date();

// console.log(dtAt.getMonth());

// if((dt.getFullYear() <= dtAt.getFullYear()) && (dt.getMonth() < dtAt.getMonth()))
// {
//     console.log("foi");
// } else {
//     console.log("num foi");
// }

//console.log(dt.valueOf() > dt1.valueOf());

// var array = [
//   { Id: "001", qty: 1 },
//   { Id: "002", qty: 2 },
//   { Id: "001", qty: 2 },
//   { Id: "003", qty: 4 },
//   { Id: "003", qty: 4 },
// ];

// const fn = function (res, value) {
//   if (!res[value.Id]) {
//     res[value.Id] = { Id: value.Id, qty: 0 };
//     result.push(res[value.Id]);
//   }
//   res[value.Id].qty += value.qty;
//   return res;
// };

// var result = [];
// array.reduce(fn, {});

// console.log(result);

console.log(calc(1501)); 

function calc(valorVendaMes){
switch (true) {
    case valorVendaMes <= 1000:
      return 10;
      
    case valorVendaMes <= 1500:
      return 15;
      
    default:
      return 20;
    
  }
}