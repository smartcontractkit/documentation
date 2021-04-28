---
layout: nodes.liquid
date: Last Modified
title: "Enabling HTTPS Connections"
permalink: "docs/enabling-https-connections/"
whatsnext: {"Miscellaneous":"/docs/miscellaneous/"}
hidden: false
---
This guide will walk you through how to generate your own self-signed certificates for use by the Chainlink node. You can also substitute self-signed certificates with certificates of your own, like those created by <a href="https://letsencrypt.org/" target="_blank" rel="noreferrer, noopener">Let's Encrypt</a>.
[block:callout]
{
  "type": "info",
  "body": "You will need <a href=\"https://www.openssl.org/\" target=\"_blank\" rel=\"noreferrer, noopener\">OpenSSL</a> in order to generate your own self-signed certificates."
}
[/block]
Create a directory `tls/` within your local Chainlink directory:
[block:code]
{
  "codes": [
    {
      "code": "mkdir ~/.chainlink-rinkeby/tls",
      "language": "text",
      "name": "Rinkeby"
    },
    {
      "code": "mkdir ~/.chainlink-kovan/tls",
      "language": "text",
      "name": "Kovan"
    },
    {
      "code": "mkdir ~/.chainlink/tls",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]
Run this command to create a `server.crt` and `server.key` file in the previously created directory:
[block:code]
{
  "codes": [
    {
      "code": "openssl req -x509 -out  ~/.chainlink-rinkeby/tls/server.crt  -keyout ~/.chainlink-rinkeby/tls/server.key \\\n  -newkey rsa:2048 -nodes -sha256 -days 365 \\\n  -subj '/CN=localhost' -extensions EXT -config <( \\\n   printf \"[dn]\\nCN=localhost\\n[req]\\ndistinguished_name = dn\\n[EXT]\\nsubjectAltName=DNS:localhost\\nkeyUsage=digitalSignature\\nextendedKeyUsage=serverAuth\")",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "openssl req -x509 -out  ~/.chainlink-kovan/tls/server.crt  -keyout ~/.chainlink-kovan/tls/server.key \\\n  -newkey rsa:2048 -nodes -sha256 -days 365 \\\n  -subj '/CN=localhost' -extensions EXT -config <( \\\n   printf \"[dn]\\nCN=localhost\\n[req]\\ndistinguished_name = dn\\n[EXT]\\nsubjectAltName=DNS:localhost\\nkeyUsage=digitalSignature\\nextendedKeyUsage=serverAuth\")",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "openssl req -x509 -out  ~/.chainlink/tls/server.crt  -keyout ~/.chainlink/tls/server.key \\\n  -newkey rsa:2048 -nodes -sha256 -days 365 \\\n  -subj '/CN=localhost' -extensions EXT -config <( \\\n   printf \"[dn]\\nCN=localhost\\n[req]\\ndistinguished_name = dn\\n[EXT]\\nsubjectAltName=DNS:localhost\\nkeyUsage=digitalSignature\\nextendedKeyUsage=serverAuth\")",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]
Next, add the `TLS_CERT_PATH` and `TLS_KEY_PATH` environment variables to your `.env` file.

[block:code]
{
  "codes": [
    {
      "code": "echo \"TLS_CERT_PATH=/chainlink/tls/server.crt\nTLS_KEY_PATH=/chainlink/tls/server.key\" >> .env",
      "language": "shell"
    }
  ]
}
[/block]
If `CHAINLINK_TLS_PORT=0` is present in your `.env` file, remove it by running:
[block:code]
{
  "codes": [
    {
      "code": "sed -i '/CHAINLINK_TLS_PORT=0/d' .env",
      "language": "shell",
      "name": "Shell"
    }
  ]
}
[/block]
Also remove the line that disables `SECURE_COOKIES` by running:
[block:code]
{
  "codes": [
    {
      "code": "sed -i '/SECURE_COOKIES=false/d' .env",
      "language": "shell",
      "name": "Shell"
    }
  ]
}
[/block]
Finally, update your run command to forward port 6689 to the container instead of 6688:
[block:code]
{
  "codes": [
    {
      "code": "cd ~/.chainlink-rinkeby && docker run -p 6689:6689 -v ~/.chainlink-rinkeby:/chainlink -it --env-file=.env smartcontract/chainlink local n",
      "language": "shell",
      "name": "Rinkeby"
    },
    {
      "code": "cd ~/.chainlink-kovan && docker run -p 6689:6689 -v ~/.chainlink-kovan:/chainlink -it --env-file=.env smartcontract/chainlink local n",
      "language": "shell",
      "name": "Kovan"
    },
    {
      "code": "cd ~/.chainlink && docker run -p 6689:6689 -v ~/.chainlink:/chainlink -it --env-file=.env smartcontract/chainlink local n",
      "language": "shell",
      "name": "Mainnet"
    }
  ]
}
[/block]
Now when running the node, you can access it by navigating to <a href="https://localhost:6689" target="_blank" rel="noreferrer, noopener">https://localhost:6689</a> if running on the same machine or with a ssh tunnel.