---
layout: nodes.liquid
section: nodeOperator
date: Last Modified
title: "Enabling HTTPS Connections"
permalink: "docs/enabling-https-connections/"
whatsnext: {"Miscellaneous":"/docs/miscellaneous/"}
---
This guide will walk you through how to generate your own self-signed certificates for use by the Chainlink node. You can also substitute self-signed certificates with certificates of your own, like those created by <a href="https://letsencrypt.org/" target="_blank" rel="noreferrer, noopener">Let's Encrypt</a>.

> 📘 Important
>
> You will need [OpenSSL](https://www.openssl.org) in order to generate your own self-signed certificates.

Create a directory `tls/` within your local Chainlink directory:

```text Rinkeby
mkdir ~/.chainlink-rinkeby/tls
```
```text Kovan
mkdir ~/.chainlink-kovan/tls
```
```text Mainnet
mkdir ~/.chainlink/tls
```

Run this command to create a `server.crt` and `server.key` file in the previously created directory:

```shell Rinkeby
openssl req -x509 -out  ~/.chainlink-rinkeby/tls/server.crt  -keyout ~/.chainlink-rinkeby/tls/server.key \
  -newkey rsa:2048 -nodes -sha256 -days 365 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
```shell Kovan
openssl req -x509 -out  ~/.chainlink-kovan/tls/server.crt  -keyout ~/.chainlink-kovan/tls/server.key \
  -newkey rsa:2048 -nodes -sha256 -days 365 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```
```shell Mainnet
openssl req -x509 -out  ~/.chainlink/tls/server.crt  -keyout ~/.chainlink/tls/server.key \
  -newkey rsa:2048 -nodes -sha256 -days 365 \
  -subj '/CN=localhost' -extensions EXT -config <( \
   printf "[dn]\nCN=localhost\n[req]\ndistinguished_name = dn\n[EXT]\nsubjectAltName=DNS:localhost\nkeyUsage=digitalSignature\nextendedKeyUsage=serverAuth")
```

Next, add the `TLS_CERT_PATH` and `TLS_KEY_PATH` environment variables to your `.env` file.

```shell Shell
echo "TLS_CERT_PATH=/chainlink/tls/server.crt
TLS_KEY_PATH=/chainlink/tls/server.key" >> .env
```

If `CHAINLINK_TLS_PORT=0` is present in your `.env` file, remove it by running:

```shell Shell
sed -i '/CHAINLINK_TLS_PORT=0/d' .env
```

Also remove the line that disables `SECURE_COOKIES` by running:

```shell Shell
code": "sed -i '/SECURE_COOKIES=false/d' .env
```

Finally, update your run command to forward port 6689 to the container instead of 6688:

```shell Rinkeby
cd ~/.chainlink-rinkeby && docker run -p 6689:6689 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Kovan
cd ~/.chainlink-kovan && docker run -p 6689:6689 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n
```
```shell Mainnet
cd ~/.chainlink && docker run -p 6689:6689 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n
```

Now when running the node, you can access it by navigating to [https://localhost:6689](https://localhost:6689) if running on the same machine or with a ssh tunnel.
