export default function ({ redirect, store,route }) {
    
    let apiserver = 'http://localhost';

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
        if(route.path === '/authorize'){
            return;
        }
        if(route.path !== '/login'){
            localStorage.clear('authorization');
            redirect('/login');
        }
    }
  }