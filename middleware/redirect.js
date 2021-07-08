export default function ({ redirect, store,route }) {
    
    let apiserver = 'https://den3-idp.herokuapp.com';

    if(localStorage.getItem('authorization')){
        let response = fetch(apiserver+'/api/v1/account/token', {
            method: 'get',
            headers: new Headers({
                'Authorization': localStorage.getItem('authorization'), 
            })
        });
        response.then(r=>{
            if(!r.ok){
                localStorage.clear('authorization');
                redirect('/login');
            }
        }).catch(e=>{
            localStorage.clear('authorization');
            redirect('/login');
        });
    }else{
        if(route.path.includes('/oauth2/v1/authorize')){
            return;
        }
        if(route.path === '/register'){
            return;
        }
        if(route.path !== '/login'){
            localStorage.clear('authorization');
            redirect('/login');
        }
    }
  }
