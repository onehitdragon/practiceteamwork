function doRequestApi(url, medthod, option = {}){
    if(medthod == null || medthod.toUpperCase() === 'GET'){
        return fetch(url, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include'
        })
        .then((res) => {
            if(!res.ok) throw new Error("error");
            return res.json();
        })
    }
    if(medthod.toUpperCase() === 'POST' || medthod.toUpperCase() === 'PUT'){
        return fetch(url, {
            method: medthod.toUpperCase(),
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': option.contentType
            },
            body: option.body
        })
        .then((res) => {
            if(!res.ok) throw new Error("error");
            return res.json();
        })
    }
}

export default doRequestApi;