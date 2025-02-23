import WebSocket from 'ws';

class CoinPokerConnector {
    constructor(ws_endpoint) {
        this.ws_endpoint = ws_endpoint;
        this.authToken = process.env.COINPOKER_TOKEN;
        this.connection = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.connection = new WebSocket(this.ws_endpoint);

            this.connection.onopen = () => {
                console.log("Connected to CoinPoker API");
                this._authenticate()
                    .then(resolve)
                    .catch(reject);
            };

            this.connection.onmessage = (message) => {
                console.log("Received:", message.data);
            };

            this.connection.onerror = (error) => {
                console.error("WebSocket error:", error);
                reject(error);
            };

            this.connection.onclose = (event) => {
                console.log("Disconnected from CoinPoker API", event.reason);
            };
        });
    }

    async _authenticate() {
        const authMsg = {
            "type": "auth",
            "token": this.authToken,
            "platform": "desktop"
        };
        this.connection.send(JSON.stringify(authMsg));
    }

    async getTableState(tableId) {
        return new Promise((resolve, reject) => {
            const msg = {
                "type": "table_state",
                "tableId": tableId,
                "currency": "USDT"
            };
            this.connection.send(JSON.stringify(msg));

            this.connection.onmessage = (message) => {
                try {
                    const data = JSON.parse(message.data);
                    resolve(data);
                } catch (error) {
                    reject(error);
                }
            };
        });
    }

    async executeAction(action) {
        // Placeholder for action execution
        console.log("Executing action:", action);
    }
}

export default CoinPokerConnector;
