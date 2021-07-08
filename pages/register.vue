<template>
 <v-row justify="center" align-content="center">
     <v-col>
         <div>
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
                     <v-form>
                         <v-text-field
                             v-model="nick"
                             label="Nick name"
                             prepend-icon="mdi-account-details"
                         />
                     </v-form>
                 </v-card-text>
                 <v-divider></v-divider>
                 <v-card-actions>
                     <v-btn block color="success" @click="onJoin">新規登録</v-btn>
                 </v-card-actions>
             </v-card>
         </div>
     </v-col>
 </v-row>
</template>
<script>
export default({
    data: function(){
        return {
            reg : /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            apiserver: "https://den3-idp.herokuapp.com",
            mail: "",
            pass: "",
            nick: ""
        }
    },
    methods: {
        onJoin : function(){
            if(!this.reg.test(this.mail)){
                alert("有効なメールアドレスを入力してください");
                return;
            }
            if(this.pass < 8){
                alert("8文字以上のパスワードを設定してください");
                return;
            }
            if(this.nick < 1){
                alert("1文字以上のニックネームを設定してください");
                return;
            }

            fetch(this.apiserver+'/api/v1/account/', {
                method: 'post',
                headers: {
                    'Content-Type': 'text/plain;charset=UTF-8'
                },
                body: JSON.stringify({
                        "mail": this.mail,
                        "pass": this.pass,
                        "nick": this.nick
                    }
                )
            })
            .then(d=>{
                if(d.ok){
                    return d.json();
                }else{
                    return {};
                }
            })
            .then(j=>{
                if(j.status === "ERROR"){
                    alert(j.message)
                }else{
                    location.href = "/login";
                }
            })
        }
    }
})
</script>
