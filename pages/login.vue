<template>
 <v-row justify="center" align-content="center">
     <v-col>
         <div v-if="this.isSSO === false">
             <v-card width="450px" class="mx-auto mt-5" elevation="12">
                 <v-card-title class="justify-center">
                     <v-img src="http://den3.net/wp-content/themes/den3HP/set/image/logo.png"></v-img>
                 </v-card-title>
                 <v-card-text>
                     <v-spacer />
                     <v-form>
                         <v-text-field
                             v-model="mail"
                             label="E-mail address"
                             prepend-icon="mdi-account-circle"
                         />
                     </v-form>
                     <v-form>
                         <v-text-field
                             v-model="pass"
                             type="Password"
                             label="Password"
                             prepend-icon="mdi-lock"
                         />
                     </v-form>
                 </v-card-text>
                 <v-divider></v-divider>
                 <v-card-actions>
                     <v-btn block color="info" @click="login">ログイン</v-btn>
                 </v-card-actions>
                 <v-card-actions>
                     <v-btn block color="success" to="register">新規登録はこちら</v-btn>
                 </v-card-actions>
                 <!-- <v-card-actions>
                     <v-btn block color="success">新規登録</v-btn>
                 </v-card-actions> -->
             </v-card>
         </div>
         <div v-else>
             <v-card width="450px" class="mx-auto mt-5" elevation="12">
                 <v-card-title class="justify-center">
                     <v-img src="http://den3.net/wp-content/themes/den3HP/set/image/logo.png"></v-img>
                 </v-card-title>
                 <v-card-text>
                     <v-layout justify-center>
                         <v-avatar class="justify-center" size="110">
                             <img v-bind:src="usericon">
                         </v-avatar>
                     </v-layout>
                     <h2 style="text-align: center" class="font-weight-light">{{ username }}として</h2>
                     <h2 style="text-align: center" class="font-weight-light">ログイン中です</h2>
                 </v-card-text>
                 <v-divider></v-divider>
                 <v-card-actions>
                     <v-btn block color="info" @click="continue_">続行</v-btn>
                 </v-card-actions>
                 <v-card-actions>
                     <v-btn block color="error" @click="logout">ログアウト</v-btn>
                 </v-card-actions>
             </v-card>
         </div>
     </v-col>
 </v-row>
</template>

<script>
export default {
    data: function () {
                return {
                    apiserver: '',
                    redirect: '',
                    isSSO: false,
                    mail: '',
                    pass: '',
                    username: '',
                    usericon: ''
                };
            },
    created: function () {
                this.apiserver = 'https://den3-idp.herokuapp.com';

                if(localStorage.getItem('authorization')){
                    let response = fetch(this.apiserver+'/api/v1/account/token', {
                        method: 'get',
                        headers: new Headers({
                            'Authorization': localStorage.getItem('authorization'),
                        })
                    });
                    response.then(r=>{
                        if(r.ok){
                            this.isSSO = true;
                            fetch(this.apiserver+'/api/v1/account/profile', {
                                method: 'get',
                                headers: new Headers({
                                    'Authorization': localStorage.getItem('authorization'),
                                }),
                            }).then(d=>d.json()).then(profile=>{
                                this.usericon = profile.icon;
                                this.username = profile.nick;
                            });
                        }
                    });
                }
            },
            methods: {

                continue_: function () {
                    this.$router.push('/')
                },
                logout: function () {

                    fetch(this.apiserver+'/api/v1/account/logout', {
                        method: 'post',
                        mode: 'cors',
                        headers: new Headers({
                            'Authorization': localStorage.getItem('authorization'),
                        })
                    }).then(j=>{
                        localStorage.removeItem('authorization');
                        location.href = "/login"
                    })
                },
                login: function () {
                    if(!this.isSSO){

                        fetch(this.apiserver+'/api/v1/account/login', {
                            method: 'post',
                            headers: {
                                'Content-Type': 'text/plain;charset=UTF-8'
                            },
                            body: JSON.stringify({
                                    "mail": this.mail,
                                    "pass": this.pass
                                }
                            )
                        })
                        .then(d=>{
                            return d.json();
                        })
                        .then(j=>{
                            if(j.message != undefined || j.message != null){
                                alert(j.message);
                                return;
                            }
                            if(j.authorization != undefined){
                                localStorage.setItem("authorization",j.authorization);
                                if(window.location.search.includes("redirect")){
                                    let perm = window.location.search.slice(1).split('?redirect=').filter(e=>e.includes("redirect"))[0].replace("redirect=","");
                                    location.href = decodeURIComponent(perm);
                                    return;
                                }
                            }
                            this.$router.push('/')
                        });
                    }else{
                        if(j.authorization != undefined){
                                localStorage.setItem("authorization",j.authorization);
                                if(window.location.search.includes("redirect")){
                                    let perm = window.location.search.slice(1).split('?redirect=').filter(e=>e.includes("redirect"))[0].replace("redirect=","");
                                    location.href = decodeURIComponent(perm);
                                    return;
                                }
                        }
                        this.$router.push('/')
                    }
                }
            }
}
</script>
