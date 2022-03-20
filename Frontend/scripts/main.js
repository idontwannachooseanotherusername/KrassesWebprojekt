window.onload = function() {
    /*invert();*/
};

function invert(){
    var body = Array.from(document.getElementsByTagName('body'));
    var images = Array.from(document.getElementsByTagName('img'));
    var backgrounds = Array.from(document.getElementsByClassName('bg-image'));
    var levels = Array.from(document.getElementsByClassName('challenge-color'));
    var borders = Array.from(document.getElementsByClassName('img-border'));
    body[0].style.backgroundColor = "#fff";
    
    var list = [].concat(images, backgrounds, levels, body)
    for (const e of list){
        e.style.filter = "invert()";
    }
    for (const b of borders){
        b.style.border = "8px solid #dedede";
    }
}

function show_dropdown(){
    var drop = document.getElementById("menu-dropdown");
    if (drop.style.display != "revert"){
        drop.style.display = "revert";
        console.log('Dropdown visible');
    }
    else{
        drop.style.display = "none";
        console.log('Dropdown hidden');
    }
}
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
window.onclick = e => {
    var drop = document.getElementById("menu-dropdown");
    if (!(drop.contains(e.target)) && e.target.getAttribute('id') != "pb"){
        drop.style.display = "none";
        console.log('Dropdown hidden');
    }
}

/*
document.getElementsByClassName("hint").addEventListener("click", displayDate);
*/
