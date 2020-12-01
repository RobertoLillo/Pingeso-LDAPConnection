# Pingeso-Nodejs-ldapConnection

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