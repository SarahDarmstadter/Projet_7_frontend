<template>
    <div id="comments">
        <div  class="d-flex flex-row p-2"> 
            <img :src="user.imageUser" width="30px" class="img-thumbnail rounded-image">
            <div class="contenu_comm">
                <div class="d-flex flex-column ml-2 commentaire_texte"> 
                    <div class="action">
                        <p  class="name">{{ user.userName}}</p>
                        <div @click="showAction()" class="dots">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-three-dots" viewBox="0 0 16 16">
                                <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"/>
                            </svg>
                        </div>
                    </div>
                    <p  class="comment-text">{{ content }}</p>
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
        }
    },
    computed : {
        ...mapState(["token", "userId"])
    },
    methods: {
        identifiantComment : function(param){
            return this.commentId = param
        },
        showAction : function(){
            let test = this.commentId + '_actions'
            let actions = document.getElementById(test)
            actions.classList.toggle("unvisible")
        },
        deleteComment : function(param){
            axios.delete(`http://localhost:3000/api/comment/${param}/delete`, {headers:{ "Authorization" : `Bearer ${this.$store.state.token}`}})
               .then(function(response){
                   console.log(response)
                })
                .catch(function(error){
                    console.log(error)
                })
        }, 
        updateComment : function(){

        }
    }
    
}
</script>

<style scoped>

.contenu_comm{
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

</style>