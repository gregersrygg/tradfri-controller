const { TradfriClient, Accessory, AccessoryTypes } = require('node-tradfri-client');
var Button = require('gpio-button');
const gateway = require('./gateway');

const identity = process.env.IDENTITY;
const gatewayId = process.env.TRADFRI_GWID;
const psk = process.env.TRADFRI_PSK;
const generate = process.env.GENERATE;
const lightName = process.argv[2];

const button9 = new Button('button9');
const button10 = new Button('button10');
const button11 = new Button('button11');
const button22 = new Button('button22');

function exitWithError(...err) {
    console.error(...err);
    process.exit(1);
}

if (!gatewayId) {
    exitWithError(new Error('Please start with TRADFRI_GWID environment variable.'));
}

if ((!identity || !psk) && !generate) {
    exitWithError(new Error('Please start with IDENTITY and PSK environment variables.\nIf you need to generate new ones. Start with GENERATE=GATEWAY-SECRET.'));
    process.exit(1);
}

if (!lightName) {
    exitWithError(new Error('Missing argument with light name to control'));
}

main();

async function main() {
    const ipAddr = await gateway.locate(gatewayId);
    const tradfri = new TradfriClient(ipAddr);

    if (generate) {
        return tradfri.authenticate(generate)
            .then(({identity, psk}) => {
                console.log('Got new credentials from gateway:');
                console.log(`IDENTITY=${identity}`);
                console.log(`PSK=${psk}`);
                console.log('Please restart using these as environment variables');
                process.exit(0);
            });
    }

    await tradfri.connect(identity, psk);
    
    const lightbulbs = {};
    tradfri.on('device updated', (device) => {
        if (device.type === AccessoryTypes.lightbulb) {
            lightbulbs[device.instanceId] = device;
            //console.log('device updated', device.name, device.lightList[0].color);
        }
    });
    tradfri.observeDevices();

    button9.on('press', () => toggleColor('00ff00'));
    button10.on('press', () => toggleColor('0000ff'));
    button11.on('press', () => toggleColor('ff0000'));
    button22.on('press', () => toggleColor('ffe0a0'));

    async function toggleColor(c) {
        const lightId = Object.keys(lightbulbs).find(id => lightbulbs[id].name == lightName);
        if (!lightId) {
            exitWithError(new Error(`Couldn´t find light with name ${lightName}`));
        }
        const light = lightbulbs[lightId].lightList[0];
        await light.turnOn();
        await light.setColor(c);
    }
}

