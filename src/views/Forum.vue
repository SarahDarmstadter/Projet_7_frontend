<template>
    <div id="forum">
        <CreatePost  /> 
        <p  class="titre_page_forum" v-if="publications.length < 0"> Il n'y a pas encore de publication. Soyez le premier à vous exprimer !</p>
        <Posts  v-for="publication in publications" :key="publication.id" v-bind="publication" />
    </div>
</template>

<script>

import CreatePost from '../components/CreatePost.vue'
import Posts from '../components/Posts.vue'
import axios from 'axios'

export default {
    name : "Forum",
    components : {
        CreatePost,
        Posts,
    },
    data(){
        return {
            publications : []
        }
    }, 
    created(){
        const self = this;
            axios.get('http://localhost:3000/api/post/readAll', 
                {headers : { "Authorization" : `Bearer ${this.$store.state.token}`}
            })
                .then(function(response){
                    console.log("RESPONSE AXIOS GET READ ALL", response)
                    self.publications = response.data
                })
                .catch(function(error){
                    console.log(error)
                })
    }, 
    
}
</script>