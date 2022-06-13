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
    if (drop && !(drop.contains(e.target)) && e.target.getAttribute('id') != "pb"){
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

function cancel_challenge_edit(){
    window.location.replace("challenges.html");
}
