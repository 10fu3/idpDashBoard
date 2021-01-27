<template>
    <v-row>
        <v-col class="text-center">
           <v-row justify="center" align-content="center">
                <v-col>
                    <h3 align="center">
                    </h3>
                    <v-container>
                        <v-row>
                            <v-col cols="12" xs="2" sm="4" md="4" lg="4">
                                <!-- @click.stop=";$router.push({ path: 'server_detail', query: { id: service.id }}); -->
                                <v-card height="300px" @click.stop=";$router.push({ path: 'service_create'})">
                                    <v-card-title>
                                        <v-container>
                                            <v-avatar class="ma-5">
                                                <v-img></v-img>
                                            </v-avatar>
                                            <v-spacer></v-spacer>
                                            <h3>+</h3>
                                            <p>新しくサービスを作成します</p>
                                        </v-container>
                                    </v-card-title>
                                    <v-card-text>
                                        <h3></h3>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-container>
                    <v-container>
                        <v-row>
                            <template v-for="(service, index) in services">
                            <v-col :key="`div-${index}`" cols="12" xs="2" sm="4" md="4" lg="4">
                                <v-card height="300px" @click.stop=";$router.push({ path: 'server_detail', query: { id: service.id }});">
                                    <v-card-title>
                                        <v-container>
                                            <center>
                                                <v-img align="center" max-width="70px" max-height="70px" :src="service.icon"></v-img>
                                            </center>
                                            <v-spacer></v-spacer>
                                            <h3 class="font-weight-light mt-10">{{service.name}}</h3>
                                        </v-container>
                                    </v-card-title>
                                    <v-card-text>
                                        <h3></h3>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            </template>
                        </v-row>
                    </v-container>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
export default {
    mounted: function(){
        this.apiserver = 'http://localhost';
        if(localStorage.getItem('authorization')){
            let response = fetch(this.apiserver+'/api/v1/service/', {
                method: 'get',
                headers: new Headers({
                    'Authorization': localStorage.getItem('authorization'), 
                })
            });
            response.then(r=>{
                return r.json()
            }).then(j=>{
                for(var i = 0;i<j.length;i++){
                    var a = j[i];
                    this.services.push({

                        name: a['service_name'],
                        icon: a['icon_url'],
                        perms: a['permissions'],
                        id: a['service_id']
                    });
                }
            })
        }
    },
    methods: {
        goDetail: function (id) {
            this.$router.push({ path:`/server_detail/${id}` })
        }
    },
    data () {
        return {
            services: [
               
            ],
        }
    },
}
</script>
