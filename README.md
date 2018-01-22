# Raspberry Pi Tradfri controller

This in an ongoing hobby project to let the kids control the color of the light in their bedroom using colored arcade buttons. You'll need:

- IKEA Tradfri RGB bulb
- IKEA Tradfri gateway
- Any Raspberry Pi with network - Zero W is small
- Arkade buttons

## Raspberry Pi preparation

Here are the notes I took during setup. Not sure they're complete.

Install raspbian stretch on an SD card

Add a file named “ssh” to boot
Add a file named /boot/wpa_supplicant.conf with content

```
country=NO
ctrl_interface=DIR=/var/run/wpa_supplicant GROUP=netdev
update_config=1
network={
    ssid="your_SSID"
    psk="your_PSK"
}
```

Eject SD card and insert into raspberry pi and boot.

    ssh pi@raspberrypi.local

password is “raspberry”

Update password

    passwd

Set new hostname (then you can access it with {hostname}.local instead of IP)

    sudo nano /etc/hostname

Add new hostname to 127.0.1.1 (replace raspberrypi)

    sudo nano /etc/hosts
    sudo reboot

Update packages

    sudo apt-get update
    sudo apt-get upgrade

Install git

    sudo apt-get install git

Install nodejs

    wget https://nodejs.org/dist/v9.4.0/node-v9.4.0-linux-armv6l.tar.xz
    tar xvf node-v9.4.0-linux-armv6l.tar.xz
    sudo mv node-v9.4.0-linux-armv6l /opt/
    sudo ln -s /opt/node-v9.4.0-linux-armv6l /opt/node
    sudo ln -s /opt/node/bin/node /usr/local/bin/node
    sudo ln -s /opt/node/bin/npm /usr/local/bin/npm

Install yarn

    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    sudo apt-get update && sudo apt-get install yarn

## Install tradfri-controller

    git clone https://github.com/gregersrygg/tradfri-controller
    yarn install

Check overlays folder and compile.dts.sh that the gpio you want is configured correctly. See [gpio-button](https://github.com/fivdi/gpio-button) for details

    ./compile-dts.sh

Look under the gateway to find the secret

    TRADFRI_GWID=TRADFRI_GATEWAY_ID GENERATE=TRADFRI_GATEWAY_SECRET node index.js

Add returned identity and pre shared key (psk) to ~/.profile

    export IDENTITY=tradfri_123
    export TRADFRI_PSK=abc123
    export TRADFRI_GWID=0123456789ab

Log in & out or run `source ~/.profile` to export the env variables to the current shell. Then start the app with light name as argument.

    node index.js Kidsroom
