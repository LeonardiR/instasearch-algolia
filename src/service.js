export class Service {
    constructor() {
        this.url = 'https://GAVVNU5N19-dsn.algolia.net/1/indexes/pre_ACORDS_DEL_GOVERN';
    }

   async getData(){
        let response = await fetch(this.url , {
            method: 'get',
            headers: {
                'X-Algolia-API-Key': 'f612c10b31cc7d018b2f5bc35ee83413',
                'X-Algolia-Application-Id': 'GAVVNU5N19',
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
