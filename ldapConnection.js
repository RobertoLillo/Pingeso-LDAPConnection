const ldapjs = require('ldapjs');

function searchUser(sAMAccountName) {
    const opts = {
        filter: '(sAMAccountName=' + sAMAccountName + ')',
        scope: 'sub',
        attributes: ['cn', 'memberOf']
    };

    client.search(credentials.dc, opts, function (err, res) {
        if (err) {
            console.log("Search error.");
        } else {
            res.on('searchEntry', function (entry) {
                console.log('Entry: ', JSON.stringify(entry.object));
            });
            res.on('error', function (err) {
                console.log('Error: ', err.message);
            });
        };
    });
};

/* ------------------------------------------------------------------- */

// DC = Domain Controller, servidor de autenticación.
// DN = Distinguished Name, dirección del usuario en el árbol.
// CN = Common Name, nombre del usuario.
// SN = Surname, apellido del usuario.
// sAMAccountName = nombre de la cuenta.

// Cliente LDAP, necesario para conectarse al directorio.
const client = ldapjs.createClient({
    url: 'ldaps://10.0.2.15',
    tlsOptions: {
        rejectUnauthorized: false
    }
});

// Credenciales para el Bind.
const credentials = {
    dc: 'DC=samba,DC=lan',
    dn: 'CN=Administrator,CN=Users,DC=samba,DC=lan',
    pass: 'Pingeso1*'
};

// Bind, proceso para establecer conexión con el directorio.
client.bind(credentials.dn, credentials.pass, function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log("Bind success!");
    }
});

console.log(searchUser('roberto.lillo@usach.cl'));