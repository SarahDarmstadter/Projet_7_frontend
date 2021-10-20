<template>
    <div id="create_commentaire" class="create_commentaire">
        <div class="comment-input"> 
            <p> postid {{ id }}</p>
            <input v-model="commentaireContent"  v-on:keyup.enter="createComment()" type="text" class="form-control" placeholder="Ecrivez votre commentaire..." />
            <div @click="show()" class="fonts"> <i class="fa fa-camera"></i> </div>
            <div class="unvisible show-upload" id="showUpload">
                <input @change="selectedFile" type="file" class="form-control-file" id="file" accept=".jpg, .jpeg, .gif, .png">
                <button id="boutonImage" class="btn-profil" @click="uploadImage()"> Upload image </button>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios'

export default {
    name : 'createCommentaire',
   props : {
      posts : {
           type:Number
       }
   },
    data(){
        return {
            commentaireContent :"",
            commentaireImg : "",
            image : null, 
        }
    },
    methods: {
        show : function(){
            const show = document.getElementById("showUpload")
            show.classList.toggle("unvisible")
        },
        selectedFile(event) {
            this.image = event.target.files[0];  
        },
        createComment : function(){
            if(this.image && this.commentaireContent !=="") {
                const commentMessage = {
                    content : this.commentaireContent,
                    userId : this.$store.state.userId
                }
                const fd = new FormData()
                fd.append("image", this.image, this.image.name)
                fd.append("commentMessage", JSON.stringify(commentMessage))
            
                axios.post(`http://localhost:3000/api/comment/create`, 
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
            }else if (this.commentaireContent !==""){
                const commentMessage = {
                    content : this.commentaireContent,
                    userId : this.$store.state.userId
                }
                axios.post(`http://localhost:3000/api/comment/create`, 
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