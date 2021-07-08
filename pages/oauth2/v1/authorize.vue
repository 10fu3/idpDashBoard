<template>
    <v-row justify="center" align-content="center">
                <v-col>
                    <v-card width="450px" class="mx-auto mt-5" elevation="12">
                        <v-card-title class="justify-center">
                            <v-img src="http://den3.net/wp-content/themes/den3HP/set/image/logo.png"></v-img>
                        </v-card-title>
                        <v-card-text>
                            <v-col class="ml-5">
                                <v-layout justify="center"align-content="center">
                                    <v-avatar size="110">
                                        <img v-bind:src="service_icon">
                                    </v-avatar>
                                    <v-img justify="center" class="ml-12 mt-12 mr-12" max-height="30" max-width="30" src="https://cdn0.iconfinder.com/data/icons/feather/96/591276-arrow-right-512.png"></v-img>
                                    <v-avatar size="110">
                                        <img v-bind:src="user_icon">
                                    </v-avatar>
                                </v-layout>
                            </v-col>
                            <h1 class="font-weight-light" align="center">
                               {{ service_name }} が
                            </h1>
                            <h3 align="center">
                                あなたのアカウントへアクセスを要求しています
                            </h3>
                            <p class="font-weight-light" align="center">
                                {{ user_name }}としてサインイン中
                            </p>
                            <v-divider></v-divider>
                            <p class="font-weight-light mt-3" align="center">
                               説明: {{ service_description }}
                            </p>
                            <p class="font-weight-light" align="center">
                                {{ service_name }}は次の権限を要求しています
                            </p>
                            <v-list-item v-for="perm in perms">
                                <v-list-item-content>
                                    <v-list-item-title>･ {{ perm }}</v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        <v-divider></v-divider>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn block color="info" @click="login">承認する</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
</template>

<script>
    export default {
        data: function () {
            return {
                api_server: "",
                client_id: "",
                service_name: "",
                service_icon: "",
                service_description: "",
                user_icon: "",
                user_name: "",
                redirect: "",
                perms: []
            };
        },
        mounted: function () {
            var params = window.location.search.slice(1).split('&').map(p=>{return p.split("=")[0]});
            if(!(params.includes("response_type") && params.includes("client_id") && params.includes("redirect_uri")&& params.includes("state")&& params.includes("scope"))){
                location.href = "/";
                return;
            }
            var raw_client_id = window.location.search.slice(1).split('&').filter(p=>{return p.includes("client_id")}).map(p=>{return p.split("=")[1]});
            if(!raw_client_id.length){
                location.href = "/";
                return;
            }
            this.client_id = raw_client_id[0].replace("client_id");
            if(localStorage.getItem("authorization") === null){
                this.$router.push({ path:`/login?redirect=${encodeURI(location.href)}` })
            }
            this.api_server = "https://den3-idp.herokuapp.com/";
            let token_response = fetch(this.api_server+'/api/v1/account/token', {
                    method: 'get',
                    headers: new Headers({
                        'Authorization': localStorage.getItem('authorization'),
                    })
                });
                token_response.then(r=>{
                    if(r.ok){
                        fetch(this.api_server+'/api/v1/account/profile', {
                            method: 'get',
                            headers: new Headers({
                                'Authorization': localStorage.getItem('authorization'),
                            }),
                        }).then(d=>d.json()).then(profile=>{
                            this.user_icon = profile.icon;
                            this.user_name = profile.nick;
                        });
                        this.client_id =  this.$route.query.client_id
                        fetch(this.api_server+'/api/v1/service/', {
                             method: 'get',
                             headers: new Headers({
                                'client_id': this.client_id
                            })
                        }).then(d=>d.json()).then(service_json=>{
                            this.service_name = service_json.service_name;
                            this.service_icon = service_json.icon_uri;
                            this.service_description = service_json.description;
                            let perm = window.location.search.slice(1).split('&').filter(e=>e.includes("scope")).map(p=>p.split("=")[1].split("%20")).flat();
                            for(var index = 0;index<perm.length;index++){
                                switch(perm[index]){
                                    case "openid":
                                        this.perms.push("あなたを認証します");
                                        break;
                                    case "profile":
                                        this.perms.push("あなたのプロフィールを取得します");
                                        break;
                                    case "email":
                                        this.perms.push("あなたのメールアドレスを取得します");
                                        break;
                                }
                            }
                        }).catch(e=>{
                            location.href = "/";
                            return;
                        })
                    }else{
                        this.$router.push({ path:`/login?redirect=${encodeURI(location.href)}` })
                    }
                });

        },
        methods: {
            login: function () {
                fetch(this.api_server+location.href.replace(String(document.URL.split(":")[0]+"://"+document.domain),"").replace(":3000",""), {
                    method: 'post',
                    headers: {
                        'Content-Type': 'text/plain;charset=UTF-8',
                        'Authorization': localStorage.getItem('authorization'),
                    },
                }).then(d=>{
                    if(d.ok){
                        return d.json();
                    }
                }).then(j=>{
                    if(j.redirect){
                        location.href = j.redirect;
                    }else{
                        location.href = "/";
                    }
                }).catch(e=>{
                    location.href = "/";
                });
            }

        }
    }
</script>
