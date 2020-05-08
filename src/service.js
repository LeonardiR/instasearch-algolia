export class Service {
    constructor() {
        this.url = 'https://GAVVNU5N19-dsn.algolia.net/1/indexes/pre_SIGOV_ACORDS';
    }

   async getData(){
        let response = await fetch(this.url , {
            method: 'get',
            headers: {
                'X-Algolia-API-Key': '1db3a3bcbfde7f48c3d5f5bc632776c9',
                'X-Algolia-Application-Id': 'WI4G3IOEA5',
                'Content-Type' : 'application/json',
            }
        });
        if (response.ok) {
           const result = await response.json();
           return result;
        } else {
            alert("HTTP-Error: " + response.status);
        }
    }

}
