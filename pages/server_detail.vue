<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <v-card width="500px" class="mx-auto mt-5" elevation="9">
            <v-card-title class="justify-center">
              <v-container>
                <h2 align="center" class="font-weight-light">{{lists[3].value}} の情報 </h2>
              </v-container>
            </v-card-title>
            <v-card-text>
              <v-container>
                <template v-for="(list, index) in lists">
                  <v-card class="mb-5" :key="index">
                    <v-card-text>
                      <div v-if="list.id !== 'icon_url' && list.id !== 'permissions'">
                        <v-container>
                          <p>{{list.category}}</p>
                          <p>{{list.value}}</p>
                          <div v-if="!(list.id === 'client_id' || list.id === 'service_secret')">
                            <v-expansion-panels :key="list.id+'-panel'">
                              <v-expansion-panel>
                                <v-expansion-panel-header>変更</v-expansion-panel-header>
                                <v-expansion-panel-content>
                                  <p>{{list.category}}を設定</p>
                                  <v-text-field v-model="list.input" :type="list.type" :rules="[list.rule]" ></v-text-field>
                                  <v-btn color="success" outlined @click.stop="reg_request(index,lists)" >登録</v-btn>
                                </v-expansion-panel-content>
                              </v-expansion-panel>
                            </v-expansion-panels>
                          </div>
                          <div v-if="list.id === 'service_secret'">
                            <v-btn color="success" outlined @click="update_secret(load,$route.query.id,lists)" >新しいキーを発行する </v-btn>
                          </div>
                        </v-container>
                      </div>
                      <div v-else-if="list.id === 'permissions'">
                        <v-container>
                          <p>{{list.category}}</p>
                          <div v-for="(perm,index1) in list.value" :key="index1">
                            <p>{{perm.tag}}</p>
                            <v-switch v-model="perm.value"></v-switch>
                          </div>
                          <v-btn color="success" outlined @click.stop="reg_request(index,lists)" >登録</v-btn>
                        </v-container>
                      </div>
                      <div v-if="list.id ==='icon_url'" @dragover.prevent @drop.prevent="drop" >
                        <v-container>
                          <p>{{list.category}}</p>
                          <v-avatar>
                            <v-img :src="list.value"></v-img>
                          </v-avatar>
                          <v-expansion-panels :key="list.id+'-panel'">
                            <v-expansion-panel>
                              <v-expansion-panel-header>変更</v-expansion-panel-header>
                              <v-expansion-panel-content>
                                <p>{{list.category}}を設定</p>
                                <p>imgurというアップローダーに画像がアップロードされます</p>
                                <br>
                                <v-file-input accept="image/png, image/jpeg, image/bmp" placeholder="png jpeg bmp" prepend-icon="mdi-camera" @change="setIcon" ></v-file-input>
                                <div v-if="lists != null && lists[2].input !== undefined && lists[2].input !== null">
                                  <p>{{lists[2].input.name}}</p>
                                </div>
                                <v-spacer></v-spacer>
                                <v-btn color="error" outlined @click.stop="removeFile" >削除</v-btn>
                                <v-btn color="success" outlined @click.stop="removeFile" >登録</v-btn>
                              </v-expansion-panel-content>
                            </v-expansion-panel>
                          </v-expansion-panels>
                        </v-container>
                      </div>
                    </v-card-text>
                  </v-card>
                </template>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn block x-large color="error" @click="remove">削除する</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>
export default {
	created: function() {
		this.query = this.$route.query.id;
		var apiserver = "http://localhost";
		fetch(apiserver + '/api/v1/service?id=' + this.$route.query.id, {
			method: 'get',
			headers: new Headers({
				'Authorization': localStorage.getItem('authorization'),
			})
		}).then(r => {
			if (!r.ok) {
				alert("エラーが発生しました");
				return {};
			}
			return r.json();
		}).then(j => {
			for (var i = 0; i < this.lists.length; i++) {
				var e = this.lists[i];
				if (e.id === 'permissions') {
					for (var k = 0; k < e.value.length; k++) {
						if (j.permissions.includes(e.value[k].id)) {
							e.value[k].value = true;
						}
					}
				} else {
					e.value = j[e.id];
				}
			}
		})
	},
	methods: {
    remove: function (params) {
      var apiserver = "http://localhost";
     	var sendbody = {};
			sendbody['client_id'] = this.lists[0].value;
					fetch(apiserver + '/api/v1/service', {
						method: 'delete',
						headers: new Headers({
							'Authorization': localStorage.getItem('authorization'),
						}),
						body: JSON.stringify(sendbody)
					}).then(r => {
						if (!r.ok) {
							alert("エラーが発生しました");
						}
            alert('削除しました');
            location.href = '/service_management';
          });
    },
		drop(event) {
				const files = event.target.files || event.dataTransfer.files;
				this.lists[2].input = files[0];
				console.log(this.lists[2].input.name);
				this.setIcon(files[0]);
			},

			setIcon: function(file) {
				let fileIndex = 2;
				let f = file != null ? file : this.lists[fileIndex].input;
				var mes = this.validate("icon", f.name);
				if (mes.length > 0) {
					alert(mes);
					return;
				}
				this.lists[fileIndex].input = f;

			},

			validate: function(id, value) {
				var mes = "";
				switch (id) {
					case "icon_url":
						if (value == null || value == undefined) {
							mes = "画像がアップロードされていません"
						} else {

							var piriod = value.split('.');
							switch (piriod[piriod.length - 1]) {
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
					case "redirect_url":
						if (!this.urlReg.test(value)) {
							mes = "有効なURLを入力してください";
						}
						break;
					case "service_name":
					case "description":
						if (value.length < 1) {
							mes = "1文字以上入力してください";
						}
						break;
					case "permissions":
						var flag = false;
						for (var i = 0; i < value.length; i++) {
							if (value[i].value == true) {
								flag = true;
							}
						}
						if (!flag) {
							mes = "一つも権限が設定されていません";
						}
						break;
				}
				return mes;
			},

			update_secret: function(callback, query, list) {
				var sendbody = {};
				sendbody['client_id'] = this.lists[0].value;
				sendbody['secret_update'] = 'update';
				var send = function() {
					var apiserver = "http://localhost";
					fetch(apiserver + '/api/v1/service', {
						method: 'put',
						headers: new Headers({
							'Authorization': localStorage.getItem('authorization'),
						}),
						body: JSON.stringify(sendbody)
					}).then(r => {
						if (!r.ok) {
							alert("エラーが発生しました");
						}
						callback(list, query);
					});
				};
				send();

			},

			removeFile: function() {
				this.lists[2].input = null;
			},

			reg_request: function(index, param) {
				var mes = '';
				if (param[index].id === 'icon') {
					var name = this.lists[2].input.name.split(".");
					var id = name[name.length - 1];
					if (!(id === "png" || id == "jpg" || id === "jpeg" || id === "bmp")) {
						mes = "png jpg jpeg bmp の拡張子に対応しています";
					}
				} else if (param[index].id === 'permissions') {
					mes = this.validate(param[index].id, param[index].value);
				} else {
					mes = this.validate(param[index].id, param[index].input);
				}
				if (mes.length > 0) {
					alert(mes);
				}
				if (mes.length > 0) {
					return;
				}

				var apiserver = "http://localhost";

				var icon_get_url = function(file, lists, callback) {
					const formData = new FormData();
					formData.append("file", file); // ファイル内容を詰める
					const param = {
						method: "POST",
						body: formData
					}
					fetch(apiserver + "/api/v1/img", param)
						.then((res) => {
							return res.json();
						})
						.then((json) => {
							callback(lists, json['url']);
						});
				};
        var i = index;
        var l = this.lists;
				let query = this.$route.query.id;
				var send = function(sendData,load) {
					fetch(apiserver + "/api/v1/service/", {
							method: 'put',
							mode: 'cors',
							headers: new Headers({
								'Authorization': localStorage.getItem('authorization'),
							}),
							body: JSON.stringify(sendData)
						})
						.then((res) => {
							if (res.ok) {
								return {};
							}
							return res.json();
						}).then((r) => {
							if (r['error']) {
								alert(r['error']);
							} else {
                load(l,query);
							}
						})
				};

				var senddata = {};
				senddata.client_id = this.lists[0].value;

        var load = this.load;

				if (param[index].id === 'permissions') {
					senddata['permissions'] = [];
					for (var j = 0; j < param[index].value.length; j++) {
						var element = param[index].value[j];
						if (element.value === true) {
							senddata['permissions'].push(element.id);
						}
					}
          send(senddata,load);
				} else if (param[index].id === 'icon') {
					icon_get_url(this.lists[2].input, this.lists, function(lists, url) {
						var icondata = {};
						icondata['icon_url'] = url;
						icondata['client_id'] = this.lists[0].value;
						send(icondata,load);
					})
				} else {
					senddata[param[index].id] = param[index].input;
					send(senddata,load);
				}
			},
	},
	data() {
		return {
			query: '',
			load: function(lists, query) {
				var apiserver = "http://localhost";
				fetch(apiserver + '/api/v1/service?id=' + query, {
					method: 'get',
					headers: new Headers({
						'Authorization': localStorage.getItem('authorization'),
					})
				}).then(r => {
					return r.json();
				}).then(j => {
					for (var i = 0; i < lists.length; i++) {
						var e = lists[i];
						if (e.id === 'permissions') {
							for (var k = 0; k < e.value.length; k++) {
								if (j.permissions.includes(e.value[k].id)) {
									e.value[k].value = true;
								}
							}
						} else {
							e.value = j[e.id];
						}
					}
				})
			},
			urlReg: /https?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .?%&=]*)?/,
			reg: /^(([^<>()[\]\\.,;:\s@]+(\.[^<>()[\]\\.,;:\s@]+)*)|(.+))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
			lists: [{
				rule: value => {
					return true;
				},
				id: 'client_id',
				category: 'サービスID',
        value: '',
        isSuccess: false
			}, {
				rule: value => {
					return true;
				},
				id: 'service_secret',
				category: 'シークレットキー',
        value: '',
        isSuccess: false
			}, {
				rule: value => {
					return true;
				},
				input: null,
				id: 'icon_url',
				category: 'アイコン',
				value: '',
        display_icon: null,
        isSuccess: false
			}, {
				rule: v => {
					return (v && v.length >= 1) || '1文字は設定してください'
				},
				input: '',
				id: 'service_name',
				category: 'サービス名',
				value: '',
        type: 'text',
        isSuccess: false
			}, {
				rule: v => {
					return this.urlReg.test(v) || '有効なURLを入力してください'
				},
				input: '',
				id: 'redirect_uri',
				category: 'リダイレクト先のURL',
				value: '',
				type: 'text',
        isSuccess: false
			}, {
				rule: v => {
					return true;
				},
				input: '',
				id: 'permissions',
				category: '使用する権限',
				type: '',
        isSuccess: false,
				value: [{
						tag: 'OpenID',
						id: 'read_uuid',
						value: false
					}, {
						tag: 'プロフィール',
						id: 'read_profile',
						value: false
					}, {
						tag: 'メールアドレス',
						id: 'read_mail',
						value: false
					}

				]
			}, {
				rule: v => {
					return (v && v.length >= 1) || '1文字は設定してください'
				},
				input: '',
				id: 'description',
				category: 'サービスの説明',
				value: '',
        type: 'text',
        isSuccess: false
			}],
		}
	},

}

</script>