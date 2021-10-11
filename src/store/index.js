import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  
    state : function() {
        return {
            status : "",
            token : "",
            userId:"",
            userProfil : {
                lastName : "",
                firstName:  "",
                userName:  "",
                email:  "",
                imageUser:"",
                password:  "",
            }
        }
    },
    // getters: {
    //     userInfoProfil: state => {
    //         return {
    //             lastName : state.lastName,
    //             firstName:  state.firstName,
    //             userName:  state.userName,
    //             email:  state.email,
    //             imageUser: state.imageUser,
    //             password: state.password
    //         }
    //     }
    // },
    mutations: {
        setStatus : function(state, status) {
            state.status = status
        },

        token : function(state, token) {
            localStorage.setItem('token', JSON.stringify(token))
            state.token = token
            console.log("state.token", state.token)
        }, 
        userId : function(state, userId) {
            state.userId = userId
        },

        userProfil : function(state, userProfil) {
            state.userProfil = userProfil
            console.log("state.userprofil", state.userProfil)
        }
  },
    actions: {
        token : function({commit}, token){
            commit("token", token)
            console.log("token depuis le store", token)
        },
        userId : function({commit}, userId) {
            commit("userId", userId)

        },
        getUserProfil : function ({commit}, userProfil) {
            commit("userProfil", userProfil)
            console.log("userprofil", userProfil)
        }
    }
})