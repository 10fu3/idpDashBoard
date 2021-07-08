<template>
  <v-row>
    <v-col class="text-center">
       <v-row justify="center" align-content="center">
            <v-col>
                <h3 align="center" class="font-weight-light">
                            連携アカウント一覧
                </h3>
                <div v-if="services.length == 0">
                    <p>連携済みのサービスはありません</p>
                </div>
                <div v-else>
                    <template v-for="(service, index) in services">
                    <v-card class="mx-auto mt-5" elevation="12" :key="`div-${index}`">
                    <v-list-item :key="service.id">
                        <v-img max-width="70px" max-height="70px" :src="service.icon"></v-img>
                        <v-list-item-content>
                            <v-list-item-title>
                                <h3 class="font-weight-light">{{service.name}}</h3>
                            </v-list-item-title>
                            <p class="text-left mb-5 ml-5">権限</p>
                            <v-list-item v-for="(perm,index) in service.perms" :key="`div-${index}-${index}`">
                                <p>･ {{ getPermMsg(perm) }}</p>
                            </v-list-item>
                        </v-list-item-content>
                        <v-list-item-action>
                            <v-btn
                              depressed
                              color="error"
                              @click.stop="deleteLink(index)"
                            >
                              削除
                            </v-btn>
                        </v-list-item-action>
                    </v-list-item>
                    </v-card>
                </template>
                </div>
            </v-col>
       </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
    created: function(){
        this.apiserver = 'http://den3-sit.tk';
        if(localStorage.getItem('authorization')){
            let response = fetch(this.apiserver+'/oauth2/v1/token/', {
                method: 'get',
                headers: new Headers({
                    'Authorization': localStorage.getItem('authorization'), 
                })
            });
            response.then(r=>{
                return r.json();
            }).then(j=>{
                this.services = []

                for(var i = 0;i<j.length;i++){
                    var a = j[i];
                    this.services.push({
                        name: a.service_name,
                        id: a.id,
                        icon: a.icon_url,
                        perms: a.permissions,
                    });
                }
            })
        }
                        
    },
    methods: {
        deleteLink: function(index){
            var response = fetch(this.apiserver+'/oauth2/v1/revoke/', {
                method: 'post',
                headers: new Headers({
                    'Authorization': localStorage.getItem('authorization'), 
                }),
                body: JSON.stringify({
                    id: this.services[index].id
                })
            });
            
            response.then(r=>{
                if(r.ok){
                    this.services.splice(index,1);
                }else{
                    alert("エラーが起きました")
                }
            })
        },
        getPermMsg: function(perm){
            switch (String(perm).toLowerCase()) {
    
                case "read_uuid":
                    return "あなたを識別します";
                case "edit_uuid":
                    return "識別するためのIDを編集します";
                case "read_mail":
                    return "あなたのメールアドレスを読み取ります";
                case "edit_mail":
                    return "登録されたメールアドレスを編集します";
                case "read_profile":
                    return "あなたのプロフィールを読み取ります";
                case "edit_profile":
                    return "あなたのプロフィールを編集します";
                case "read_last_login_time":
                    return "最後にログインした時刻を読み取ります";
                case "delete_self_account":
                    return "あなたのアカウントを削除します";
                default:
                    return "?";
            }
        }
    },
    data () {
        return {
            services: [
                
            ],
        }
    },
    // created: {
        
    // }

}
</script>
