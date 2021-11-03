import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex);

export default new Vuex.Store({
  
    state : function() {
        return {
            status : "",
            token : "",
            userId:"",
            isAdmin : false,
            identifiant:"",
            logOut: false
        }
    },
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
    mutations: {
        setStatus : function(state, status) {
            state.status = status
        },
        token : function(state, token) {
            sessionStorage.setItem('token', JSON.stringify(token))
            state.token = token
            console.log("state.token", state.token)
        }, 
        userId : function(state, userId) {
            state.userId = userId
        },
        isAdmin : function(state, response){
            state.isAdmin = response
        },
        identifiant : function(state, identifiant){
            state.identifiant = identifiant
        }, 
        logOut : function(state, log){
           log = true
           sessionStorage.clear()
            state.logOut = log
            state.identifiant =""
            state.userId =""
            state.token =""
        }
  },
    actions: {
        setStatus : function({commit}, status){
            commit("setStatus", status)
            console.log("setStatus", status)
        },
        token : function({commit}, token){
            commit("token", token)
            console.log("token depuis le store", token)
        },
        userId : function({commit}, userId) {
            commit("userId", userId)
        },
        logOut : function({commit}, log){
            localStorage.clear()
            commit("logOut", log)  
        }, 
        isAdmin : function({commit}, response){
            commit("isAdmin", response)
        },
        identifiant : function({commit},identifiant){
            commit("identifiant", identifiant)
        }, 
    }
})