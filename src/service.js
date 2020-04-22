export class Service {
    constructor() {
        this.url = 'https://2RGQIXQAQ7-dsn.algolia.net/1/indexes/pre_ACORDS_DEL_GOVERN';
    }

   async getData(){
        let response = await fetch(this.url , {
            method: 'get',
            headers: {
                'X-Algolia-API-Key': 'cf8ee0237b646e5eb579182451b740c8',
                'X-Algolia-Application-Id': '2RGQIXQAQ7',
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
