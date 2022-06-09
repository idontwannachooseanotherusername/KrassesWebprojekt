// const { fail } = require("assert");

function load_challenges(){    
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
            image.src = response.daten[i].user.userimage;

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

            // add to link-wrapper to wrapper
            link.appendChild(challenge);
            wrapper.appendChild(link);
        }
    }).fail(function (jqXHR, statusText, error) {
        console.log("Could not load challenges");
    });
}

function get_url_params(){
    var paramstring = window.location.href.split('?')[1];
    if (paramstring === undefined){return {id: undefined};}

    var params = {};
    for (p of paramstring.split('&')){
        var p_split = p.split('=');
        params[p_split[0]] = p_split[1];
    }
    return params;
}

function user_logged_in(){
    return $.ajax({
        url: 'http://localhost:8001/wba2api/login_check',
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json',
    })
}

function load(site=""){
    execute_if_logged_in(load_default);
    switch(site){
        case "challenge": execute_if_logged_in(load_challenge, true); break;
        case "challengeeditor": execute_if_logged_in(load_challenge_editor, true); break;
        case "challenges": load_challenges(); break;
        case "profile": load_profile(); break;
        case "profileeditor": execute_if_logged_in(load_profile_editor, true); break;
    }
}

function hide_loading(){
    if ($("#loading"))
        $("#loading").hide();
}

function execute_if_logged_in(funct, show_prompt=false){
    user_logged_in().done(function(response) {
        console.log(response);
        userid = response.daten;
        if (!userid){
            $("#loading").hide();
            var login_button = document.getElementsByClassName("login-button")[0];
            if (login_button) {login_button.style.display = "initial";}
            if (show_prompt){show_login_prompt();}
            return;
        }
        funct(userid);
        hide_loading();
    }).fail(function(jqXHR, statusText, error){
        console.log("Login check for execution failed, reason: " + error);
    });
}

function load_default(userid){
    $.ajax({
        url: 'http://localhost:8001/wba2api/user/get/' + String(userid),
        method: 'get',
        dataType: 'json',
    }).done(function (response) {
        create_usermenu(response.daten);
    }).fail(function (jqXHR, statusText, error) {
        console.log("Failed to create usermenu, reason: " + error)
    });
}

function load_challenge(){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {return};

    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/get/' + challengeid,
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {      
        console.log(response.daten); 
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
        link.href = "profile.html?id=" + response.daten.user.userid;
        var username = document.createElement("p");
        username.innerHTML = response.daten.user.username;
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

        // Editing tools if user owns challenge
        user_logged_in().done(function(r) {
            console.log(r);
            if (r.daten == response.daten.user.userid)
                create_challenge_tools(challengeid);
        });
    }).fail(function (jqXHR, statusText, error) {
        show_login_prompt();
    });
}

function show_login_prompt(){
    var wrapper = $('.access-wrapper')
    if (wrapper) {wrapper.show();}

    var denied = $('<p class="access"><span class="access-denied">ACCESS DENIED!</span><br>\
                    <span class="access-explanation">Looks like you\'re trying to access something\
                    you are not allowed to. If you haven\'t already, try <a href="login.html">\
                    <b>logging in.<b></a></span></p>')
    $('main').prepend($('<div/>').addClass("access-wrapper").append(denied));
}

function create_usermenu(user){
    // Icon
    var menu_bar = $(".wrapper")[0];
    var image_wrapper = $('<div class="pb-image-wrapper"></div>')[0];
    var image = $(`<image id="pb" src="${user.picturepath}" onclick="show_dropdown()">`)[0];
    image_wrapper.append(image);
    menu_bar.append(image_wrapper);

    // Dropdown
    var list = $('<dl/>').attr("id", "menu-dropdown").addClass("dropdown")[0];
    var br = $('<br>')[0];
    var signed_in = $('<dt/>').addClass("dropdown-entry")[0]
    signed_in.innerHTML = `Signed in as ${br.outerHTML} ${user.username}`
    list.append(signed_in);
    list.append($(`<dd class="dropdown-entry seperator points">${user.points}</dd>`)[0]);
    list.append($(`<a href="challengecreator.html"><dd class="dropdown-entry seperator">Create</dd></a>`)[0]);
    list.append($('<a href="profile-edit.html"><dd class="dropdown-entry">Settings</dd></a>')[0]);
    list.append($('<a href="profile.html"><dd class="dropdown-entry">Account</dd></a>')[0]);
    list.append($('<a href="index.html"><dd class="dropdown-entry" onclick="logout()">Logout</dd></a>')[0]);
    menu_bar.append(list);
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
    console.log("Error: " + error);
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

function load_profile(){
    var params = get_url_params();
    $.ajax({
        url: 'http://localhost:8001/wba2api/login_check',
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (r) {
        if (params === undefined){
            userid = r.daten;
        }
        else{
            userid = params.id;
        }
        $.ajax({
            url: 'http://localhost:8001/wba2api/user/get/' + userid,
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
            $('.img-border').attr("src", `${response.daten.picturepath}`);
            $('.background').css("background-image", `url(${response.daten.bannerpath})`);
    
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
            h_solved.innerHTML = `Solved Challenges (${response.daten.solved.length})`;
            var h_created = document.getElementById("created-heading");
            h_created.innerHTML = `Created Challenges (${response.daten.created.length})`;
            $("#loading").hide();
        }).fail(function (jqXHR, statusText, error) {
            console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
            alert('An error occured.');
        });
    }).fail(function (jqXHR, statusText, error) {
        window.location.replace("login.html");
    });
}

// Create challenge
function submit_challenge(){
    user_logged_in().done(function(response) {
        userid = response.daten;
        var challengeid = get_url_params().id;
        var url = "http://localhost:8001/wba2api/challenge/";
        var method = "post";
        if (challengeid !== undefined) {
            url += challengeid;
            method = "put";
        }
        else{url += userid;}

        $.ajax({
            url: url,
            method: method,
            dataType: 'json',
            data: $('form').serialize(),
            xhrFields: { withCredentials: true }
        }).done(function (response) {
            window.location.replace("challenge.html?id=" + response.daten.challengeid);
        }).fail(function (jqXHR, statusText, error) {
            console.log("Could not upload challenge, reason: " + error);
            if(jqXHR.status === 401){show_login_prompt();}
        });
    });
    return false;
}

// Create user or log in
function submit_user(){
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

// Challenge
function create_challenge_tools(challengeid){
    var tools = document.createElement("article");
    tools.className = "challenge-tools";
    var delete_button = document.createElement("div");
    delete_button.className = "btn-delete btn-challenge";
    delete_button.innerHTML = "delete";
    var edit_link = document.createElement("a");
    edit_link.href = "challengecreator.html?id=" + String(challengeid)
    var edit_button = document.createElement("div");
    edit_button.className = "btn-primary btn-challenge";
    edit_button.innerHTML = "edit";
    edit_link.appendChild(edit_button);
    delete_button.onclick = function() {delete_challenge();}
    var text = document.getElementsByClassName("challenge-site")[0];
    tools.appendChild(edit_link);
    tools.appendChild(delete_button);
    text.appendChild(tools);
}

function delete_challenge(){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {return};
    if (! window.confirm('Are you sure?')){return;}

    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/' + challengeid,
        method: 'delete',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {    
        alert("Challenge deleted successfully!");
        window.location.replace("challenges.html");
    }).fail(function (jqXHR, statusText, error) {
        alert("Error deleting challenge!\n\n" + error);
    });
}

function load_challenge_editor(){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {
        load_challenge_editor_tags([]);
        return
    }

    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/get/unsterilized/' + challengeid,
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {
        console.log(response.daten);
        $("#challengename").val(response.daten.challengename);
        $("#difficulty").val(response.daten.difficulty.level);
        $("#category").val(response.daten.categoryid).change();
        response.daten.hints.forEach(hint => {
            $(`#hint-${hint.class}`).val(hint.description);
        });
        $("#password").attr("placeholder", "unchanged");
        $("#password").removeAttr('required');
        // TODO: Possibility to delete and upload files
        load_challenge_editor_tags(response.daten.tags);
    }).fail(function (jqXHR, statusText, error) {
        console.log("Error fetching challenge, reason: " + error);
        if(jqXHR.status === 401){show_login_prompt();}
    });
}

function load_challenge_editor_tags(tags){
    $.ajax({
        url: 'http://localhost:8001/wba2api/tag/all',
        method: 'get',
        dataType: 'json'
    }).done(function (response_tags) {
        var tags_wrapper = $("#tags-wrapper")
        for (var tag of response_tags.daten){
            var checkbox = $(`<input class="editor-tag" name="tags[]" value=${tag.tagid} type="checkbox">`)
            for (var challenge_tag of tags){
                if (challenge_tag.tagid === tag.tagid){
                    checkbox.attr("checked", "");
                    break;
                }
            }
            tags_wrapper.append(checkbox);
            tags_wrapper.append($(`<label class="editor-taglabel" for="tags[]">${tag.title}</label>`));
        }
    }).fail(function (jqXHR, statusText, error) {
        console.log("Error fetching tags, reason: " + error);
    });
}

function load_profile_editor(){
    user_logged_in().done(function(response) {
        userid = response.daten;
        if (!userid){
            if (show_prompt){show_login_prompt();}
            return;
        }

        $.ajax({
            url: 'http://localhost:8001/wba2api/user/get/' + userid,
            method: 'get',
            dataType: 'json'
        }).done(function (r) {    
            console.log(r);
            document.getElementsByClassName("user-name")[0].innerHTML = r.daten.username;
            document.getElementById("profile-name").value = r.daten.username;
            document.getElementById("profile-bio").value = r.daten.bio;
            document.getElementById("profile-country").value = r.daten.country;
            $('.img-border').attr("src", `${r.daten.picturepath}`);
            $('.background').css("background-image", `url(${r.daten.bannerpath})`);
            $("#loading").hide();
        }).fail(function (jqXHR, statusText, error) {
            if(jqXHR.status === 401){show_login_prompt();}
        });
    }).fail(function(jqXHR, statusText, error){
        console.log("Login check failed, reason: " + error);
    });
    return false;
}

function save_profile_editor(){
    console.log($('#change-profile').serialize());
    $.ajax({
        url: 'http://localhost:8001/wba2api/login_check',
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (r) {
        $.ajax({
            url: 'http://localhost:8001/wba2api/user/update/' + r.daten,
            method: 'put',
            dataType: 'json',
            xhrFields: { withCredentials: true },
            data: $('#change-profile').serialize()
        }).done(function (response) {    
            window.location.replace("profile.html");
            return false;
        }).fail(function (jqXHR, statusText, error) {
            console.log("Could not update user, reason: " + error);
            if(jqXHR.status === 401){show_login_prompt();}
        });
    }).fail(function (jqXHR, statusText, error) {
        console.log("Error: " + error);
    });
    return false;
}
