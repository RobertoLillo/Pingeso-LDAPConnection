const ldapConnection = require("./ldapConnection.js");

ldapConnection.search('roberto.lillo@usach.cl').then(result => {
    console.log("\nroberto.lillo@usach.cl");
    console.log(result);
});

ldapConnection.search('alan.barahona@usach.cl').then(result => {
    console.log("\nalan.barahona@usach.cl");
    console.log(result);
});

ldapConnection.search('javier.perez@usach.cl').then(result => {
    console.log("\njavier.perez@usach.cl");
    console.log(result);
});