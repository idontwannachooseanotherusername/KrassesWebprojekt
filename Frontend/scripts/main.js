function show_dropdown(){
    var drop = document.getElementById("menu-dropdown");
    if (drop.style.display == "none"){
        drop.style.display = "revert";
    }
    else{
        drop.style.display = "none";
    }
}

//https://www.geeksforgeeks.org/password-matching-using-javascript/
function check_password(){
    let new_pw = document.getElementById("new-pw");
    let rep_pw = document.getElementById("rep-pw");
    let errors = document.getElementById("errors");
    let button = document.getElementById("pw-submit");
    
    if (new_pw.value != rep_pw.value){
        errors.innerHTML = "Passwords do not match"
        return false;
    }
    else{
        errors.innerHTML = ""
        return true
    }
}
