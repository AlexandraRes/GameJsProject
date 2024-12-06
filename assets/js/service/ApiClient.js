class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    async call(endpoint, method = 'GET', body = null, customHeaders = {}) {
        const headers = {
            'Content-Type': 'application/json',
            ...customHeaders,
        };

        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`, {
                method,
                headers,
                body: body ? JSON.stringify(body) : null,
                credentials: 'include',
            });
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Ошибка API запроса:', error);
        }
    }

    async get(endpoint) {
        return this.call(endpoint, 'GET');
    }

    async post(endpoint, body) {
        return this.call(endpoint, 'POST', body);
    }

    async put(endpoint, body) {
        return this.call(endpoint, 'PUT', body);
    }
}

export default new ApiClient('https://d5dsv84kj5buag61adme.apigw.yandexcloud.net');
