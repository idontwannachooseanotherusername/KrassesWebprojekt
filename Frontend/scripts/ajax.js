
function challenge_all(){    
    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/all',
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {
        var wrapper = document.getElementsByClassName('challenge-wrapper')[0];
        console.log('Number of challenges in db: ' + response.daten.length);

        // create challenges
        for (let i = 0; i < response.daten.length; i++) {
            // link wrapper
            let link = document.createElement("a");
            link.href = "challenge.html?id=" + response.daten[i].challengeid;
            
            // challenge wrapper
            let challenge = document.createElement("div");
            challenge.className = "challenge";

            // challenge color
            let color = document.createElement("div");
            color.className = `challenge-color level-${response.daten[i].difficulty}`;
            let p = document.createElement("p");
            p.innerHTML = `${response.daten[i].difficulty}`;
            
            color.appendChild(p);
            challenge.appendChild(color);

            // challenge image
            let image = document.createElement("img");
            image.className = "challenge-picture img-border";
            image.src = "images/BasicProfile.png";

            challenge.appendChild(image);

            // challenge description
            let description = document.createElement("div");
            description.className = "challenge-description";
            let heading = document.createElement("h2");
            heading.innerHTML = response.daten[i].challengename;
            let text = document.createElement("p");
            text.innerHTML = response.daten[i].description.split(' ').slice(0, 10).join(' ').slice(0, 150) + '...';
            
            description.appendChild(heading);
            description.appendChild(text);
            challenge.appendChild(description);

            // add to link-wrapper and to wrapper
            link.appendChild(challenge);
            wrapper.appendChild(link);
        }
    }).fail(function (jqXHR, statusText, error) {
        check_access(jqXHR, "challenge", "access", "challenges.html");
    });
}

function get_url_params(){
    var paramstring = window.location.href.split('?')[1];
    var params = {};
    for (p of paramstring.split('&')){
        var p_split = p.split('=');
        params[p_split[0]] = p_split[1];
    }
    return params;
}

function challenge_id(){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {return};

    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/get/' + challengeid,
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {       
        // Heading
        var challenge = document.getElementsByClassName("challenge-attributes")[0];
        var title = document.createElement("h1");
        title.innerHTML = response.daten.challengename;
        challenge.insertBefore(title, challenge.firstChild);

        // Attributes
        var attributes = document.getElementsByClassName("challenge-attribute");
        attributes[0].className = "challenge-attribute level-" + response.daten.difficulty.level;
        var level = document.createElement("p");
        level.innerHTML = "Level " + response.daten.difficulty.level;
        attributes[0].appendChild(level);
        var cat = document.createElement("p");
        cat.innerHTML = response.daten.category;
        attributes[1].appendChild(cat);
        var code = document.createElement("p");
        code.innerHTML = response.daten.challengeid;
        attributes[2].appendChild(code);
        var link = document.getElementById("profile-link");
        link.href = "profile.html?id=" + response.daten.userid;
        var username = document.createElement("p");
        username.innerHTML = response.daten.username;
        attributes[3].appendChild(username);
        var date = document.createElement("p");
        date.innerHTML = response.daten.creationdate;  // TODO: Only date, not time
        attributes[4].appendChild(date);
        var rating = document.createElement("p");
        rating.innerHTML = "⭐".repeat(response.daten.rating);
        attributes[5].appendChild(rating);

        // Tags
        var wrapper = document.getElementsByClassName("tag-wrapper")[0];
        for (var i = 0; i < response.daten.tags.length; i++){
            var tag = document.createElement("div");
            tag.className = "challenge-tag";
            var img = document.createElement("img");
            img.src = response.daten.tags[i].picturepath;
            img.title = response.daten.tags[i].title;
            var description = document.createElement("p");
            description.innerHTML = response.daten.tags[i].title;

            tag.appendChild(img);
            tag.appendChild(description);
            wrapper.appendChild(tag);

            // challenge body
            var challenge = document.getElementsByClassName("challenge-information")[0];
            var description = document.createElement("div");
            description.className = "challenge-text";
            description.innerHTML = response.daten.description;
            challenge.prepend(description);

        }
        // TODO: Files!

        c_challenge_tools();
    }).fail(function (jqXHR, statusText, error) {
        check_access(jqXHR, "challenge", "access", "challenges.html");
    });
}

function check_hints(){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {return};

    $.ajax({
        url: 'http://localhost:8001/wba2api/hint/check/' + challengeid,
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {    
        var unavailable = document.getElementsByClassName("hint-unavailable");
        var texts = document.getElementsByClassName("hint-text");
        var hints = document.getElementsByClassName("hint");
        for (let e in response.daten){
            texts[response.daten[e].Class - 1].innerHTML = "Voluptatem maiores amet quae. Aliquid quia ut exercitationem voluptatibus ut. Iure aut velit nisi.";
            unavailable[response.daten[e].Class - 1].innerHTML = "";
            hints[response.daten[e].Class - 1].onclick = function() {get_hint(response.daten[e].Class)};
        }
    }).fail(function (jqXHR, statusText, error) {
    });
}

function get_hint(id){
    var hint = document.getElementsByClassName("hint")[id -1];
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
                text.innerHTML = "";
                hint.classList.remove("confirm")
                
                /*Get hint from server*/
                var challengeid = get_url_params().id;
                if (challengeid === undefined) {return};
                $.ajax({
                    url: 'http://localhost:8001/wba2api/hint/get-from-challenge/' + id + '/' + challengeid,
                    method: 'get',
                    xhrFields: { withCredentials: true },
                    dataType: 'json'
                }).done(function (response) {
                    hint.lastChild.remove();
                    text.innerHTML = response.daten.description;;
                }).fail(function (jqXHR, statusText, error) {
                    if (jqXHR.status == 401){
                        alert('Not logged in!');
                    }
                    else{
                        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
                        alert('An error occured.');
                    }
                });
            }
        }
    }
}

function load_profile(id){
    $.ajax({
        url: 'http://localhost:8001/wba2api/user/get/' + id,
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {
        console.log(response);
        $('.user-name').html(response.daten.username);
        $('#profile-description').html(response.daten.bio);
        $('#profile-country').html(response.daten.country);
        $('#profile-points').html(response.daten.points);

        // Pfade anpassen
        $('.img-border').attr("src", "images/profile-3.png")
        $('.background').css("background-image", `url(${response.daten.picturepath})`);

        // solved and created challenges
        var solved = document.getElementById("profile-solved");
        var created = document.getElementById("profile-created");
        for (var i = 0; i < response.daten.solved.length; i++){
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "challenge.html?id=" + response.daten.solved[i].challengeid;
            a.innerHTML = '(' + response.daten.solved[i].challengeid + ') ' + response.daten.solved[i].challengename;
            li.appendChild(a);
            solved.appendChild(li);
        }
        for (var i = 0; i < response.daten.created.length; i++){
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "challenge.html?id=" + response.daten.created[i].challengeid;
            a.innerHTML = '(' + response.daten.created[i].challengeid + ') ' + response.daten.created[i].challengename;
            li.appendChild(a);
            created.appendChild(li);
        }

        var h_solved = document.getElementById("solved-heading");
        h_solved.innerHTML = `Created Challenges (${response.daten.solved.length})`;
        var h_created = document.getElementById("created-heading");
        h_created.innerHTML = `Created Challenges (${response.daten.created.length})`;

    }).fail(function (jqXHR, statusText, error) {
        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        alert('An error occured.');
    });
}

// Create challenge
function submitChallenge(){
    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge',
        method: 'post',
        dataType: 'json',
        data: $('form').serialize()
    }).done(function (response) {
        window.location.replace("challenge.html?id=" + response.daten.challengeid);
    }).fail(function (jqXHR, statusText, error) {
        check_access(jqXHR, "challenge", "create");
    });
    return false;
}

// Create user or log in
function submitUser(){
    $.ajax({
        url: 'http://localhost:8001/wba2api/user',
        method: 'post',
        dataType: 'json',
        data: $('form').serialize()
    }).done(function (response) {
        console.log(response);
        document.cookie = `token=${response.daten};SameSite=Lax;`;
        window.location.replace("challenges.html");
    }).fail(function (jqXHR, statusText, error) {
        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        alert('An error occured.');
    });
    return false;
}

// Check user login to hide or show certain links
function login_check(){
    $.ajax({
        url: 'http://localhost:8001/wba2api/login_check',
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {
        // Get user infos
        var user_points = 0;
        var user_image = '';
        var user_name = '';

        $.ajax({
            url: 'http://localhost:8001/wba2api/user/get/' + String(response.daten),
            method: 'get',
            dataType: 'json',
        }).done(function (response2) {
            user_points = response2.daten.points;
            user_image = response2.daten.picturepath;
            if (user_image == ''){
                user_image = '/images/Logo.png';
            }
            user_name = response2.daten.username;

        // Create usericon with dropdown
        var menu_bar = document.getElementsByClassName("wrapper")[0];
        var image_wrapper = document.createElement('div');
        image_wrapper.className = "pb-image-wrapper";
        var image = document.createElement('img');
        image.id = "pb";
        image.src = user_image;
        image.onclick = function() {show_dropdown();};
        image_wrapper.append(image);
        menu_bar.append(image_wrapper);

        var list = document.createElement('dl');
        list.id = "menu-dropdown";
        list.className = "dropdown";
        var user = document.createElement('dt');
        var br = document.createElement('br');
        user.className = "dropdown-entry";
        user.innerHTML = `Signed in as ${br.outerHTML} ${user_name}`;
        list.appendChild(user);
        list.appendChild(create_list_entry("dropdown-entry seperator points", user_points));
        list.appendChild(create_list_entry("dropdown-entry seperator", "Create", "challengecreator.html"));
        list.appendChild(create_list_entry("dropdown-entry", "Settings", "profile-edit.html"));
        list.appendChild(create_list_entry("dropdown-entry", "Account", "profile.html"));
        list.appendChild(create_list_entry("dropdown-entry", "Logout", "", function() { logout(); }));
        menu_bar.appendChild(list);

        // Remove login button (replace with what?) TODO!
        }).fail(function (jqXHR, statusText, error) {
        });
    }).fail(function (jqXHR, statusText, error) {
        // User not logged in -> Don't create links
        var login_button = document.getElementsByClassName('login-button')[0];
        if (login_button !== undefined){
            login_button.style = "display:initial";
        }
    });
}

function create_list_entry(classes = "", text = "", ref = undefined, click = undefined){
    var entry = document.createElement('dd');
    entry.className = classes;
    if (ref !== undefined){
        var link = document.createElement('a');
        link.href = ref;
        link.innerHTML = text;
        entry.append(link);
    }
    else {
        entry.innerHTML = text;
    }
    if (click !== undefined){
        entry.onclick = click;
    }
    return entry;
}

// User not logged in 
function check_access(jqXHR, resource = 'asset', intention = 'access', link_to = 'login.html', alert_msg = 'An error occured.'){
    var header = document.getElementsByTagName("header")[0];
    var main = document.getElementsByTagName("main")[0];
    var warning = document.createElement("div");
    warning.className = "error";
    var warning_link = document.createElement("a");
    warning_link.style = "font-weight: bold";
    var waring_text = document.createElement("p");
    main.style = 'filter: blur(3px); user-select: none;';
    var block_div = document.createElement("div");
    block_div.style = "height: 100%; position: absolute; width: 100%;";
    main.prepend(block_div); 
    
    if (jqXHR.status == 401){
        warning_link.href = 'login.html';
        warning_link.innerHTML = "LOG IN";
        waring_text.innerHTML = `You need to ${warning_link.outerHTML } in order to ${intention} this ${resource}.`;
        warning.appendChild(waring_text);
        header.appendChild(warning);
    }
    else if (jqXHR.status == 404){
        warning_link.href = link_to;
        warning_link.innerHTML = resource.toUpperCase() + "S";
        waring_text.innerHTML = `This ${resource} does not exist. Go to ${warning_link.outerHTML} to see available ones.`;
        warning.appendChild(waring_text);
        header.appendChild(warning);
    }
    else{
        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        alert(alert_msg);
    }
}

// Challenge
function c_challenge_tools(){
    if (false){  // TODO: Check if user is challenge author
        return
    }
    
    var tools = document.createElement("article");
    tools.className = "challenge-tools";
    var delete_button = document.createElement("div");
    delete_button.className = "btn-delete btn-challenge";
    delete_button.innerHTML = "delete";
    var edit_button = document.createElement("div");
    edit_button.className = "btn-primary btn-challenge";
    edit_button.innerHTML = "edit";
    delete_button.onclick = function() {delete_challenge();}
    edit_button.onclick = function() {edit_challenge();}
    var text = document.getElementsByClassName("challenge-site")[0];
    tools.appendChild(edit_button);
    tools.appendChild(delete_button);
    text.appendChild(tools);
}

function delete_challenge(){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {return};

    if (! window.confirm('Are you sure?')){
        return;
    }

    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/' + challengeid,
        method: 'delete',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {    
        alert("Challenge deleted successfully!");
        window.location.replace("index.html");
    }).fail(function (jqXHR, statusText, error) {
        alert("Error deleting challenge!\n\n" + error);
    });
}
