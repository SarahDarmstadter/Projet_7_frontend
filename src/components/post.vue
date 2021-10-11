<template>
    <div id ="post">
        
        <div class="post_card publier">
            <div class="profil-titre">
                <img src="../assets/img/icon-above-font.png" alt="photo de profil de l'auteur" class=" auteur img-thumbnail img-fluid rounded-circle" style ="width : 5%">
                <input type="text" id="titre" placeholder="Titre de votre message">
            </div>

            <div class="message_image">
                <input type="text" id="message" placeholder="Votre message ...">
                <button @click="AjouterUneImage" class="camera">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-fill" viewBox="0 0 16 16">
                        <path d="M10.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path d="M2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2zm.5 2a.5.5 0 1 1 0-1 .5.5 0 0 1 0 1zm9 2.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0z"/>
                    </svg>
                </button>
                <div class="unvisible show-upload" id="show-upload">
                    <input @change="selectFile" type="file" ref="camera" class="form-control-file" id="file" accept=".jpg, .jpeg, .gif, .png">
                    <button id="boutonImage" class="btn-profil" @click="uploadImage()"> upload image </button>
                </div>            
            </div>
            <button>Publier</button>

        </div>
    </div>
</template>

<style scoped>

* :before :after {
    box-sizing: border-box;
}

    #post
    {
        margin-top: 100px;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .post_card
    .show-upload
    input 
    #post
    {
        border: solid 2px black;
        margin-bottom: 10px;
    }

    .post_card
    {
        width: 50%;
        border: solid 2px black;
    }

.profil-titre
{
    width: 100%;
    display: flex;
    margin: 5px;
    height: 25px;
    border: solid 2px purple;
}




</style>