<template>
    <div id ="post">
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
                            <button class="nav-link btn btn-outline-danger"><a class="nav-link" href="#" @click="logOut()">Déconnexion</a></button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link btn btn-outline-danger"><a class="nav-link" @click="myProfil()" href="#">Mon compte</a></button>
                        </li>
                    </ul>
                </div>
                </nav>
                <div class="dropdown" id="dropdown">
                    <a class="dropdown-link" @click="myProfil()" href="#">Mon compte</a>
                    <a class="dropdown-link" href="#" @click="logOut()">Déconnexion</a>
                </div>
        </header>
        <div class="container-fluid">
            <div class="row justify-content-center ">
                <div class=" col-md-6 publier">
                    <div class="profil-titre" id="profil-titre">
                        <img :src="imageUser" alt="photo de profil de l'auteur" class="auteur img-thumbnail img-fluid rounded-circle">
                        <button @click="showCard()" type="text" id="titre">Quoi de neuf {{ userName }} ? </button>
                    </div>
                    <div class="unvisible" id="create_message">
                            <input v-model="title" class="publication" placeholder="titre" required>
                            <div class="styled-input wide">
                                <textarea  v-model="content" class="publication" placeholder="Message" required></textarea>
                    </div>
                    <div class="flex-end">
                        <button @click="showUpload()" class="icon_media" >Image</button>
                        <div class="unvisible show-upload" id="show-upload">
                                <input @change="selectFile" type="file" class="form-control-file" id="file" accept=".jpg, .jpeg, .gif, .png">
                                <button id="boutonImage" class="btn-profil" @click="uploadImage()">Upload</button>
                        </div>
                        <button @click="createPost()" id="publier" class="btn-danger btn-publier">Publier</button>
                        </div>
                    </div>
                </div>
            </div>               
        </div>                            
    </div>
</template>

<script>

import axios from 'axios'
import {mapState} from 'vuex'
//import router from '../router'

export default {
    name : "CreatePost",
    data () {
        return {
            userName : "",
            imageUser : "",
            image : null,
            content :"",
            title:"",
        }
    },
    created() {
        const self = this;
            if(this.$store.state.token !=="") {
                    axios.get(`http://localhost:3000/api/auth/profil/${this.$store.state.userId}`, 
                    {headers : {"Authorization" : `Bearer ${this.$store.state.token}`}
                    })
                .then(function(response){
                    self.userName = response.data.data.userName;
                    self.imageUser = response.data.data.imageUser;

                })
        }else{ 
            console.log("Connectez-vous !")
        }
    },
    computed : {
        ...mapState(['userId', 'token', 'identifiant'])
    },
    methods : {
        dropdown : function(){
          const drop = document.getElementById("dropdown");
          drop.classList.toggle("visible");
        },
        showUpload : function(){
            const showUpload = document.getElementById("show-upload")
            showUpload.classList.toggle("unvisible")
        },
        showCard : function(){
            const showCard = document.getElementById("create_message")
            showCard.classList.toggle("unvisible")
        },
        selectFile(event) {
            this.image = event.target.files[0];  
        },
        createPost : function(){
            const self= this;
            if(this.image && this.title!=="" && this.message !=="") {
                const postMessage = {
                    title : this.title,
                    content : this.content,
                    userId : this.$store.state.userId
                }
                const fd = new FormData()
                fd.append("image", this.image, this.image.name)
                fd.append("postMessage", JSON.stringify(postMessage))
            
                axios.post("http://localhost:3000/api/post/create", 
                fd, {headers:
                        { 
                        "Authorization" : `Bearer ${this.$store.state.token}`,
                        "Content-Type": "multipart/form-data"
                        }
                    })
                    .then(function(response){
                        console.log(response)
                        const createMessage = document.getElementById("create_message")
                        createMessage.classList.toggle("unvisible")
                        self.$router.push('/forum')
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(){
                    self.$emit("create-post", true)
                })
                .catch(function(error){
                    console.log(error)
                })
            }else if (this.title!=="" && this.message !==""){
                const postMessage = {
                    title : this.title,
                    content : this.content,
                    userId : this.$store.state.userId
                }
                axios.post("http://localhost:3000/api/post/create", 
                    postMessage, 
                    {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}
                })
                    .then(function(response){
                        console.log(response)
                        const createMessage = document.getElementById("create_message")
                        createMessage.classList.toggle("unvisible")
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(){
                    self.$emit("create-post", true)
                })
                .catch(function(error){
                    console.log(error)
                })
            } else {
                throw "Veuillez remplir les champs"
            } 
        },
        myProfil : function(){
            this.$store.dispatch('identifiant', this.$store.state.userId )
             this.$router.push({path : `/profil/${this.$store.state.userId}`})
        },
        logOut : function(){
            this.$store.commit('logOut')
            this.$router.push({path : `/`})
        }
    }
}
</script>

<style scoped>

* :before :after {
    box-sizing: border-box;
}
    #post
    {
        display: flex;
        flex-direction: column;   
        font-size: 1em;   
    }

    #titre
    {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .publier 
    {
        display: flex;
        flex-direction: column;
        padding: 10px;
    }

    .profil-titre
    {
        display: flex;
        align-items: center;
        background: white;
        padding: 0.5%;
        width: 100%;
        margin-bottom: 10px;
    }

    .profil-titre button
    {
        border-radius: 34px;
        border: none;
        width: 100%;
        height: 30px;
    }

    .profil-titre img 
    {
        margin-right: 3%;
        width: 50px;
    }

    .publication
    {
        width: 100%;
        background: white;
        margin-bottom: 10px;
        border-radius: 10px;
        box-shadow: -0.2px 0.2px 0px 0.5px rgba(0, 0, 0, 0.2);
        border: none;
    }

    .container
    {
        display: flex;
        flex-direction: column;
        align-content: center;
        align-items: center;
    }

     .show-upload
    {
        display: flex;
        margin-bottom: 3%;
    }

    .unvisible {
        display: none
    }

    .icon_media 
    {
        display: flex;
        background: none;
        justify-content: flex-end;
        border: none;
        margin-bottom: 10px;
        align-items:center;
        cursor: pointer;
        border-radius: 10px;
        box-shadow: -0.2px 0.2px 0px 0.5px rgba(0, 0, 0, 0.2);
    }

    .icon_media:hover 
    {
        background-color: #f0f2f5;
    }
    .row > * 
    {
        padding: 0px;
    }

    .col-xs-12
    {
        padding: 0;
    }
    
    .btn-publier 
    {
        width: 25%;
        border-radius: 25px;
        border: none;
        cursor: pointer;
        padding: 3px;
    }
    .btn-publier:hover 
    {
        font-weight: bold;
    }

    .btn-profil
    {
        border: solid 0.3px rgba(0, 0, 0, 0.2);
    }

    #create_message 
    {        
        margin-right: 10px;
        margin-left:10px;
    }

    .flex-end
    {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
    }

    

    


   



</style>