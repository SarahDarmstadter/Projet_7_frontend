<template>
    <div id="comments">
        <div  class="d-flex flex-row p-2"> 
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
            isAdmin : false,
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
            console.log("idCom", idCom)
            actions.classList.toggle("unvisible")
        },
         showUp : function(){
            const showUp = document.getElementById("show")
            showUp.classList.toggle("unvisible")
        },
        selectFile(event) {
            this.newImageCom = event.target.files[0];  
        },
        deleteComment : function(param){
            const self= this;
            axios.delete(`http://localhost:3000/api/comment/${param}/delete`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log(response)
                   self.$emit("delete-com", true)
                   self.showAction()
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