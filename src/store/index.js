import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state : function() {
    return {
    status : "",
    token : "",
    userProfil : {
      lastName : "",
      firstName:  "",
      userName:  "",
      email:  "",
      imageUser:"",
      password:  ""
      }
    }
},
  
  mutations: {
    setStatus : function(state, status) {
      state.status = status
    },

    identification : function(state, token) {
      localStorage.setItem('token', JSON.stringify(token))
      state.token = token
      console.log("state.token", state.token)
    }, 

    userProfil : function(state, userProfil) {
      state.userProfil = userProfil
      console.log("state.userprofil", state.userProfil)
    }
  },
 

  actions: {

    identification : function({commit}, token){
      commit("identification", token)
      console.log("token depuis le store", token)
    },

    getUserProfil : function ({commit}, userProfil) {
        commit("userProfil", userProfil)
        console.log("userprofil", userProfil)
    }
  }
})
