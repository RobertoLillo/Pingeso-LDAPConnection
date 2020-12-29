// DC = Domain Controller, servidor de autenticación.
// DN = Distinguished Name, dirección del usuario en el árbol.
// CN = Common Name, nombre del usuario.
// SN = Surname, apellido del usuario.
// sAMAccountName = nombre de la cuenta.

const ldapjs = require('ldapjs');

function searchUser(sAMAccountName) {
    return new Promise((resolve, reject) => {
        // Credenciales para el Bind.
        const credentials = {
            dc: 'DC=samba,DC=lan',
            dn: 'CN=Administrator,CN=Users,DC=samba,DC=lan',
            pass: 'Pingeso1*'
        };

        // Opciones de búsqueda.
        const opts = {
            filter: `(sAMAccountName=${sAMAccountName})`,
            scope: 'sub',
            attributes: ['cn', 'memberOf']
        };

        // Cliente LDAP, necesario para conectarse al directorio.
        const client = ldapjs.createClient({
            url: 'ldaps://10.0.2.15',
            tlsOptions: {
                rejectUnauthorized: false
            }
        });

        client.bind(credentials.dn, credentials.pass, (err) => {
            if (err) {
                return err;
            }
            const results = [];
            client.search(credentials.dc, opts, (err, res) => {
                res.on('searchEntry', (entry) => {
                    results.push(entry.object);
                });
                res.on('error', (error) => {
                    console.log(`Error: ${error.message}`);
                    if (err) {
                        client.destroy();
                        reject(err);
                    }
                });
                res.on('end', (result) => {
                    client.destroy();
                    resolve(results);
                });
            });
        });
    });
}

async function search(name) {
    const groups = [];
    const result = await searchUser(name);
    if (Array.isArray(result) && result.length) {
        const obj = result[0];
        if (Array.isArray(obj.memberOf)) {
            for (let i = 0; i < obj.memberOf.length; i++) {
                let group = obj.memberOf[i];
                let splitted = group.split(",");
                splitted = splitted[0].split("=");
                groups.push(splitted[1]);
            }
        } else {
            let splitted = obj.memberOf.split(",");
            splitted = splitted[0].split("=");
            groups.push(splitted[1]);
        }
    };
    return groups;
}

search('roberto.lillo@usach.cl').then(result => console.log("RL: " + result));
search('alan.barahona@usach.cl').then(result => console.log("AB: " + result));
search('javier.perez@usach.cl').then(result => console.log("JP: " + result));