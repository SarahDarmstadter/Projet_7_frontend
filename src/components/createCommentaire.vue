<template>
    <div id="create-commentaire" class="create_commentaire">
       <div class="_create_com " :id="identifiantPost(id)+'_create_com'">
            <input v-model="commentaireContent"  v-on:keyup.enter="createCom(id)" type="text" class="form-control" placeholder="Ecrivez votre commentaire..." />
            <div class="uploads" @click="showUpload()"><i class="fa fa-camera fonts"></i></div>
            <div class="unvisible show-upload" :id="identifiantPost(id)+'_showUpload'">
                <input @change="selectedFile" type="file" class="form-control-file" id="file" accept=".jpg, .jpeg, .gif, .png">
                <button id="bouton_picture" class="btn-profil" @click="createCom(id)"> Publier </button>
            </div>
            </div>    
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name : 'createCommentaire',
    props : {

       id : {
            type : Number
        }
   },
    data(){
        return {
            commentaireContent :"",
            commentaireImg : "",
            image : null, 
            postId :"",
        }
    },
    methods: {
        identifiantPost : function(param){
            return this.postId = param
        },
        showUpload : function(){
            let testing = this.postId +'_showUpload'
            const show = document.getElementById(testing)
            console.log(show)
            show.classList.toggle("unvisible")
        },     
        selectedFile(event) {
            this.image = event.target.files[0];  
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
                        self.commentaireContent = ""
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(){
                    console.log("EMIT")
                    self.$emit("create-comm", param)
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
                        self.commentaireContent = ""
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(){
                    console.log("EMIT")
                    self.$emit("create-comm", param)
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
                        self.commentaireContent = ""
                    })
                    .catch(function(error){
                        console.log(error)
                    })
                .then(function(){
                    console.log("EMIT")
                    self.$emit("create-comm", param)
                })
                .catch(function(error){
                    console.log(error)
                })   
            }
        }
            
    }
}
</script>

<style scoped>
    
.form-control 
{
    border-radius: 26px;
    background-color: #f0f2f5;
    border: none
}

.comment-input {
    position: relative;
}

.fonts {
    position: absolute;
    right: 5px;
    top: 7px;
    color: #313131;
    border-radius: 34px;
    width: 27px;
}

.fonts:hover  
{
    background-color: rgb(207, 205, 205);
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
    padding: 5px;
    cursor: pointer;
}

    .unvisible {
        display: none
    }

</style>