import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex)

interface Authorization {
    key: string;
}

export default new Vuex.Store({
    state: {
        key: ''
    } as Authorization,

    getters: {
        getKey: (state,getters) => () => {
            return state.key;
        },
    },
    
    mutations:{
        setKey(state,payload){
            state.key = payload
        }
    },
})