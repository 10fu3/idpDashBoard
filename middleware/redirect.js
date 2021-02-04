function isLogin(yes,no){
    if(localStorage.getItem('authorization')){
        let response = fetch(apiserver+'/api/v1/account/token', {
            method: 'get',
            headers: new Headers({
                'Authorization': localStorage.getItem('authorization'), 
            })
        });
        response.then(r=>{
            if(r.ok){
               yes(); 
            }else{
               no();
            }
        }).catch(e=>{
            no();
        });
    }
}

export default function ({ redirect, store,route }) {
    
    let apiserver = 'http://localhost';

    switch(route.path){
        case "/account_info":
        case "/account_link":
        case "/server_detail":
        case "/service_create":
        case "/service_management":
        case "/settings":
            isLogin(()=>{
                
            },()=>{
                localStorage.clear('authorization');
                redirect('/login');
            });
            break;
    }
  }