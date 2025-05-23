const BASE_URL = 'https://wallet-proxy.testnet.concordium.com';

export const getIdentityProviders = () => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) return;
            
            if (xhr.status === 200) {
                try {
                    const data = JSON.parse(xhr.responseText);
                    resolve(data);
                } catch (e) {
                    reject(new Error('Invalid JSON response'));
                }
            } else {
                reject(new Error(`API Error: ${xhr.status}`));
            }
        };

        xhr.open('GET', `${BASE_URL}/v1/ip_info`, true);
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
    });
};