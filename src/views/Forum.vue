<template>
    <div id="forum">
        <CreatePost @create-post="changePublication" /> 
-        <Posts  v-for="publication in publications" 
            :key="publication.id" 
            v-bind="publication" 
            @delete-post="changePublication"
            @update-post="changePublication"
            @other-change="changePublication"
            />      
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
            publications : [],
        }
    }, 
    created(){
        this.getAllposts()
    }, 
    methods: {
        getAllposts(){
            const self = this;
            axios.get('http://localhost:3000/api/post/readAll', {headers : { "Authorization" : `Bearer ${this.$store.state.token}`}})
                .then(function(response){
                    console.log("RESPONSE AXIOS GET READ ALL", response)
                    self.publications = response.data
                })
                .catch(function(error){
                    console.log(error)
                })
        },
        changePublication(){
            this.getAllposts()
        }   
    } 
}
</script>