<template>
  <v-row>
    <v-col>
       <v-row>
            <v-col>
                <v-card width="500px" class="mx-auto mt-5" elevation="9">
                  <v-card-title class="justify-center">
                    <v-container>
                      <h2 align="center" class="font-weight-light">
                        アカウント情報
                      </h2>
                    </v-container>
                  </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-card>
                            <v-card-text>
                              <v-list>
                                  <template v-for="(list, index) in lists">
                                      <v-list-item :key="list.id">
                                        <v-col class="text-left mb-5">
                                          <p>{{list.category}}</p>
                                        </v-col>
                                        <v-col class="text-right">
                                          <div v-if="list.id === 'icon'">
                                            <v-avatar class="ma-5">
                                              <v-img :src="list.value"></v-img>
                                            </v-avatar>
                                          </div>
                                          <div v-else>
                                            <p class="mb-5">{{list.value}}</p>
                                          </div>
                                        </v-col>
                                      </v-list-item>
                                      <v-expansion-panels  :key="list.id+'-panel'">
                                        <v-expansion-panel>
                                          <v-expansion-panel-header>変更</v-expansion-panel-header>
                                          <v-expansion-panel-content>
                                              <div v-if="list.id !== 'icon'">
                                                <v-container>
                                                    <p>新しい{{list.category}}を設定</p>
                                                    <v-text-field
                                                      v-model="list.input"
                                                      :type="list.type"
                                                      :rules="[list.rule]"
                                                    ></v-text-field>
                                                    <v-spacer></v-spacer>
                                                    <v-btn
                                                      color="primary"
                                                      outlined
                                                      @click.stop="change_request(list.id,list.input,index)"
                                                    >変更</v-btn>
                                                </v-container>
                                              </div>
                                              <div v-else
                                                    @dragover.prevent
                                                    @drop.prevent="drop" 
                                                  >
                                                <v-container>
                                                <p>新しい{{list.category}}を設定</p>
                                                <p>imgurというアップローダーに画像がアップロードされます</p>
                                                <br>
                                                  <v-file-input
                                                    accept="image/png, image/jpeg, image/bmp"
                                                    placeholder="png jpeg bmp"
                                                    prepend-icon="mdi-camera"
                                                    @change="setIcon"
                                                  ></v-file-input>
                                                  <p>{{lists[0].fileName}}</p>
                                                  <v-spacer></v-spacer>
                                                  <v-btn
                                                    color="error"
                                                    outlined
                                                    @click.stop="removeFile"
                                                  >削除</v-btn>
                                                  <v-btn
                                                    color="primary"
                                                    outlined
                                                    @click.stop="change_request(list.id,list.input,index)"
                                                  >変更</v-btn>
                                              </v-container>
                                            </div>
                                          </v-expansion-panel-content>
                                        </v-expansion-panel>
                                      </v-expansion-panels>
                                      <v-divider class="mt-3 mb-3" style="border-color:#FFFFFF" v-if="index == 0 || index+1 < lists.length"></v-divider>
                                  </template>
                                </v-list>
                              </v-card-text>
                          </v-card>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                      <v-btn color="error" block>
                        アカウントを削除
                      </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
       </v-row>
    </v-col>
  </v-row>
</template>

<script>
  export default {
    computed: {

    },
    props: {
      noValidation: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      drop(event) {
        const files = event.target.files || event.dataTransfer.files;
        this.setIcon(files[0]);
      },

      setIcon: function (file) {
        let fileIndex = 0;
        let f = file != null ? file : this.lists[fileIndex].file;
        var mes = this.validate("icon",f);
        if(mes.length > 0){
          alert(mes);
          return;
        }
        
        this.lists[fileIndex].file = f;
        this.lists[fileIndex].fileName = f.name;
      },

      validate: function (id,value) {
        var mes = "";
        switch(id){
          case "icon":
            if(value == null || value == undefined){
              mes = "画像がアップロードされていません"
            }else{
              var piriod = value.name.split('.');
              switch(piriod[piriod.length-1]){
                case 'png':
                case 'jpg':
                case 'jpeg':
                case 'bmp':
                  break;
                default:
                  mes = ".png .jpg .jpeg .bmpの拡張子のファイルに対応しています"
                  break;
              }
            }
            break;
          case "mail":
            if(!this.reg.test(value)){
              mes = "有効なメールアドレスを入力してください";
            }
            break
          case "pass":
            if(value.length < 8){
              mes = "パスワードは8文字以上にしてください";
            }
            break
          case "nick":
            if(value.length < 1){
              mes = "1文字以上入力してください`";
            }
        }
        return mes;
      },

      removeFile: function () {
        this.lists[0].fileName = '';
        this.lists[0].file = null;
      },
      change_request: function (id,changeVal,index) {
        this.lists[index].input = '';
        var apiserver = "http://den3-sit.tk";
        var value = null;
        var mes = '';
        if(id === "icon"){
          value = changeVal != null ? changeVal : this.lists[0].file;
          mes = this.validate(id,value);
        }else{
          mes = this.validate(id,changeVal);
        }
        if(mes.length > 0){
            alert(mes);
            return;
        }

        var reload = function (lists) {
          let list = []
          var apiserver = 'http://den3-sit.tk';
          let response = fetch(apiserver+'/api/v1/account/', {
              method: 'get',
              headers: new Headers({
                  'Authorization': localStorage.getItem('authorization'), 
              })
          });
          response.then(r=>{
              return r.json()
          }).then(a=>{
            for (var i = 0; i < lists.length; i++) {
              switch(lists[i].id){
                case "icon":
                  lists[i].value = a['icon'];
                  break;
                case "mail":
                  lists[i].value = a['mail'];
                  break;
                case "nick":
                  lists[i].value = a['nick'];
                  break
                case "newpass":
                  lists[i].input = "";
              }
            }

          })
      };

        var send = function (sendID,sendValue,reload,lists,index){
          var json = {};
          json[sendID] = sendValue;
          fetch(apiserver+"/api/v1/account/",{
            method:'put',
            mode: 'cors',
            headers: new Headers({
              'Authorization': localStorage.getItem('authorization'), 
            }),
            body: JSON.stringify(json)
          })
          .then((res)=>{
            if(res.ok){
              reload(lists);
              return {};
            }
            return res.json();
          }).then((r)=>{
            if(r['error']){
              alert(r['error']);
            }
          }).catch((r)=>{
            alert("エラーが発生しました");
          })
        };


        if(id === "icon"){
          const formData = new FormData();
          formData.append("file", this.lists[0].file);  // ファイル内容を詰める
          const param = {
            method: "POST",
            body: formData
          }
          fetch(apiserver+"/api/v1/img",param)
          .then((res)=>{
            return res.json();
          })
          .then((json)=>{
            send(id,json['url'],reload,this.lists,index)
          });
        }else{
          send(id,changeVal,reload,this.lists);
        }
      },
      reload: function () {
        let list = []
        var apiserver = 'http://den3-sit.tk';
        let response = fetch(apiserver+'/api/v1/account/', {
            method: 'get',
            headers: new Headers({
                'Authorization': localStorage.getItem('authorization'), 
            })
        });
        response.then(r=>{
            return r.json()
        }).then(a=>{
          for (var i = 0; i < this.lists.length; i++) {
            switch(this.lists[i].id){
              case "icon":
                this.lists[i].value = a['icon'];
                break;
              case "mail":
                this.lists[i].value = a['mail'];
                break;
              case "nick":
                this.lists[i].value = a['nick'];
                break
              case "newpass":
                this.lists[i].input = "";
            }
          }
    
        })
      }
    },
    created: function(){
      let list = []
      var apiserver = 'http://den3-sit.tk';
      let response = fetch(apiserver+'/api/v1/account/', {
          method: 'get',
          headers: new Headers({
              'Authorization': localStorage.getItem('authorization'), 
          })
      });
      response.then(r=>{
          return r.json()
      }).then(a=>{
        for (var i = 0; i < this.lists.length; i++) {
          switch(this.lists[i].id){
            case "icon":
              this.lists[i].value = a['icon'];
              break;
            case "mail":
              this.lists[i].value = a['mail'];
              break;
            case "nick":
              this.lists[i].value = a['nick'];
              break
            case "newpass":
              this.lists[i].input = "";
          }
        }
  
      })

    },
    data () {
        return {
            reg : /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            lists:[
              {
                rule: value => {
                  
                },
                fileName: '',
                input: null,
                id: 'icon',
                category: 'アイコン',
                value: ''
              },
              {
                rule: value => {
                  return this.reg.test(value) || '無効なメールアドレスです'
                },
                input: '',
                id: 'mail',
                category: 'メールアドレス',
                value: '',
                type: 'text'
              },
              {
                rule: v => {
                  return ( v && v.length >= 8) || '8文字以上のパスワードを設定してください'
                },
                input: '',
                id: 'newpass',
                category: 'パスワード',
                value: '',
                type: 'password'
              },
              {
                rule: v => {
                  return ( v && v.length >= 1) || '1文字は設定してください'
                },
                input: '',
                id: 'nick',
                category: 'ニックネーム',
                value: '',
                type: 'text'
              }
            ],
        }
    },

}
</script>