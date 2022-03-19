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

document.getElementsByClassName("hint").addEventListener("click", displayDate);

