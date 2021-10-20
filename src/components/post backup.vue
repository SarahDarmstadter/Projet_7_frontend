<template>
    <div id="posts">
        <p  class="titre_page_forum" v-if="posts.length < 0"> Il n'y a pas encore de publication. Soyez le premier à vous exprimer !</p>
        <p class="titre_page_forum" v-else> Les publications à la une </p>
            <div class="container mt-5 mb-5">
                <div class="row d-flex align-items-center justify-content-center">
                    <div class="col-md-6">
                        <div class="card">
                            <div class="d-flex justify-content-between p-2 px-3">
                                <div class="auteur">
                                    <img :src="post.user.imageUser" alt="photo de profil de l'auteur" class="auteur--img img-thumbnail img-fluid rounded-circle" style ="width: 50px">
                                    <div class="aside">
                                       <p @click="goProfil(post.userId)" class="auteur--userName">{{ post.user.userName }} </p>
                                        <p class="date">Publié le {{ post.createdAt.slice(0,10).split('-').reverse().join('.') + ' à ' + post.createdAt.slice(11,16)}} </p>
                                    </div>
                                </div>
                                <div @click="showActions()" class="dots">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                        <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                                    </svg>
                                </div>
                            </div> 
                            <div id="actions" class="actions unvisible">
                                    <p class="modifier action">Modifier ma publication</p>
                                    <p @click="deletePost(post.id)" class="supprimer action">Supprimer ma publication</p>
                            </div>
                            <div class="p-2">
                                <p class="content"> {{ postContent }}</p>
                                <img :src="post.image" class="img-fluid">
                                <hr>
                                <div class="d-flex justify-content-between align-items-center">
                                    <div class="d-flex flex-row icons d-flex align-items-center"> <i class="fa fa-heart"></i> <i class="fa fa-smile-o ml-2"></i> </div>
                                    <div class="d-flex flex-row muted-color">
                                       <p @click="readPostComments(post.id)" v-if ="post.comments.length >1" class="commentaires" id="commentaires"> {{ post.comments.length }} Commentaires </p>
                                        <p @click="readPostComments(post.id)" v-else class="commentaires" id="commentaires"> Commenter </p>
                                    </div>
                                </div>
                                <div class="comments " id="comments" >
                                    <div v-for="comment in comments" :key="comment.id">
                                        <div v-if="post.id === comment.postId" class="d-flex flex-row mb-2 p-2"> 
                                        <img :src="comment.user.imageUser" width="30px" class="img-thumbnail rounded-image">
                                        <div class="d-flex flex-column ml-2 commentaire_texte"> 
                                            <p id="name" class="name">{{ comment.user.userName}}</p>
                                            <p id="comment-text" class="comment-text">{{comment.content}}</p>
                                            <img :src="comment.image" class="comment-img">
                                        </div>
                                        </div>
                                    </div>
                                </div>
                                    <div class="comment-input"> <input type="text" class="form-control"></div>  
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
//import Comments from './Comments.vue'

export default {
    name: "Post", 
    components : {

    },
    data(){
        return {
            posts : [], 
            comments : [], 
        
        }
    },
    created(){
        const self = this;
        axios.get('http://localhost:3000/api/post/readAll', 
            {headers : { "Authorization" : `Bearer ${this.$store.state.token}`}
        })
            .then(function(response){
                console.log("RESPONSE AXIOS GET READ ALL", response)
                self.posts = response.data
                console.log("self.posts", self.posts)
                self.postContent = self.posts.content
                self.postComments = self.posts.comments
                console.log("self.postContent", self.postContent)
                console.log("self.postComments",self.postComments)
            })
            .catch(function(error){
                console.log(error)
            })
    },
    computed: {
        ...mapState(["token", "userId", "identifiant"]),
    },
    methods: {
        goProfil : function(param){
            this.$store.dispatch("identifiant", param)
            this.$router.push({path : `/profil/${this.$store.state.identifiant}`})
        }, 
        readPostComments : function(param){
             const self= this;
                axios.get(`http://localhost:3000/api/comment/read/${param}`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log("ReadpostCOMMENT", response)
                   self.comments= response.data 
                })
               .catch(function(error){
                   console.log(error)
               })        
        },
        showActions : function(){
              const actions = document.getElementById("actions")
              actions.classList.toggle("unvisible")
        },
        deletePost : function(param) {
            axios.delete(`http://localhost:3000/api/post/${param}/delete`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log(response)
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
.commentaire_texte
{
    font-size: 0.8em;
    width: 100%;
    text-align: start;
    line-height: 0.3;
    padding: 10px 5px 5px 5px;
    background-color: #ebe9ec;
    border-radius: 5px;
    margin-left: 10px;
}

.commentaires
{
    cursor: pointer;
}

.comment-text {
    font-size: 12px
}

.status small {
    margin-right: 10px;
}

.form-control {
    border-radius: 26px
}

.comment-input {
    position: relative
}

.fonts {
    position: absolute;
    right: 13px;
    top: 8px;
    color: #a09c9c
}

.form-control:focus {
    background-color: #fff;
    outline: 0;
    box-shadow: none
}

.unvisible{
    display:none;
}

.actions
{
    width: 40%;
    align-self: flex-end;
    position: absolute;
    top: 35px;
    background-color:white;
    box-shadow: 2px 2px 10px 2px rgb(214, 214, 214);
    border-radius: 5px;
    line-height: 1;
    padding-top: 10px;
    padding-right: 5px;
    text-align: end;
    font-size: 0.8em;
    cursor: pointer;
}

.action:hover 
{
    text-decoration: underline;
    font-weight: bold;
    cursor: pointer;
}

</style>



createComment : function(){
            if(this.image && this.commentaireContent !=="") {
                const commentMessage = {
                    content : this.content,
                    userId : this.$store.state.userId
                }
                const fd = new FormData()
                fd.append("image", this.image, this.image.name)
                fd.append("commentMessage", JSON.stringify(commentMessage))
            
                axios.post(`http://localhost:3000/api/comment/post/${postId}/create`, 
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
                    })
                    .catch(function(error){
                        console.log(error)
                    })
            }else if (this.message !==""){
                const commentMessage = {
                    content : this.content,
                    userId : this.$store.state.userId
                }
                axios.post(`http://localhost:3000/api/comment/post/${postId}/create`, 
                    commentMessage, 
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
            } else {
                throw "Veuillez remplir les champs"
            } 
        },