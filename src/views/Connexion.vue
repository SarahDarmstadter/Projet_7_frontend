<template>
    <div class="connexion" id="connexion">
        <header>  
            <nav class="navbar navbar-expand-md ">
            <!-- Brand -->
                <a class="navbar-brand" href="#"><img src='../assets/img/icon-left-font-monochrome-white.svg' alt='logo groupomania' class="logo" ></a>
            <!-- Toggler/collapsibe Button -->
                <button class="navbar-toggler burger" type="button" data-toggle="collapse" v-on:click="dropdown" data-target="#collapsibleNavbar">
                    <span class="navbar-toggler-icon"></span>
                    <span class="navbar-toggler-icon"></span>
                    <span class="navbar-toggler-icon"></span>
                </button>
            <!-- Navbar links -->
                <div class="collapse navbar-collapse" id="collapsibleNavbar">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <button class="nav-link btn btn-outline-danger"><a class="nav-link" href="#" @click="switchToLogin()">Connexion</a></button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link btn btn-outline-danger"><a class="nav-link"  href="#" @click="switchToCreateAccount()">Inscription</a></button>
                        </li>
                    </ul>
                </div>
                </nav>
                <div class="dropdown" id="dropdown">
                    <a class="dropdown-link" href="#" @click="switchToLogin()">Connexion</a>
                    <a class="dropdown-link" href="#" @click="switchToCreateAccount()">Inscription</a>
                </div>
        </header>
        <div class="container-fluid">
            <h1>Bienvenue sur le forum interne Groupomania !</h1>
        <div class="row row-sign-in">
            <div class="col-lg-5 col-md-7 col-sm-10">
                <form class="d-flex flex-column align-items-center">
                    <h2  v-if= "mode =='login'"> Connexion</h2>
                    <h2  v-else>Inscription</h2>
                    <p v-if= "mode =='login'"> Vous n'avez pas encore de compte ? <a href="#" class="card_action" @click="switchToCreateAccount()">Créer un compte</a></p>
                    <p v-else> Vous avez déjà un compte ? <a href="#" class="card_action" @click="switchToLogin()">Connectez-vous</a></p>
                    <div class="identite d-flex justify-content-between" v-if= "mode == 'create'">
                        <div class="form-group">
                            <input v-model="lastName" type="text" class="form-control" placeholder="Nom" required/>
                        </div>
                        <div class="form-group">
                            <input v-model="firstName" type="text" class="form-control" placeholder="Prénom" required />
                        </div>
                    </div>
                    <div class="form-group" v-if= "mode =='create'">
                        <input v-model="userName" type="text" class="form-control" placeholder="Username" required />
                    </div>
                    <div class="form-group">
                        <input v-model="email" type="email" class="form-control" placeholder="Email" required />
                        <p v-if= "mode== 'create' && status== 'erreur_creation'"> Adresse mail déjà utilisée </p>   
                    </div>
                    <div class="form-group d-flex justify-content-end align-items-center">  
                        <b-input v-if= "mode== 'login'" v-on:keyup.enter="connexion()" v-model= "password" id="password" type="password" class="form-control" placeholder="Mot de passe" required/>
                        <b-input v-else v-on:keyup.enter="createAccount()" v-model= "password" id="password" type="password" class="form-control" placeholder="Mot de passe" required/>
                        <div @click="switchEye()" class="icon-eye">
                            <b-icon  v-if= "passwordVisibility == 'hidden'" icon="eye" class="eye text-muted"></b-icon>  
                            <b-icon  v-else icon="eye-slash" class="eye-slash text-muted"></b-icon>
                        </div>
                    </div> 
                        <p class="condition_p" v-if= "mode =='create'">Votre mot de passe doit contenir entre 8 et 15 caractères, au moins une majuscule et un caractère spécial.</p>
                        <div v-if= "mode== 'login' && status== 'erreur_login'"> Adresse mail et/ou mot de passe invalide</div>   
                        <button @click="connexion()" type="button" class="btn btn-signin btn-lg btn-block" v-if= "mode =='login'" :class="{'disabled' : !emptyFields}" >Connexion</button>
                        <button @click="createAccount()" type="button" class="btn btn-signin btn-lg btn-block" :class="{'disabled' : !validPassword}" v-else>Inscription</button>
                </form>
                </div>
            </div>
        </div>
   </div> 
</template>

<script>

//mapState est une fonction utilitaire qui permet d'acceder au state du store. 
// On la déclare dans computed. 

import { mapState } from 'vuex'
import axios from 'axios'
//import router from '../router'

export default {
    name: "Connexion",
    data : function() {
        return {
            mode : 'login',
            passwordVisibility: 'hidden',
            lastName : '',
            firstName: '',
            userName: '',
            email:'',
            password:'',
        }
    },
    computed : {
        validPassword : function (){
            const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[-+!*$@%_])([-+!*$@%_\w]{8,15})$/gm;
            if (this.mode =='create' && this.password.match(regex) ) {
                return true;
            }else {
                return false
            }
        },
        emptyFields : function() {
                if ( this.mode =='login' && this.password != "" && this.email != "" ) {
                    return true;
                } else {
                    return false
                }
        },
        ...mapState(["status", "token"]),
    },
    methods : {
        dropdown : function(){
            const drop = document.getElementById("dropdown");
            drop.classList.toggle("visible");
        }, 
        switchToLogin : function (){
            return this.mode ='login';
        },
        switchToCreateAccount : function(){
            return this.mode ='create';
        },
        createAccount : function(){
            if(this.mode =='create' && this.password != "" && this.email != "" && this.userName!="" && this.lastName !="" && this.firstName !="") {
                    const self = this;
                    axios.post('http://localhost:3000/api/auth/sign-up', {
                        lastName : this.lastName,
                        firstName : this.firstName,
                        userName : this.userName,
                        imageUser: this.imageUser,
                        email : this.email,
                        password : this.password
                    })  
                    .then(function(response) {
                        console.log("RESPONSE AXIOS POST SIGNUP", response.data)
                        self.$store.dispatch('token', response.data.token)
                        self.$store.dispatch("userId", response.data.userId)
                        self.$store.dispatch('identifiant', response.data.userId)
                        self.$store.dispatch('isAdmin', response.data.isAdmin)
                        self.$store.dispatch("setStatus", "")
                        self.redirection()
                    })
                    .catch(function(error){
                        console.log(error)
                        self.$store.dispatch("setStatus", "erreur_creation")
                    })
                .then(function(){
                     console.log("kjzqvhqzrK")
                     self.$store.dispatch("setStatus", "")
                })
                .catch(function(error){
                    console.log(error)
                })
            }else{
                throw "veuillez remplir tous les champs"
            }
        },
        connexion : function(){
           const self = this;
                axios.post('http://localhost:3000/api/auth/login', {
                    email : this.email,
                    password : this.password
                })  
                .then(function(response) {
                    console.log("RESPONSE AXIOS POST LOGIN", response.data )
                    self.$store.dispatch('token', response.data.token)
                    self.$store.dispatch("userId", response.data.userId)
                    self.$store.dispatch('identifiant', response.data.userId)
                    self.$store.dispatch('isAdmin', response.data.isAdmin)
                    self.$store.dispatch("setStatus", "")
                })
                .catch(function(error){
                    console.log(error)
                    self.$store.dispatch("setStatus", "erreur_login")
                })
            .then(function(){
                self.redirection()
                self.$store.dispatch("setStatus", "")

            })
            .catch(function(error){
                console.log(error)
            }) 
        },
        redirection : function() {
            if(this.$store.state.token !== ""){
                this.$router.push({path : `/forum`})
           }else{
                    throw "Vous n'etes pas connecté et/ou autorisés"
                }
        },
       
        switchEye : function(){
            const passwordInput = document.getElementById("password");
            if( this.passwordVisibility == 'hidden') {
                passwordInput.removeAttribute("type", "password");
                passwordInput.setAttribute("type", "text");
                this.passwordVisibility = "shown"
            } else {
                this.passwordVisibility = "shown";
                passwordInput.removeAttribute("type", "text");
                passwordInput.setAttribute("type", "password");
                this.passwordVisibility ="hidden";
            }
        }
    }
}
</script>

<style scoped>

  h1
  {
     text-align : center;   
  }

  form
  {    
    padding: 6%;
    background: #dc3545;
    border-radius: 34px;
    color: white;
    margin-bottom: 10%;
  }

  .form-group
  {
    width: 90%;
  }

  .identite
  {
    width: 90%;
  }

  .identite .form-group
  {
    width: 48%;
  }

  .form-control
  {
    font-size: 1rem;
  }
  
  label 
  {
    font-weight: 500;
    margin: 3px;
  }

  .condition_p 
  {
      text-align: justify;
      width: 90%;
  }

  input 
  {
    margin-bottom: 5px;
  }

  .icon-eye
  {
    position: absolute;
    display:flex;
    padding-right: 1%;
    cursor: pointer;
  }

  .card_action
  {
    color: white;
    cursor: pointer;
    font-weight: bold;
  }

  .card_action:hover
  {
    text-decoration: underline;
    color: white;
  }

  .btn-signin
  {
    margin-top: 5%;
    color: white;
    cursor:pointer;
    border: solid 3px rgb(255, 215, 215);
    width: 50%;
    border-radius: 25px;
    padding: 2px;
  }

  .btn-signin:hover 
  {
    background: rgb(255, 215, 215);
    color: red;
    font-weight: bold;
  }

</style>