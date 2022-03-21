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

function get_hint(level){
    var selector = "hint-".concat(level).concat(" hint-text");
    var hint = document.getElementsByClassName("hint-".concat(level))[0];
    var text = hint.querySelector('.hint-text');
    if (text != undefined){
        /*Hint already visible*/
        if (text.style.filter == "revert"){
            return
        }
        /*First click*/
        else if (text.classList.contains("confirm") == false){
            let warning = document.createElement("p");
            warning.innerHTML = "Are you sure? Click again.";
            warning.style.color = "orange";
            hint.appendChild(warning);
            text.classList.add("confirm");
            warning.classList.add("warning");
        }
        /*Second click*/
        else{
            text.style.filter = "revert";
            let warning = hint.querySelector(".warning")
            if (warning != undefined){
                warning.remove();
                hint.classList.remove("confirm")
                
                /*Get hint from server here*/
                text.innerHTML = "Hint from server."
            }
        }
    }
}
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
        show_dropdown(true);
    }
}

/*
document.getElementsByClassName("hint").addEventListener("click", displayDate);
*/
