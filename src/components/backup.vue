 


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
                                <div class="unvisible" :id="identifiantPost(id)+'_tous_les_coms'">
                                    <div class="comments" :id="identifiantPost(id)+'_comment-composant'" >
                                        <commentaires v-for="postComment in postComments" 
                                        :key="postComment.id" 
                                        v-bind="postComment" 
                                        @change-com="changeCom"
                                        />
                                    </div> 
                                    <div class="createC" style="border: solid 1">
                                        <div class="_create_com " :id="identifiantPost(id)+'_create_com'">
                                        <input v-model="commentaireContent"  v-on:keyup.enter="createCom(id)" type="text" class="form-control" placeholder="Ecrivez votre commentaire..." />
                                        <div class="uploads" @click="showUpload()"><i class="fa fa-camera fonts"></i></div>
                                        <div class="unvisible show-upload" :id="identifiantPost(id)+'_showUpload'">
                                            <input @change="selectedFile" type="file" class="form-control-file" id="file" accept=".jpg, .jpeg, .gif, .png">
                                            <button id="bouton_picture" class="btn-profil" @click="createCom(id)"> Publier </button>
                                        </div>    
                                    </div> 
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



export default {
    name: "Post", 
    components : {
         Commentaires,
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
        readPostComments : function(param){
            const self = this;
                axios.get(`http://localhost:3000/api/comment/read/${param}`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log("ReadpostCOMMENT", response)
                   self.postComments = response.data 
                })
               .catch(function(error){
                   console.log(error)
               })   
        },
        createCom : function(param){
            const self= this;
            if(this.commentaireImg && this.commentaireContent =="") {
                const commentMessage = {
                    content: this.commentaireContent,
                    userId : this.$store.state.userId,
                    postId : param
                }
                const fd = new FormData()
                fd.append("image", this.commentaireImg, this.commentaireImg.name)
                fd.append("commentMessage", JSON.stringify(commentMessage))
            
                axios.post(`http://localhost:3000/api/comment/${param}/create`, 
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
                    self.$emit("create-commentaire", true)
                    console.log("create-comm")

                })
                .catch(function(error){
                    console.log(error)
                })
            }else if (this.commentaireContent !==""){
                const commentMessage = {
                    content : this.commentaireContent,
                    userId : this.$store.state.userId,
                    postId : param
                }
                axios.post(`http://localhost:3000/api/comment/${param}/create`, 
                    commentMessage, 
                    {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}
                })
                    .then(function(response){
                        console.log(response)
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(){
                    self.$emit("create-commentaire", true)
                    console.log("create-comm")
                })
                .catch(function(error){
                    console.log(error)
                })
            } else if(this.commentaireImg && this.commentaireContent !==""){
                const commentMessage = {
                    content: this.commentaireContent,
                    userId : this.$store.state.userId,
                    postId : param
                }
                const fd = new FormData()
                fd.append("image", this.commentaireImg, this.commentaireImg.name)
                fd.append("commentMessage", JSON.stringify(commentMessage))
            
                axios.post(`http://localhost:3000/api/comment/${param}/create`, 
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
                    self.$emit("create-commentaire", true)
                    console.log("create-comm")

                })
                .catch(function(error){
                    console.log(error)
                })
            } 
        }, 
        changeCom(param){
                this.$emit("other-change", param)
                this.displayComs()    

        },
        modifierComment(param){
            console.log("MODIFIER COMM")
            const self = this;
                axios.get(`http://localhost:3000/api/comment/read/${param}`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log("ReadpostCOMMENT", response)
                   self.postComments = response.data 
                })
               .catch(function(error){
                   console.log(error)
               })
            
        },
        selectedFile(event) {
            this.commentaireImg = event.target.files[0];  
        },
        showUpload : function(){
            let testing = this.postId +'_showUpload'
            const show = document.getElementById(testing)
            console.log(show)
            show.classList.toggle("unvisible")
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

@media screen and (max-width: 500px) {

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




<div class="createC"  style="border: solid 1">
                                        <create-commentaire 
                                        :id="identifiantPost(id)"
                                        @create-comm="readPostComments"/>
                                    </div>  




                                    <div class="comments" :id="identifiantPost(id)+'_comment-composant'" >
                                        <commentaires v-for="postComment in postComments" 
                                        :key="postComment.id" 
                                        v-bind="postComment" 
                                        @delete-com="readPostComments"
                                        />
                                    </div> 

<template>
    <div id="comments">
        <div v-for="comment in comments" :key="comment.id" class="d-flex flex-row p-2"> 
            <img :src="user.imageUser" width="30px" class="img-thumbnail rounded-image">
            <div class="contenu_comm">
                <div class="d-flex flex-column ml-2 commentaire_texte"> 
                    <div class="action">
                        <p @click="goProfil(user.id)" class="name">{{ user.userName}}</p>
                        <div  v-if="user.id == userId || isAdmin == true" @click="showAction()" class="dots">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                            </svg>
                        </div>
                    </div>
                    <p class="comment-text"  :id="identifiantComment(id)+ '_content'">{{ content }}</p>
                    <div class="input_change unvisible" :id="identifiantComment(id)+ '_input-change'">
                        <div class="flex-col">
                            <textarea v-on:keyup.enter="updatePayloadCom(id)" v-model="newComContent" class="com_update form-control"></textarea>
                            <div class="d-flex annulation">
                                <p class="annuler" @click="cancelUpdate()">Annuler</p>
                                <button @click="showUp()" class="btn-profil btn-image btn-modifier" >Image</button>
                            </div>
                        </div>
                        <div class="unvisible show-up" id="show">
                            <input @change="selectFile" type="file" class="form-control-file" id="file" accept=".jpg, .jpeg, .gif, .png">
                            <button id="bouton_file" class="btn-profil btn-modifier btn-publier btn-danger" @click="updatePayloadCom(id)">Modifier</button>
                        </div>
                    </div>
                </div>
                <img v-if="image" :src="image"  class="img-fluid commentaire_texte">
                <div :id="identifiantComment(id)+'_actions'" class="actions unvisible">
                    <p @click="updateComment(id)" class="bouton_action">Modifier</p>
                    <p @click="deleteComment(id)" class="bouton_action">Supprimer</p>
                </div>
                
            </div>
        </div>  
    </div>
</template>

<script>
import axios from 'axios'
import { mapState} from 'vuex'

export default {
    name: "Commentaires",
    
    props: {
        id: {
            type: Number
        },
        content : {
            type : String
        },
        postId : {
            type : Number
        }, 
        user : {
            type: Object
        }, 
        image : {
            type: String
        }
    },
    data() {
        return {
            comments:[],
            commentId:"",
            newImageCom : null,
            newComContent : this.content, 
            identifiant : this.$store.state.identifiant, 
            isAdmin : false
        }
    },
    computed : {
        ...mapState(["token", "userId"])
    },
    methods: {
        goProfil : function(param){
            this.$store.dispatch("identifiant", param)
            this.$router.push({path : `/profil/${this.$store.state.identifiant}`})
        },
        identifiantComment : function(param){
            return this.commentId = param
        },
        showAction : function(){
            const idCom = this.commentId + '_actions'
            const actions = document.getElementById(idCom)
            actions.classList.toggle("unvisible")
        },
         showUp : function(){
            const showUp = document.getElementById("show")
            showUp.classList.toggle("unvisible")
        },
        selectFile(event) {
            this.newImageCom = event.target.files[0];  
        },
        getComments : function(param){
            const self = this;
                axios.get(`http://localhost:3000/api/comment/read/${param}`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log("ReadpostCOMMENT", response)
                   self.comments = response.data 
                })
               .catch(function(error){
                   console.log(error)
               }) 
        },
        deleteComment : function(param){
            const self= this;
            axios.delete(`http://localhost:3000/api/comment/${param}/delete`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log(response)
                })
                .catch(function(error){
                    console.log(error)
                })
            .then(function(){
                self.$emit("delete-com", param)
            })
            .catch(function(error){
                console.log(error)
            })
        }, 
        updateComment : function(){
            const idContent = this.commentId + '_content'
            const contentP = document.getElementById(idContent)
            contentP.classList.add("unvisible")

            const idInputChange = this.commentId +'_input-change'
            const inputChange = document.getElementById(idInputChange)
            inputChange.classList.toggle("unvisible")

            const idActions = this.commentId+ '_actions'
            const actions = document.getElementById(idActions)
            actions.classList.toggle("unvisible")
        },
        updatePayloadCom : function(param){
            const self= this;
             if(this.newComContent !=="" && this.newImageCom !== null) {
                const newData = {
                    content : this.newComContent,
                    id : param
                }
                const fd = new FormData()
                fd.append("image", this.newImageCom, this.newImageCom.name)
                fd.append("ComMessage", JSON.stringify(newData))
            
                axios.put(`http://localhost:3000/api/comment/${param}/update`, 
                fd, {headers:
                        { 
                        "Authorization" : `Bearer ${this.$store.state.token}`,
                        "Content-Type": "multipart/form-data"
                        }
                    })
                    .then(function(response){
                        console.log("AXIOS PUT COM",response)
                        const idContent = self.commentId + '_content'
                        const contentP = document.getElementById(idContent)
                        contentP.classList.remove("unvisible")

                        const idInputChange = self.commentId +'_input-change'
                        const inputChange = document.getElementById(idInputChange)
                        inputChange.classList.toggle("unvisible")
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(param){
                    self.$emit("change-com", param)
                })
                .catch(function(error){
                    console.log(error)
                })
                
            }else if (this.newComcontent !=="" && this.newImageCom == null ){
                const comMessage = {
                    content : this.newComContent,
                    id : param
                }
                axios.put(`http://localhost:3000/api/comment/${param}/update`, 
                    comMessage, 
                    {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}
                })
                    .then(function(response){
                        console.log("AXIOS PUT COM", response)
                        const idContent = self.commentId + '_content'
                        const contentP = document.getElementById(idContent)
                        contentP.classList.remove("unvisible")

                        const idInputChange = self.commentId +'_input-change'
                        const inputChange = document.getElementById(idInputChange)
                        inputChange.classList.toggle("unvisible")
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(param){
                    self.$emit("change-com", param)
                })
                .catch(function(error){
                    console.log(error)
                })
            } else if (this.newImageCom !== null && this.newComContent == "") {
                const fd = new FormData()
                fd.append("image", this.newImageCom, this.newImageCom.name)
                
                axios.put(`http://localhost:3000/api/comment/${param}/update`, 
                   fd, 
                    {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}
                })
                    .then(function(response){
                        console.log("AXIOS PUT COM",response)
                        const idContent = self.commentId + '_content'
                        const contentP = document.getElementById(idContent)
                        contentP.classList.remove("unvisible")

                        const idInputChange = self.commentId +'_input-change'
                        const inputChange = document.getElementById(idInputChange)
                        inputChange.classList.toggle("unvisible")
                    })
                    .catch(function(error){
                        console.log(error)
                    }) 
                .then(function(param){
                    self.$emit("change-com", param)
                })
                .catch(function(error){
                    console.log(error)
                })
                
            }
        },
        cancelUpdate : function(){

            const idContent = this.commentId + '_content'
            const contentP = document.getElementById(idContent)
            contentP.classList.remove("unvisible")

            const idInputChange = this.commentId +'_input-change'
            const inputChange = document.getElementById(idInputChange)
            inputChange.classList.toggle("unvisible")
        }


                
            
        
    }
    
}
</script>

<style scoped>

.contenu_comm
{
    display: flex;
    flex-direction: column;
    width: 100%;
}

.action
{
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-right: 10px;
}

.form-control:focus 
{
    color: #f0f2f5;
    background-color: #fff;
    border-color: #8bbafe;
    outline: 0;
    box-shadow: none
}

.form-control 
{
    border-radius: 26px
}

.comment-input 
{
    position: relative
}

.rounded-image 
{
    border-radius: 50% !important;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 50px;
    width: 50px
}

.name 
{
    font-weight: bold;
    margin-bottom: 4px;
    margin-top: 6px;
    font-size: 0.85em
}

.commentaire_texte 
{
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-end;
    word-wrap: break-word;
    text-align : start;
    margin-left: 4px;
    padding-left: 4px;
    padding-top: 5px;
    background: #f0f2f5;
    border-radius: 10px;
    font-size: 0.8em;
    line-height: 0.9;
    width: 100%;
}

.actions
{
    width: 45%;
    align-self: flex-end;
    background-color:white;
    box-shadow: 2px 2px 10px 2px rgb(214, 214, 214);
    border-radius: 5px;
    line-height: 1;
    padding: 5px;
    text-align: end;
    font-size: 0.8em;
    cursor: pointer;
    position: absolute;
    margin-top: 23px;
    z-index: 3;
}

.bouton_action:hover 
{
    background: #e9ecef;
    font-weight: bold;
    cursor: pointer;
}

.bouton_action
{
    padding: 5px;
    margin-bottom: 0;
}

.unvisible
{
    display: none
}

.input_change
{
    width: 100%;
}

.flex-col
{
    display: flex;
    flex-direction: column;
}

.com_update
{
    margin-bottom: 4px;
    border: none;
    border-radius : 20px;
    padding: 5px;
}

.btn-image
  {
    padding: 4px;
    margin-bottom: 5px;
    margin-top: 5px;
    align-self: flex-end;
    cursor: pointer;
    border-radius: 10px;
    border: 1px #b1a7a7 solid;
    background: white
}

.btn-image:hover 
{
    font-weight: bold;
}

.annulation
{
    justify-content:  space-between;
    align-items: center;
    align-content: center;
}

.annuler 
{
    margin-bottom: 5px;
    margin-left: 4px;
}

.annuler:hover 
{
    font-weight: bold;
}

</style>