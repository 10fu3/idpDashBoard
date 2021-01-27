<template>
  <v-row>
    <v-col class="text-center">
       <v-row justify="center" align-content="center">
            <v-col>
                <v-card class="mx-auto mt-5" elevation="12">
                    <v-card-title class="justify-center">
                        <v-container>
                          <v-img src="http://den3.net/wp-content/themes/den3HP/set/image/logo.png"></v-img>
                          <h2 align="center" class="font-weight-light mt-5">
                            アカウントダッシュボードへようこそ
                          </h2>
                          <h4 class="mt-5 font-weight-light" align="center">
                            次の操作ができます
                          </h4>
                        </v-container>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                          <v-row>
                            <v-col v-for="thing in doThing" :key="thing.title">
                                <v-card>
                                  <v-card-title class="justify-center">
                                    <h4 class="mt-5 font-weight-light" align="center">
                                      {{thing.title}}
                                    </h4>
                                  </v-card-title>
                                  <v-card-text>
                                    <v-container>
                                      <v-icon size="100">{{ thing.icon }}</v-icon>
                                      <p class="mt-4">{{thing.message}}</p>
                                    </v-container>
                                  </v-card-text>
                                </v-card>
                              </v-col>
                          </v-row>
                      </v-container>
                    </v-card-text>
                </v-card>
            </v-col>
       </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  components: {
  },
  data: ()=>({
    doThing: [
      { 
        icon: 'mdi-account-edit',
        title: 'プロフィールの編集',
        message: 'あなたのプロフィールの表示と編集ができます.'
      },
      { 
        icon: 'mdi-account-network',
        title: '連携ログインの管理',
        message: '連携ログインしたサービスの表示と削除ができます.'
      },
      { 
        icon: 'mdi-server',
        title: 'サービスの管理',
        message: 'このIdPに対応したサービスの管理ができます.'
      },
    ]
  })
}
</script>
