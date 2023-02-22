import {getAccessToken} from './utilities.js';
const rootURL = 'https://photo-app-secured.herokuapp.com';

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
    checkIcons(data);
}

const postsToHtml = post =>{
    return`  
    <div class="post">
        <section class="header">
        <h1>${post.user.username}</h1>
        <i class="fa-solid fa-ellipsis"></i> 
        </section>

        <img src="${post.image_url}">

    <section class = intbar>
        <div class="icons">
            <i class="fa-regular fa-heart" id="heart"></i>
            <i class="fa-regular fa-comment"></i>
            <i class="fa-regular fa-paper-plane"></i> 
        </div>           
            <i class="fa-regular fa-bookmark" id="bookmark"></i>
    </section>

    <section class="description">
        <strong>${post.likes.length} likes</strong>
        <p><strong>${post.user.username}</strong>
            here is a caption about the photo...something something something more more more something somethin...<a>more</a></p>
            <p id="timestamp">${post.display_time}</p>
    </section>

    <section class="comment">
        <button>View all ${post.comments.length} comments</button>
        <p><strong>username</strong></p>
    </section>

    <section class="mycomment">
        <i class="fa-regular fa-face-smile"></i>
        <p>add comment...</p>
        <a>Post</a>
    </section>
    </div>
</div>
    `
}

function checkIcons(data){

    if (data.current_user_bookmark_id !="undefined"){
    document.getElementById("bookmark").style.color="purple";
    }
    
    if (data.curent_user_like_id !="undefined"){
        document.getElementById("heart").style.color ="red";
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
        
    <a>follow</a>
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
initPage();
