var mdns = require('multicast-dns')();

function isTradfriServer(gatewayId) {
    return (answer) => answer && answer.name.includes(gatewayId) && answer.type == 'A';
}

function gatewayQuestion(gatewayId) {
    return {
        questions:[{
            name: `TRADFRI-Gateway-${gatewayId}.local`,
            type: 'A'
        }]
    };
}

module.exports = {
    locate(gatewayId) {
        return new Promise((resolve, reject) => {
            mdns.query(gatewayQuestion(gatewayId));
            mdns.on('response', function(response) {
                if (!response.answers) { return; }
                //console.log(response.answers);
                const ipAnswer = response.answers.find(isTradfriServer(gatewayId));
                if (ipAnswer) {
                    mdns.destroy();
                    resolve(ipAnswer.data);
                }
            });
            setTimeout(() => {
                reject(new Error(`mDNS timeout for ${gatewayId}`));
            }, 10000);
        });
    }
};