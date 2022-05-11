window.onload = function() {
    create_menu();
};

function create_menu(){
    /*
    var body = document.getElementsByTagName("body")[0];
    var header = document.createElement("header");
    var nav = document.createElement("nav");
    nav.className = "main-menu";
    var wrapper = document.createElement("div");
    wrapper.className = "wrapper";
    var ul = document.createElement("ul");
    var li = document.createElement("li");
    li.className = ""
    */
    // TODO: How to set current page in menu?
}

/* Usermenu dropdown */
function show_dropdown(x=false){
    var drop = document.getElementById("menu-dropdown");
    if (drop.style.display != "revert" && x == false){
        drop.style.display = "revert";
        console.log('Dropdown visible');
    }
    else if (drop.style.display != "none"){
        drop.style.display = "none";
        console.log('Dropdown hidden');
    }
}
window.onclick = e => {
    var drop = document.getElementById("menu-dropdown");
    /* Hide dropdown when clicking elsewhere */
    if (!(drop.contains(e.target)) && e.target.getAttribute('id') != "pb"){
        show_dropdown(true);
    }
}

/* change password pw checker */
function check_password(){
    let new_pw = document.getElementById("new-pw");
    let rep_pw = document.getElementById("rep-pw");
    let errors = document.getElementById("errors");
    
    if (new_pw.value != rep_pw.value){
        errors.innerHTML = "Passwords do not match"
        return false;
    }
    else{
        errors.innerHTML = ""
        return true
    }
}

/* Challenge rating slider */
function starupdate(slider){
    var stars = document.getElementById("solved-stars")
    stars.innerHTML = "Rating ".concat("⭐".repeat(slider.value))
}

function logout(){
    document.cookie="token=deleted;expires=Sun, 01 Jan 1970 01:00:00 UTC";
    window.location.replace("index.html");
}

// Onload functions
window.addEventListener("load", function(){
    login_check();
});
    