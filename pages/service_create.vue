<template>
  <v-row>
    <v-col>
       <v-row>
            <v-col>
                <v-card width="500px" class="mx-auto mt-5" elevation="9">
                  <v-card-title class="justify-center">
                    <v-container>
                      <h2 align="center" class="font-weight-light">
                        新規サービス登録
                      </h2>
                    </v-container>
                  </v-card-title>
                    <v-card-text>
                      <v-container>
                        <template v-for="(list, index) in lists">
                                    <v-card class="mb-5" :key="index">
                                        <v-card-text>
                                       <div v-if="list.id !== 'icon_url' && list.id !== 'permissions'">
                                          <v-container>
                                              <p>{{list.category}}を設定</p>
                                              <v-text-field
                                                v-model="list.input"
                                                :type="list.type"
                                                :rules="[list.rule]"
                                              ></v-text-field>
                                          </v-container>
                                        </div>
                                        <div v-else-if="list.id === 'permissions'">
                                            <v-container>
                                              <p>{{list.category}}を設定</p>
                                              <div v-for="(perm,index) in list.value" :key="index">
                                                <p>{{perm.tag}}</p>
                                                <v-switch v-model="perm.value"></v-switch>
                                              </div>
                                          </v-container>
                                        </div>
                                              <div v-else
                                                    @dragover.prevent
                                                    @drop.prevent="drop"
                                                  >
                                                <v-container>
                                                <p>{{list.category}}を設定</p>
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
                                              </v-container>
                                            </div>
                                            </v-card-text>
                                    </v-card>
                                  </template>
                      </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn
                          x-large
                          color="success"
                          @click="reg_request(lists)"
                          block
                        >
                        作成
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
    methods: {
      drop(event) {
        const files = event.target.files || event.dataTransfer.files;
        this.setIcon(files[0]);
      },

      setIcon: function (file) {
        let fileIndex = 0;
        let f = file != null ? file : this.lists[fileIndex].file;
        var mes = this.validate("icon",f.name);
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
                
                var piriod = value.split('.');
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
            case "redirect-url":
              if(!this.urlReg.test(value)){
                mes = "有効なURLを入力してください";
              }
              break;
            case "service-name":
            case "description":
                if(value.length < 1){
                    mes = "1文字以上入力してください";
                }
                break;
            case "permissions":
                var flag = false;
                for(var i = 0;i<value.length;i++){
                    if(value[i].value == true){
                        flag = true;
                    }
                }
                if(!flag){
                    mes = "一つも権限が設定されていません";
                }
                break;
        }
        return mes;
      },

      removeFile: function () {
        this.lists[0].fileName = '';
        this.lists[0].file = null;
      },

      reg_request: function (param) {
        var mes = '';

        for(var i = 0; i< param.length;i++){
            if(param[i].id === 'icon_url'){
                var name = this.lists[0].file.name.split(".");
                var id = name[name.length-1];
                if(!(id === "png" || id == "jpg" || id === "jpeg" || id ==="bmp")){
                    mes = "png jpg jpeg bmp の拡張子に対応しています";
                }
            }else if(param[i].id === 'permissions'){
                mes = this.validate(param[i].id,param[i].value);
            }else{
                mes = this.validate(param[i].id,param[i].input);
            }
            if(mes.length > 0){
                alert(mes);
            }
        }
        if(mes.length > 0){
            return;
        }

        var apiserver = "http://localhost";

        var icon_get_url = function (file,callback) {
            const formData = new FormData();
            formData.append("file", file);  // ファイル内容を詰める
            const param = {
              method: "POST",
              body: formData
            }
            fetch(apiserver+"/api/v1/img",param)
            .then((res)=>{
              return res.json();
            })
            .then((json)=>{
              callback(json['url']);
            });
        };

        var send = function (sendData){
          fetch(apiserver+"/api/v1/service/",{
            method:'post',
            headers: new Headers({
              'Authorization': localStorage.getItem('authorization'), 
            }),
            body: JSON.stringify(sendData)
          })
          .then((res)=>{
            if(!res.ok){
              return {};
            }
            return res.json();
          }).then((r)=>{
            if(r['error']){
              alert(r['error']);
            }else{
              alert('サービスの追加に成功しました');
              location.href = "/service_management"
            }
          }).catch((r)=>{
            alert("エラーが発生しました");
          })
        };

        var data = {};
        for(var i = 0; i< param.length;i++){
            if(param[i].id === 'permissions'){
                data['permissions'] = [];
                for (var j = 0; j < param[i].value.length; j++) {
                    var element = param[i].value[j];
                    if(element.value === true){
                        data['permissions'].push(element.id);
                    }
                }
            }else{
                data[param[i].id] = param[i].input;
            }
        }
        icon_get_url(this.lists[0].file,function (url) {
            data["icon_url"] = url;
            send(data);
        })
        
      },
    },
    data () {
        return {
            urlReg : /https?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .?%&=]*)?/ ,
            reg : /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            lists:[
              {
                rule: value => {
                  
                },
                fileName: '',
                input: null,
                id: 'icon_url',
                category: 'アイコン',
                value: ''
              },
              {
                rule: v => {
                  return ( v && v.length >= 1) || '1文字は設定してください'
                },
                input: '',
                id: 'service_name',
                category: 'サービス名',
                value: '',
                type: 'text'
              },
              {
                rule: v => {
                  return this.urlReg.test(v) || '有効なURLを入力してください'
                },
                input: '',
                id: 'redirect_url',
                category: 'リダイレクト先のURL コールバックURL',
                value: '',
                type: 'text'
              },
              {
                rule: v=> {
                    return true;
                },
                input: '',
                id: 'permissions',
                category: '使用する権限',
                type: '',
                value: [
                    {
                        tag: 'OpenID',
                        id: 'read_uuid',
                        value: false
                    },
                    {
                        tag: 'プロフィール',
                        id: 'read_profile',
                        value: false
                    },
                    {
                        tag: 'メールアドレス',
                        id: 'read_mail',
                        value: false
                    }

                ]
              },
              {
                rule: v => {
                  return ( v && v.length >= 1) || '1文字は設定してください'
                },
                input: '',
                id: 'description',
                category: 'サービスの説明',
                value: '',
                type: 'text'
              }
            ],
        }
    },

}
</script>