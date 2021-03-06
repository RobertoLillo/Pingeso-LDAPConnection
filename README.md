# Pingeso-LDAPConnection

Prueba de conexión entre aplicación Nodejs y SAMBA Active Directory.

## Creación de contenedor con SAMBA 4

Levantar el contenedor con el siguiente comando.
```
docker run -h addomain -d \
    -e SAMBA_REALM="SAMBA.LAN" \
    -e SAMBA_DOMAIN="samba" \
    -e SAMBA_PASSWORD="Pingeso1*" \
    -e KERBEROS_PASSWORD="Pingeso1*" \
    -e SAMBA_HOST_IP="10.0.2.15" \
    -e SAMBA_DNS_FORWARDER="8.8.8.8" \
    -e HOSTNAME="addomain" \
    -v ${PWD}/libsamba:/var/lib/samba \
    -v ${PWD}/krb5kdc:/var/lib/krb5kdc \
    --name addomain --privileged --network=host \
    babim/sambaad
```
Por algún motivo si se cambia el -h addomain el contenedor no se inicializa de forma correcta. Es importante cambiar el valor de SAMBA_HOST_IP por la IP de la máquina donde se esté levantando el contenedor.

## Creación de un grupo y un usuario para testing.

### Comando para ingresar al contenedor y utilizar la herramienta samba-tool.
```
docker exec -it addomain bash
```

### Para crear un usuario.
```
samba-tool user create 'username' 'password' --given-name='givenName' --surname='surname'
```
Reemplazando:
- username: por el nombre de usuario.
- password: por una contraseña con una mayúscula, un número y un símbolo.
- given_name: por el primer nombre.
- surname: por el apellido.

### Para crear un grupo.
```
samba-tool group add groupName
```
Reemplazando:
- groupName: por el nombre del grupo.

### Para agregar el usuario anteriormente creado al grupo.
```
samba-tool group addmembers groupName 'username'
```
Reemplazando:
- groupName: por el nombre del grupo recién creado.
- username: por el nombre del usuario recién creado.

## Funcionamiento ldapjs.

| Concepto | Explicación |
| :-------------: | ------------- |
| URL | Correspondiente a SAMBA_HOST_IP. |
| DC | Domain Controller, servidor de autenticación. Correspondiente a SAMBA_REALM. |
| DN | Distinguished Name, dirección del usuario en el árbol. |
| sAMAccountName | Nombre de cuenta del usuario creado en samba-tool. |
| CN | Common Name, nombre del usuario. |
| SN | Surname, apellido del usuario. |

Los siguientes son los valores basados en el comando docker run de más arriba.
```
url = 'ldaps://10.0.2.15'
DC = 'DC=samba,DC=lan'
DN = 'CN=Administrator,CN=Users,DC=samba,DC=lan'
Password = 'Pingeso1*'
sAMAccountName = 'username'
```
### Funciones de ldapjs necesarias para la conexión.

- **ldapjs.createClient({url:})** = Crea un cliente LDAP para conectarse al directorio. Requiere como mínimo la dirección del servidor.
- **client.bind(dn, password, function (err, res))** =  Establece la conexión entre el cliente LDAP y el servidor.
- **client.search(dc, options, function (err, res))** = Búsqueda de un usuario en el directorio, el nombre a buscar se incluye en **options**.
- **client.unbind(function(err))** = Termina la conexión entre el cliente LDAP y el servidor.
