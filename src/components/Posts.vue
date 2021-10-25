<template>
    <div id="posts">
            <div class="container mt-2 mb-5">
                <div class="row d-flex align-items-center justify-content-center">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="d-flex justify-content-between p-2 px-3">
                                <div class="auteur">
                                    <img :src="user.imageUser" alt="photo de profil de l'auteur" class="auteur--img img-thumbnail img-fluid rounded-circle" style ="width: 50px">
                                    <div class="aside">
                                       <p @click="goProfil(user.id)" class="auteur--userName">{{ user.userName }} </p>
                                        <p class="date">Publié le {{ createdAt.slice(0,10).split('-').reverse().join('.') + ' à ' + createdAt.slice(11,16)}} </p>
                                    </div>
                                </div>
                                <div  v-if="user.id == userId || isAdmin == true" @click="showActions()" class="dots">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                    </svg>
                                </div>
                            </div> 
                            <div :id="identifiantPost(id)+'_actions'" class="actions unvisible">
                                <p @click="updatePost(id)" class=" action">Modifier</p>
                                <p @click="deletePost(id)" class=" action">Supprimer</p>
                            </div>
                            <div class="p-2">
                                <p class="content">{{ content }}</p>
                                <img :src="image" class="img-fluid">
                            <div :id="identifiantPost(id)+'_postUpdate'" class="postUpdate overlay unvisible">
                                <div></div>
                                <div class="postUpdate_header">
                                    <p>Modifier la publication</p>
                                    <button class="close" @click="closeUp()"><i class="fas fa-times"></i></button>
                                </div>
                                <div class="input_change">
                                    <textarea v-on:keyup.enter="updatePayloadPost(id)" v-model="newPostContent" class="post_update"></textarea>
                                    <button @click="showUp()" class="btn-profil btn-image btn-modifier" >Image</button>
                                    <div class="unvisible show-up" id="show-up">
                                            <input @change="selectFile" type="file" class="form-control-file" id="file" accept=".jpg, .jpeg, .gif, .png">
                                            <button id="bouton_image" class="btn-profil btn-modifier btn-publier btn-danger" @click="updatePayloadPost(id)">Modifier</button>
                                    </div>
                                </div>
                            </div>
                                <hr>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex flex-row icons d-flex align-items-center"> <i class="fa fa-heart"></i> <i class="fa fa-smile-o ml-2"></i> </div>
                                    <div class="d-flex flex-row muted-color comm_section">
                                       <p @click="displayComs(id)" v-if ="comments.length >1" class="commentaires" id="commentaires"> {{ comments.length }} Commentaires </p>
                                        <p @click="displayComs(id)" v-else-if =" 1> comments.length < 1 " class="commentaires" id="commentaires"> 1 Commentaire </p>
                                        <p @click="displayComs(id)" v-else class="commentaires" id="commentaires"> Commenter </p> 
                                    </div>
                                </div>
                                <div class="unvisible" :id="identifiantPost(id)+'_tous_les_coms'" >
                                    <div class="comments" :id="identifiantPost(id)+'_comment-composant'">
                                        <commentaires :postId="identifiantPost(id)" 
                                        v-for="postComment in postComments"
                                        :key="postComment.id"
                                        v-bind="postComment"
                                        @delete-com="deleteCom"
                                        
                                        />
                                    </div> 
                                   <div class="createC">
                                        <create-commentaire 
                                        :id="identifiantPost(id)"
                                        @create-comm="readPostComments"/>
                                    </div>  
                                </div> 
                                    </div>
                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
</template>

<script>

import axios from 'axios'
import { mapState} from 'vuex'
import Commentaires from './Commentaires.vue'
import createCommentaire from './createCommentaire.vue'



export default {
    name: "Post", 
    components : {
        Commentaires,
        createCommentaire
    },
    props : {
        id : {
            type: Number,
        },
        content: {
            type: String
        },
        image : {
            type: String
        },
        createdAt : {
            type: String
        },
        user : {
            type : Object
        },
        comments : {
            type : Array
        }

    },
    data(){
        return {
            postComments : [],
            commentaireContent:"",
            commentaireImg : "",
            postId:"",
            newImagePost: null,
            postImg:"",
            newPostContent : this.content, 
            isAdmin : false, 
        }
    },
   
    computed: {
        ...mapState(["token", "userId", "identifiant"]),
    },
    methods: {
        identifiantPost : function(param){
            return this.postId = param
        },
        goProfil : function(param){
            this.$store.dispatch("identifiant", param)
            this.$router.push({path : `/profil/${this.$store.state.identifiant}`})
        }, 
        showUp : function(){
            const showUp = document.getElementById("show-up")
            showUp.classList.toggle("unvisible")
        },
        showActions : function(){ 
            let test = this.postId + '_actions'
            let actions = document.getElementById(test)
            actions.classList.toggle("unvisible")
        },
        displayComs(param) {
                const test = this.postId + '_tous_les_coms'
                const allComments = document.getElementById(test)
                allComments.classList.toggle("unvisible")
                this.readPostComments(param)
        },
        readPostComments : function(postId){
            const self = this;
                axios.get(`http://localhost:3000/api/comment/read/${postId}`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log("postComments", response.data)
                   self.postComments = response.data
                })
               .catch(function(error){
                   console.log(error)
               })   
            .then(function(){
                self.$emit("other-change",true)
            })
            .catch(function(error){
                console.log(error)
            })               
        },
        deleteCom(param){
            console.log("param splice", param)
            for (let i=0; i< this.postComments.length; i++) {
                console.log("postCoomments.id", this.postComments[i].id)
                
                 if(this.postComments[i].id === param) {
                    console.log("id = param")
                    this.postComments.splice(i, 0)
                    console.log("this.postComments.splice(i, 1)", this.postComments.splice(i, 1))
                    }
                this.$emit("other-change", true)
            }     
        },
        updateCom(param){
            console.log(param)
            axios.get(`http://localhost:3000/api/comment/${param}/read`, 
                {headers : { "Authorization" : `Bearer ${this.$store.state.token}`}})
                    .then(function(response){
                        console.log(response)
                    })
                    .catch(function(error){
                        console.log(error)
                    })
    
                
        },
        selectFile(event) {
            this.newImagePost = event.target.files[0];  
        },
        closeUp: function() {
            console.log("CLOSE UP")
            const idPostUpdate = this.postId + '_postUpdate'
            const postUpdate = document.getElementById(idPostUpdate)
            postUpdate.classList.toggle("unvisible", "noScroll")
            document.body.style.overflow ='visible'
            document.body.style.backgroundColor ="white"
            const profilTitre = document.getElementById("profil-titre")
            profilTitre.style.backgroundColor = 'white'
            const posts = document.getElementsByClassName("card")
                for (let i=0; i<posts.length; i++) {
                    posts[i].style.backgroundColor='white'
                }  
            this.newPostContent = this.content
        },
        updatePost : function(){
            const idActions = this.postId + '_actions'
            const actions = document.getElementById(idActions)
            actions.classList.toggle("unvisible")

            const idPostUpdate = this.postId + '_postUpdate'
            const postUpdate = document.getElementById(idPostUpdate)
            postUpdate.classList.toggle("unvisible")
            postUpdate.classList.toggle("noScroll")

            if (postUpdate.classList.contains("noScroll"))
               {  document.body.style.overflow ='hidden';
                document.body.style.backgroundColor ="#ebebed"
                const profilTitre = document.getElementById("profil-titre")
                profilTitre.style.backgroundColor = '#ebebed'
                const posts = document.getElementsByClassName("card")
                for (let i=0; i<posts.length; i++) {
                    posts[i].style.backgroundColor='#ebebed'
                }  
              }      
        },
        updatePayloadPost : function(param){
            this.closeUp()
            const self= this;
            if(this.newPostcontent !=="" && this.newImagePost !== null) {
                const newData = {
                    content : this.newPostcontent,
                    postId : param
                }
                const fd = new FormData()
                fd.append("image", this.newImagePost, this.newImagePost.name)
                fd.append("postMessage", JSON.stringify(newData))
            
                axios.put(`http://localhost:3000/api/post/${param}/update`, 
                fd, {headers:
                        { 
                        "Authorization" : `Bearer ${this.$store.state.token}`,
                        "Content-Type": "multipart/form-data"
                        }
                    })
                    .then(function(response){
                        console.log(response)
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(){
                    self.$emit("update-post", true)
                })
                .catch(function(error){
                        console.log(error)
                })
            }else if (this.newPostcontent !==""){
                const postMessage = {
                    content : this.newPostContent,
                    postId : param
                }
                axios.put(`http://localhost:3000/api/post/${param}/update`, 
                    postMessage, 
                    {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}
                })
                    .then(function(response){
                        console.log(response)
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(){
                    self.$emit("update-post", true)
                    const idPostUpdate = self.postId + '_postUpdate'
                    const postUpdate = document.getElementById(idPostUpdate)
                    postUpdate.classList.add("unvisible")
                })
                .catch(function(error){
                    console.log(error)
                })
            } else {
                throw "Veuillez remplir les champs"
            } 
        },
        deletePost : function(param) {
            const self= this;
            axios.delete(`http://localhost:3000/api/post/${param}/delete`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log(response)
                })
                .catch(function(error){
                    console.log(error)
                })
            .then(function(){
                self.$emit('delete-post', true)
            })
            .catch(function(error){
                console.log(error)
            })
        },

    }
}
</script>
<style scoped>

body 
{
    background-color: #eee;
    font-weight: 300
}

.card 
{
        border: solid 0.3px rgba(0, 0, 0, 0.2);
}

.auteur
{
    display: flex;
    align-items: center;
}

.auteur--userName 
{
    font-weight: bold;
    font-size: 0.8em;
}

.aside 
{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 15px;
    margin-left: 5px;
    line-height: 0;
}
.date
{
    font-size : 0.7em;
    color: #a09c9c;
}
.content
{
    text-align: start;
}

.ellipsis {
    color: #a09c9c
}

hr {
    color: #a09c9c;
    margin-top: 4px;
    margin-bottom: 8px
}

.muted-color {
    color: #a09c9c;
    font-size: 13px
}

.ellipsis i {
    margin-top: 3px;
    cursor: pointer
}

.rounded-image {
    border-radius: 50% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px
}

.name {
    font-weight: bold;
}

.commentaires
{
    cursor: pointer;
}

.form-control 
{
    border-radius: 26px;
    background-color: #f0f2f5;
    border: none
}

.comment-input {
    position: relative
}

.fonts 
{
    color: #313131;
}

.uploads
{
    display: flex;
    justify-content: flex-end;
    position: relative;
    bottom: 27px;
    width: 6%;
    margin-left: 90%;
}

.form-control:focus {
    background-color: #fff;
    outline: 0;
    box-shadow: none;
    border: solid 0.5px rgb(207, 205, 205);
}

.show-upload
{
    display: flex;
    margin-bottom: 3%;
    margin-top: 2%;
    width: 100%;
    font-size: 0.85em;
    justify-content: flex-end;
}

.btn-profil
{
    border: 1px #b1a7a7 solid;
    border-radius: 10px;
    cursor: pointer;
}

.unvisible
{
    display: none;
}

.actions
{
    width: 45%;
    align-self: flex-end;
    position: absolute;
    top: 35px;
    background-color:white;
    box-shadow: 2px 2px 10px 2px rgb(214, 214, 214);
    border-radius: 5px;
    line-height: 1;
    padding: 5px;
    text-align: end;
    font-size: 0.8em;
    cursor: pointer;
}

.action:hover 
{
    background: #e9ecef;
    font-weight: bold;
    cursor: pointer;
}

.actions p 
{
    padding: 5px;
    margin-bottom: 0;
}

.comm_section
{
    display: flex;
    flex-direction: column;
}

.postUpdate_header
{
    display: flex;
    justify-content: space-between;
    margin-right: 10px;
    border-bottom: 1.5px solid black;
}

.input_change
{
    display: flex;
    flex-direction: column;
    padding:10px;
}

.overlay
{
    box-shadow: 2px 2px 10px 2px rgb(180, 176, 176);
    position: fixed;
    top: 50%;
    left: 25%;
    width: 50%;
    z-index: 2;
    background: white;
    border-radius: 10px;
}

.post_update
{
    border: none;
    width: 100%;
    margin-top: 10px;
}

.post-update:focus-visible
{
  border-color: #9ea3aa;
  outline: 0;
  box-shadow: 0 0 0 0.1rem #9ea3aa;
}

.postUpdate_header
{
    margin-left: 5px;
    margin-top: 5px;
    font-weight: bold;
    border-bottom: 2px solid;
}

.postUpdate_header p 
{
    width: 100%;
    margin-bottom: 2px;
}

.btn-modifier
{
    width:20%;
    margin-bottom: 15px;
}

.btn-image
{
    align-self: flex-end;
    margin-top: 5px;
}

.close
{
    border: none;
    background: white;
    cursor: pointer;
}

@media screen and (max-width: 600px) {

  .overlay
  {
      width: 70%;
      left: 16%;
  }

  #bouton_image
  {
    width: 35%;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .btn-image
  {
      width: 35%;
  }

  .form-control-file 
  {
      width: 90%;
  }

}

</style>