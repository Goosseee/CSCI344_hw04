const rootURL = 'https://photo-app-secured.herokuapp.com';
let posts;


/*
----------------------------------
|| SECTION 1: STORY AND PROFILE ||
----------------------------------

- All code for fetching and displaying stories 
- All code for fetching and displaying profile information
*/
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

/*
----------------------
|| SECTION 2: POSTS ||
----------------------

- All code for the posts, comments and modal sections
- All code for likes, comments, bookmarks

*/
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
    document.addEventListener("keydown", shutModal);

    
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

window.shutModal = (ev) =>{
    if(ev.code ==27){
        closeModal();
    }
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
    document.removeEventListener("keydown", shutModal);
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
        <input type="text" id="yourcomment${index}" placeholder="Add a comment...">
        <button id="postbutton" class="open" onclick="postComment(${post.id}, ${index})">Post</button>
    </section>
    </div>
</div>
    `

}

const postComment = async (post_id, index) =>{

    currentId= "yourcomment"+index;

    const postData ={
        "post_id":post_id,
        "text": document.getElementById(currentId).value
    };

    fetch("https://photo-app-secured.herokuapp.com/api/comments", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });

    showPosts(token);
}

const bookmarkStatus = post =>{ 
    const bookmarked = `
    <button class="fa-solid fa-bookmark" id="like" 
    onclick = "deleteBookmark(${post.current_user_bookmark_id})">
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

const createBookmark = async (post_id) => {
    // define the endpoint:
    const endpoint = `https://photo-app-secured.herokuapp.com/api/bookmarks/`;
    const postData = {
        "post_id": post_id // replace with the actual post ID
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
    console.log(data);
    showPosts(token);
}

const deleteBookmark = async (bookmark_id) => {
    // define the endpoint:
    const endpoint = `https://photo-app-secured.herokuapp.com/api/bookmarks/${bookmark_id}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log(data);
    showPosts(token);
}

const createLike = async (post_id) => {
    // define the endpoint:
    const endpoint = `https://photo-app-secured.herokuapp.com/api/posts/likes`;
    const postData = {
        "post_id": post_id // replace with the actual post ID
    };

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify(postData)
    })
    const data = await response.json();
    console.log(data);
    showPosts(token);
}

const deleteLike = async (like_id) => {
    // define the endpoint:
    const endpoint = `https://photo-app-secured.herokuapp.com/api/posts/likes/${like_id}`;

    // Create the bookmark:
    const response = await fetch(endpoint, {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    const data = await response.json();
    console.log(data);
    showPosts(token);
}
/*
----------------------------
|| SECTION 3: SUGGESTIONS ||
----------------------------

- All code for fetching and displaying suggestions
- Code to follow was working but the sites broke, so couldn't do code to unfollow 

*/
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
        
    <button id="followbutton" onclick="follow(${suggestion.id})">follow</button>
</div>
`
}


const follow = async (userID) =>{
    const postData = {
        "user_id": userID
    };
    fetch("https://photo-app-secured.herokuapp.com/api/following/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY3ODc0MDQ2NiwianRpIjoiNzY2ZjZmMDYtMTAxNC00ZTZiLTgwMWYtZjk3ZDc0OWU4OTdhIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNjc4NzQwNDY2LCJjc3JmIjoiNjI2YjMxYTAtMjkwOC00MGU3LWJkODUtNjRjOWJkYmUyNmZhIiwiZXhwIjoxNjc4NzQxMzY2fQ.W0AlnanrzEdRYeZpCYjgR5UWMOD2DNjEUhZTBf-j1iw'
        },
        body: JSON.stringify(postData)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    });
}

const unfollow = async () =>{ 
    
}

/*
---------------------------------
|| SECTION 4: HELPER FUNCTIONS ||
---------------------------------

- Code to initialize the page, set a value for the token and accessibility
*/

const initPage = async () => {
    // first log in (we will build on this after Spring Break):
    token = await getAccessToken(rootURL, 'webdev', 'password');

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


const getAccessToken = async (rootURL, username, password) => {
    const postData = {
        "username": username,
        "password": password
    };
    const endpoint = `${rootURL}/api/token/`;
    const response = await fetch(endpoint, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
    });
    const data = await response.json();
    return data.access_token;
}

initPage();
