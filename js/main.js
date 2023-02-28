import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';
let posts;

const showStories = async (token) => {
    const endpoint = `${rootURL}/api/stories`;
    const response = await fetch(endpoint, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log('Stories:', data);

    const storyHtml = data.map(storiesToHtml).join("");
    document.querySelector('.stories').innerHTML = storyHtml;
}

const storiesToHtml = story =>{ 
    return `
    <div class = "story">
    <img src="${story.user.thumb_url}" id="jen">
    <p>${story.user.username}</p>
</div>`;
}

const getProfile = async (token) => {
    const endpoint = `${rootURL}/api/profile`;
    const response = await fetch(endpoint, {
        headers:{ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json(); 
    console.log("User Profile:", data);

    const user = data;
    profileToHtml(user);
}

function profileToHtml(user){ 
    document.querySelector("#profile").innerHTML = `        
    <h1>Photo App</h1>

    <section id="login">
    <p>${user.username}</p>
    <a>Sign out</a>
</section>`

    document.querySelector(".user").innerHTML =`
    <img src="${user.thumb_url}">
    <h2>${user.username}</h2>`
    document.query
}

const showPosts = async (token) => {
    const endpoint = `${rootURL}/api/posts?limit=10`;
    const response = await fetch(endpoint, {
        headers:{ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json(); 
    console.log("Posts:", data);

    const postHtml = data.map(postsToHtml).join('');
    document.querySelector("#posts").innerHTML = postHtml;

    // const modalHtml = commentsInModal(data);
    // document.querySelector(".modal").innerHTML = modalHtml;

    posts = data;
}

const modalElement = document.querySelector('.modal-bg');

//For all event handlers attached to dynamic html, you'll need to do this 
//instead of const, use window.(function)
window.showModal = (index) => {
    const post = posts[index];
    console.log(post);
    openModal(post);
}

const openModal = post => {

    // shows the modal:
    modalElement.classList.remove('hidden');

    // accessibility:
    modalElement.setAttribute('aria-hidden', 'false');

    // puts the focus on the "close" button:
    document.querySelector('.close').focus();


    document.querySelector(".reccomendations").style.display = "none";
    document.querySelector("body").style.overflow ="hidden";

    const modalHtml = commentsInModal(post);
    document.querySelector(".modal").innerHTML= modalHtml;

    
}

const commentsInModal = post =>{
   const hasComments = post.comments.length > 0;
   const commentList= post.comments;
    const commentListHtml = commentList.map(listOfComments).join('');


    if (hasComments){
        return ` 
        <img src ="${post.image_url}" alt="Image post by:${post.user.username}"/>
            <div class ="modal-body">
                <section class="modal-header" tabindex="0">
                    <img src="${post.user.thumb_url} alt="${post.user.username}'s profile picture"/>
                    <h1> ${post.user.username}</h1>
                </section>

                <section class="post-caption" tabindex="0">
                    <p ><strong>${post.user.username} </strong>${post.caption}</p>
                </section>
            ${commentListHtml}
             </div>`
    }else {
        return ''
    }
}

const listOfComments = comments =>{ 
    return  `
    <section class="comment" tabindex="0">
    <p ><strong>${comments.user.username} </strong>${comments.text}</p>
    <p class="display_time" >${comments.display_time}</p>
    </section>
`
}

window.shutModal = () =>{
    closeModal();
}
const closeModal = () => {
    // hides the modal:
    modalElement.classList.add('hidden');

    // accessibility:
    modalElement.setAttribute('aria-hidden', 'false');

    // puts the focus on the "open" button:
    document.querySelector('.open').focus();


    document.querySelector(".reccomendations").style.display = "flex";
    document.querySelector("body").style.overflow ="scroll";
};

const showCommentAndButton = (post, index) =>{
    const hasComments = post.comments.length>0;
    const lastComment = post.comments.length -1;

 if (hasComments){
    return`
    <section class="comment">
        <button onclick="showModal(${index})" class="open">View all ${post.comments.length} comments</button>
        <p tabindex="0"><strong>username </strong>${post.comments[lastComment].text}</p>
    </section>
    `
}else{
    return''
}
}

const postsToHtml = (post, index) =>{

    return`  
    <div class="post" id="${post.id}">
        <section class="header" tabindex="0">
        <h1>${post.user.username}</h1>
        <i class="fa-solid fa-ellipsis"></i> 
        </section>

        <img src="${post.image_url}">

    <section class = intbar>
        <div class="icons">
            ${likeStatus(post)}
            <i class="fa-regular fa-comment"></i>
            <i class="fa-regular fa-paper-plane"></i> 
        </div>           
            ${bookmarkStatus(post)}
    </section>

    <section class="description" tabindex="0">
        <strong>${post.likes.length} likes</strong>
        <p><strong>${post.user.username}</strong>
           ${post.caption}</p>
            <p id="timestamp">${post.display_time}</p>
    </section>
       ${showCommentAndButton(post, index)}

    <section class="mycomment" tabindex="0">
        <i class="fa-regular fa-face-smile"></i>
        <p>add comment...</p>
        <button id="postbutton" class="open">Post</button>
    </section>
    </div>
</div>
    `
}
const bookmarkStatus = post =>{ 
    const bookmarked = `
    <button class="fa-solid fa-bookmark" id="like" 
    onclick = "deleteBm(${post.current_user_bookmark_id})">
    </button>` 

    const unmarked =`
    <button class="fa-regular fa-bookmark" id="like" 
    onclick = "createBookmark(${post.id})">
    </button>`

    if(post.current_user_bookmark_id != undefined){
        return bookmarked
    }else{ 
        return unmarked
    }
}

const likeStatus = post =>{ 
    const liked = `
    <button class="fa-solid fa-heart" id="bookmark" 
    onclick = "deleteLike(${post.current_user_like_id})">
    </button>` 

    const unliked =`
    <button class="fa-regular fa-heart" id="bookmark"
    onclick = "createLike(${post.id})">
    </button>`

    if(post.current_user_like_id != undefined){
        return liked
    }else{ 
        return unliked
    }
}

const getSuggestions = async (token) =>{
    const endpoint = `${rootURL}/api/suggestions`;
    const response = await fetch(endpoint, {
        headers:{ 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })

    const data = await response.json(); 
    console.log("Suggestions:", data);

    const suggestions = data.map(suggestionsToHtml).join('');
    document.querySelector(".suggestions").insertAdjacentHTML('beforeend', suggestions);

}

const suggestionsToHtml = suggestion =>{
    return `
    <div class="suggestion" >
    <img src="${suggestion.thumb_url}">
        
    <section class="text">
    <strong>${suggestion.username}</strong>
    <p>suggested for you</p>
    </section>
        
    <button id="followbutton">follow</button>
</div>
`
}

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    const token = await getAccessToken(rootURL, 'webdev', 'password');

    // then use the access token provided to access data on the user's behalf
    getProfile(token);
    showStories(token);
    showPosts(token);
    getSuggestions(token);

}

document.addEventListener('focus', function(event) {
    console.log('focus');
    if (modalElement.getAttribute('aria-hidden') === 'false' && !modalElement.contains(event.target)) {
        console.log('back to top!');
        event.stopPropagation();
        document.querySelector('.close').focus();
    }
}, true);
initPage();
