<template>
    <div id="profil">
            <header>  
                <nav class="navbar navbar-expand-md ">
                    <!-- Brand -->
                    <a class="navbar-brand" href="#"><img src='../assets/img/icon-left-font-monochrome-white.svg' alt='logo groupomania' class="logo" ></a>
                    <!-- Toggler/collapsibe Button -->
                    <button class="navbar-toggler" type="button" data-toggle="collapse" v-on:click="dropdown" data-target="#collapsibleNavbar">
                        <span class="navbar-toggler-icon"></span>
                        <span class="navbar-toggler-icon"></span>
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <!-- Navbar links -->
                    <div class="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <button class="nav-link btn btn-outline-danger"><a class="nav-link" href="#" @click="flute()">Déconnexion</a></button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link btn btn-outline-danger">
                                    <router-link to="/forum" class="nav-link">Forum</router-link>
                                </button>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div class="dropdown" id="dropdown">
                    <a class="dropdown-link" href="#" @click="logOut()">Déconnexion</a>
                    <router-link to="/forum" class="dropdown-link">Forum</router-link>
                </div>
        </header>
        <div class="container-fluid">
            <div class="image-profile">
                    <img :src="file" alt="photo de profil" class=" photo-de-profil img-thumbnail rounded-circle" >
                    <button   v-if="userId == identifiant || isAdmin == true" @click="showUpload" class="camera" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-fill" viewBox="0 0 16 16">
                            <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                            <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                        </svg>
                    </button>
                </div>
            <div class="unvisible show-upload" id="show-upload">
                <input @change="selectFile" type="file" class="form-control-file" id="file" accept=".jpg, .jpeg, .gif, .png">
                <button id="boutonImage" class="btn-profil" @click="uploadImage()"> Upload image </button>
            </div>
                <div class="infos">
                    <div class="username_block">
                        <div class="userName_change">
                            <p class="userName"> {{ userName }} </p>
                            <label   v-if="userId == identifiant || isAdmin == true"  @click="changeUsername()" for="userName">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                    <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z"/>
                                </svg>
                            </label>
                        </div>
                        <div v-if="userId == identifiant || isAdmin == true"  id="unvisible" class="input-group mb-3  unvisible">
                            <input type="text" v-model="userName" id="userName" class="form-control userName" placeholder="Nouveau pseudo" aria-label="Nouveau pseudo" aria-describedby="basic-addon2">
                            <div class="input-group-append">
                                <button @click="newUsername()" class="btn-profil" type="button">Modifier</button>
                            </div>
                        </div>
                    </div>
                <p class="info-profil"> {{ lastName }} </p>
                <p class="info-profil"> {{ firstName }} </p>
                <p class="info-profil"> {{ email }} </p>
                <button v-if="userId == identifiant || isAdmin == true"  class="suppression btn-profil" @click="deleteAccount()">Supprimer mon compte</button>
                </div>
            </div> 
    </div>  
</template>



<script>

import { mapState } from 'vuex'
import axios from 'axios'
import router from '../router'

export default {
    name: "Profil",
    props : ['id'],
    data () {
        return {
                lastName : "",
                firstName :"",
                userName :"",
                email : "",
                file : "",
                isAdmin : false,
                newFile : null,
                userId : this.$store.state.userId,
                identifiant : this.$store.state.identifiant
            }      
    },
    created (){
        const self = this;
            if(this.$store.state.token !=="") {
                let identifiant = this.$store.state.identifiant;
                    axios.get(`http://localhost:3000/api/auth/profil/${identifiant}`, 
                    {headers : {"Authorization" : `Bearer ${this.$store.state.token}`}
                    })
                .then(function(response){
                    console.log(response)
                    self.lastName = response.data.data.lastName;
                    self.firstName = response.data.data.firstName;
                    self.userName = response.data.data.userName;
                    self.email = response.data.data.email;
                    self.file = response.data.data.imageUser;
                    self.isAdmin = response.data.data.isAdmin
                        if(self.isAdmin === true){
                            self.$store.dispatch("isAdmin", true)
                        }else{
                            throw "Vous n'êtes pas administrateur"
                        }
                })
                .catch(function(error){
                    console.log(error)
                })
            }else { 
                console.log("Connectez-vous !")
            }
    },
    computed : {
        ...mapState(['userId', 'token', 'identifiant'])
    }, 
    methods: {
        dropdown : function(){
            const drop = document.getElementById("dropdown");
            drop.classList.toggle("visible");
        },
//modifier le userName 
        changeUsername : function(){
            let divUsername = document.getElementById("unvisible");
            divUsername.classList.toggle("unvisible")
        },
        newUsername : function() {
            const self = this;
            if(this.$store.state.token !==""){
                let newData = {
                    userName : this.userName,
                    lastName : this.lastName,
                    firstName: this.firstName,
                    email : this.email, 
                    file : this.file
                }
                
                    axios.put('http://localhost:3000/api/auth/profil/update', newData, {headers : {"Authorization" : `Bearer ${this.$store.state.token}`}})
                        .then(function(response) {
                            console.log("response axios.put username", response)
                            self.changeUsername()
                        })
                        .catch(function(error){
                        console.log(error)
                        })
            }else {
                    throw "Une erreur est survenue" }   
        }, 
//modifier l'image du profil 
        showUpload : function(){
            const showUpload = document.getElementById("show-upload")
            showUpload.classList.toggle("unvisible")
        },
        selectFile(event) {
            this.newFile = event.target.files[0];  
        },
        uploadImage : function() {
            const self = this;
            const fd = new FormData();
            fd.append("image", this.newFile, this.newFile.name)
                axios.put('http://localhost:3000/api/auth/profil/update', fd, {headers:
                    { 
                    "Authorization" : `Bearer ${this.$store.state.token}`,
                    "Content-Type": "multipart/form-data"
                    }
                })
                    .then(function(response) {
                        self.file = response.data.data.imageUser
                        self.showUpload()
                    })
                    .catch(function(error){
                        console.log(error)
                    })
        },
        deleteAccount : function(){
            if(this.$store.state.token !=="") {
                    axios.delete('http://localhost:3000/api/auth/suppression-profile', 
                    {headers : {"Authorization" : `Bearer ${this.$store.state.token}`}
                    })
                        .then(function(response){
                            console.log("response axios.delete", response)
                        })
                        .catch(function(error){
                            console.log(error)
                        })
                .then(function(){
                    localStorage.clear()
                    sessionStorage.clear()
                    router.push('/')
                })
                .catch(function(error){
                    console.log(error)
                })
           }else {
                throw "Vous n'êtes pas autorisé.e à supprimer le profil"
           }     
        },
        logOut : function(){
            localStorage.clear()
            router.push('/')
        }
    }
}
</script>

<style scoped>

    .container-fluid
    {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
   
    .camera {
        border: solid 0.5px #e0d9d9;
        border-radius: 34px;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #e0d9d9;
        cursor:pointer;
        margin: 0;
        position: relative;
        bottom: 20px;
        left: 20px;
    }

    .camera:hover {
        background-color: #a1a1a1;
    }

    .image-profile {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    form {
        border: solid 2px #dc3545;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2%;
        margin-top: 4%;
        border-radius: 34px;
    }

    .username_block{
        display: flex;
        flex-direction: column;
        font-weight: normal;
    }

    .userName_change 
    {
        display: flex;
        justify-content: center;
    }

    .userName_change label
    {
        margin-left: 30px;
        cursor: pointer;
    }

    .image-profile
    {
        width: 30%;
    }

    .infos 
    {
        display: flex;
        flex-direction: column;
        align-items: center;
        border: solid 2px #dc3545;
        border-radius : 34px;
        width: 60%;
        padding: 3%;
        font-weight: bold;
    }

    input
    {
       width: 50%;
    } 

    .show-upload
    {
        display: flex;
        margin-bottom: 3%;
    }

    .unvisible 
    {
        display: none;
    }

    .btn-profil
    {
        border: 1px #b1a7a7 solid;
        border-radius: 10px;
        padding: 5px;
        cursor: pointer;
    }

    .photo-de-profil
    {
        width: 50%;
    }

    @media screen and (max-width: 500px) {
        
        .photo-de-profil
        {
            width: 100%;
        }
    }
        

</style>