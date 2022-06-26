var userid = false;
var challenges = [];

function filter_challenges(){
    $(".challenge-wrapper").empty();
    var filtered_challenges = [...challenges];
    var fields = {};
    var filtered_len = filtered_challenges.length;

    if($('#search-difficulty').val())
        fields.level = $('#search-difficulty').val();
    if($('#search-name').val())
        fields.name = $('#search-name').val();
    if($('#search-category').val())
        fields.category = $('#search-category').val();

    if ("level" in fields){
        var value = fields.level;
        if (value === "0"){$("#search-difficulty").val("");}
        var i=0;
        while(i<filtered_len){
            if (filtered_challenges[i].difficulty != value && value !== "0"){
                filtered_challenges.splice(i,1);
                filtered_len--;
            }
            else{
                i++;
            }
        }
    }

    if ("name" in fields){
        value = fields.name.toLowerCase();
        i=0;
        while(i<filtered_len){
            if (!(filtered_challenges[i].challengename.toLowerCase().includes(value) ||
                filtered_challenges[i].description.toLowerCase().includes(value) ||
                filtered_challenges[i].challengeid == value)){
                filtered_challenges.splice(i,1);
                filtered_len--;
            }
            else{
                i++;
            }
        }
    }

    if ("category" in fields){
        value = fields.category;
        i=0;
        while(i<filtered_len){
            if (!(filtered_challenges[i].categoryid == value)){
                filtered_challenges.splice(i,1);
                filtered_len--;
            }
            else{
                i++;
            }
        }
    }
    for (var challenge of filtered_challenges){
        create_challenge(challenge);
    }
}

function load_challenges(){
    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/all',
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {
        console.log('Number of challenges in db: ' + response.daten.length);

        // create challenges
        for (let i = response.daten.length-1; i >= 0; i--) {
            create_challenge(response.daten[i]);
            challenges.push(response.daten[i]);
        }
        hide_loading();
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}

function create_challenge(challenge_data){
    var wrapper = document.getElementsByClassName('challenge-wrapper')[0];
    
    // link wrapper
    let link = document.createElement("a");
    link.href = "challenge.html?id=" + challenge_data.challengeid;
    
    // challenge wrapper
    let challenge = document.createElement("div");
    challenge.className = "challenge";

    if ("solved" in challenge_data && challenge_data.solved)
    {
        let solved = document.createElement("img");
        solved.src = "data/icons/Point.svg";
        solved.className = "challenge-solved-marker";
        solved.title = "Solved";
        challenge.appendChild(solved);
    }

    // challenge color
    let color = document.createElement("div");
    color.className = `challenge-color level-${challenge_data.difficulty}`;
    let p = document.createElement("p");
    p.innerHTML = `${challenge_data.difficulty}`;
    
    color.appendChild(p);
    challenge.appendChild(color);

    // challenge image
    let image = document.createElement("img");
    image.className = "challenge-picture img-border";
    image.src = challenge_data.user.userimage;
    image.title = challenge_data.user.username;

    challenge.appendChild(image);

    // challenge description
    let description = document.createElement("div");
    description.className = "challenge-description";
    let heading = document.createElement("h2");
    heading.innerHTML = challenge_data.challengename;
    let text = document.createElement("p");
    text.innerHTML = challenge_data.description.split(' ').slice(0, 10).join(' ').slice(0, 150) + '...';
    
    description.appendChild(heading);
    description.appendChild(text);
    challenge.appendChild(description);

    // add to link-wrapper to wrapper
    link.appendChild(challenge);
    wrapper.appendChild(link);
}

function get_url_params(){
    var paramstring = window.location.href.split('?')[1];
    if (paramstring === undefined){return {id: undefined};}

    var params = {};
    for (var p of paramstring.split('&')){
        var p_split = p.split('=');
        params[p_split[0]] = p_split[1];
    }
    return params;
}

function hide_loading(){
    if ($("#loading"))
        $("#loading").hide();
}

function user_logged_in(){
    return $.ajax({
        url: 'http://localhost:8001/wba2api/login_check',
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json',
    });
}

function load(site=""){
    user_logged_in().done(function (answer){
        userid = answer.daten;

        if (userid) {
            console.log("Logged in with ID = " + userid);
            load_default(userid);

            var login_button = document.getElementsByClassName("login-button")[0];
            if (login_button) {
                login_button.innerHTML = "CREATE";
                login_button.parentNode.href = "challengecreator.html";
            }
        }
        switch(site){
            case "challenge": if (userid) {load_challenge(userid);}
                else {hide_loading();show_login_prompt();} break;
            case "challengeeditor": if (userid){load_challenge_editor(userid);}
                else {hide_loading();show_login_prompt();} break;
            case "challenges": load_challenges(); break;
            case "profile": load_profile(userid); break;
            case "profileeditor": if (userid) {load_profile_editor(userid);}
                else {hide_loading();show_login_prompt();} break;
            case "login": if (userid) {window.location.replace("profile.html?id=" + userid);};break;
        }
    }).fail(function(jqXHR, statusText, error){
        response_handling(jqXHR, statusText, error);
    });
}

function load_default(userid){
    $.ajax({
        url: 'http://localhost:8001/wba2api/user/get/' + userid,
        method: 'get',
        dataType: 'json',
    }).done(function (response) {
        create_usermenu(response.daten);
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
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
        load_hint_preview(response.daten.solved);
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
        date.innerHTML = response.daten.creationdate;
        attributes[4].appendChild(date);

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
        }

        $('.challenge-text')[0].innerHTML = response.daten.description;

        if(response.daten.files.length!==0){
            var downloadlist = document.createElement('ul');
            $(downloadlist).css('list-style', 'none');
            downloadlist.style.padding = 'unset';
            var heading = document.createElement('h3');
            heading.innerHTML = "Downloads";
            downloadlist.append(heading);
            for (var i = 0; i < response.daten.files.length; i++){
                var data = document.createElement('li');
                data.className = "challenge-file-entry"
                var file = document.createElement('div');
                file.className = "challenge-file";
                var span = document.createElement("span");
                var data_link = document.createElement("a");
                var filename = document.createElement("div");
                var filepath = response.daten.files[i].split('/');
                filename.innerHTML = filepath[filepath.length-1].split('.')[0];
                span.innerHTML = filepath[filepath.length-1].split('.')[1];
                filename.className = "challenge-filename";
                data_link.href = response.daten.files[i];
                data_link.setAttribute('download',"");
                file.appendChild(span);
                data_link.appendChild(file);
                data_link.appendChild(filename);
                data.appendChild(data_link);
                downloadlist.appendChild(data);
            }
            document.getElementsByClassName("challenge-downloads")[0].append(downloadlist);
            $('.challenge-downloads')[0].append.downloadlist;
        }

        if(response.daten.solved){
            create_challenge_message("You solved this challenge!");
            $('#solution').prop("disabled", true).prop("placeholder", "Already solved");
            $('#solution-button').addClass("disabled").prop("onclick", "");
        }else if(response.daten.user.userid == userid){
            create_challenge_message("This is your own challenge!");
            $('#solution').prop("disabled", true).prop("placeholder", "Own challenge");
            $('#solution-button').addClass("disabled").prop("onclick", "");
        }

        if (userid == response.daten.user.userid)
            create_challenge_tools(challengeid);
        
        hide_loading();
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
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

function load_hint_preview(solved){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {return};

    $.ajax({
        url: 'http://localhost:8001/wba2api/hint/check/challenge/' + challengeid,
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {    
        var texts = document.getElementsByClassName("hint-text");
        var hints = document.getElementsByClassName("hint");
        for (var hintclass in response.daten){
            if(!(Number.isInteger(response.daten[hintclass])) || solved){
                load_hint(hintclass);
            }
            else{
                if (response.daten[hintclass] == 0) {continue;}
                hints[hintclass-1].onclick = function() {get_hint(this)};
                texts[hintclass-1].classList.add("preview");
                var hint_len = response.daten[hintclass];
                var start = Math.floor(Math.random() * (guide_max_len - hint_len));
                texts[hintclass-1].innerHTML = guide.substr(start,hint_len);
            }
        }
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}
function load_hint(hintclass){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {return};
    $.ajax({
        url: 'http://localhost:8001/wba2api/hint/get-from-challenge/' + hintclass + '/' + challengeid,
        method: 'get',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {
        var description = $('.hint-text')[hintclass-1];
        description.innerHTML = response.daten.description;
        description.className = "hint-text loaded";
        $('.hint')[hintclass-1].onclick = undefined;
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}

function get_hint(hint){
    var hintclass = hint.id.substr(4);
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

            setTimeout(function() {
                text.classList.remove("confirm");
                warning.classList.remove("warning");
                try{
                    hint.removeChild(warning);
                }
                catch{}
            }, 5000);
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
                load_hint(hintclass);
            }
        }
    }
}

function load_profile(){
    var params = get_url_params();
    if (!userid) {
        hide_loading();
    }

    if (params.id === undefined){
        if (!userid) {
            hide_loading();
            show_login_prompt();
            return;
        }
        id = userid;
    }
    else{
        id = params.id;
    }
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

        if(response.daten.userid == userid){
            var tools = document.createElement("article");
            tools.className = "profile-tools";
            var edit_link = document.createElement("a");
            edit_link.href = "profile-edit.html";
            var edit_button = document.createElement("div");
            edit_button.className = "btn-primary";
            edit_button.innerHTML = "edit";
            var text = document.getElementsByClassName("profile")[0];
            edit_link.appendChild(edit_button);
            tools.appendChild(edit_link);
            text.appendChild(tools);
            console.log("hey");
        }
        hide_loading();
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}

// Create challenge
function submit_challenge(event){
    event.preventDefault();
    
    //Dateien einlesen----------------------------------------------------
    var inpFile = document.getElementById("files");
    formdata = new FormData();
            
    for (var file of inpFile.files){
            formdata.append("myFiles[]", file);
    }
    
    var challengeid = get_url_params().id;
    var url = "http://localhost:8001/wba2api/challenge/";
    var method = "post";
    if (challengeid !== undefined) {
        url += challengeid;
        method = "put";
    }
    $('#description')[0].value = $('.visuell-view')[0].innerHTML
    var daten = $('form').serializeArray();
    var tags = [];
    for (var i = 0; i< daten.length; i++ ){
        if (daten[i].name == "tags"){
            tags.push(daten[i].value);
            continue;
        }
        formdata.append(daten[i].name, daten[i].value);
    } 
    formdata.append("tags", tags);

    $.ajax({
        url: url,
        method: method,
        dataType: 'json',
        data: formdata,
        processData: false,
        contentType: false,
        xhrFields: { withCredentials: true }
    }).done(function (response) {
        window.location.replace("challenge.html?id=" + response.daten.challengeid);
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}


// Create user or log in
function submit_user(event){
    event.preventDefault();
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
        response_handling(jqXHR, statusText, error);
    });
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

function create_challenge_message(text){
    $('.challenge-tags:first').after($('<article/>').addClass("challenge-solved").text(text));
}

function delete_user(event){
    if (! window.confirm('Are you sure?')){return;}
    event.preventDefault();

    $.ajax({
        url: 'http://localhost:8001/wba2api/user/',
        method: 'delete',
        xhrFields: { withCredentials: true },
        dataType: 'json'
    }).done(function (response) {    
        alert("User deleted successfully!");
        logout();
        window.location.replace("login.html");
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
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
        response_handling(jqXHR, statusText, error);
    });
}

function load_challenge_editor(){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {
        load_challenge_editor_tags([]);
        hide_loading();
        return;
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
        for (hint of response.daten.hints){
            $(`#hint${hint.class}`).val(hint.description);
        }
        $("#password").attr("placeholder", "unchanged");
        $("#password").removeAttr('required');
        // TODO: Possibility to delete and upload files
        load_challenge_editor_tags(response.daten.tags);
        $(".visuell-view")[0].innerHTML = response.daten.description;
        hide_loading();
    }).fail(function (jqXHR, statusText, error) {
        console.log("Error fetching challenge, reason: " + error);
        response_handling(jqXHR, statusText, error);
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
            var checkbox = $(`<input class="editor-tag" name="tags" value=${tag.tagid} type="checkbox">`)
            for (var challenge_tag of tags){
                if (challenge_tag.tagid === tag.tagid){
                    checkbox.attr("checked", "");
                    break;
                }
            }
            tags_wrapper.append(checkbox);
            tags_wrapper.append($(`<label class="editor-tag" for="tags[]">${tag.title}</label>`));
        }
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}

function load_profile_editor(){
    if (!userid){
        show_login_prompt();
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
        document.getElementById("profile-country").value = r.daten.countryid;
        $('.img-border').attr("src", `${r.daten.picturepath}`);
        $('.background').css("background-image", `url(${r.daten.bannerpath})`);
        $("#loading").hide();
        hide_loading();
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}

function response_handling(jqXHR, statusText, error){
    if(jqXHR.status === 401){
        show_login_prompt();
    }
    else if (jqXHR.status === 404){
        window.location.replace("errorsite.html");
    }
    else if (jqXHR.responseJSON !== undefined){
        show_error(jqXHR.responseJSON.nachricht);
    }
    else{
        show_error(statusText + " | " + error);
    }
}

function show_error(error){
    var error_object = $('<div/>').prop("id", "error").text(error);
    var scrollTop = scrollY;
    $('main').prepend(error_object);
    window.scrollTo(0,0);
    window.setTimeout(function(){
        error_object.remove();
        window.scrollTo(0, scrollTop);
    },5000);
}

function save_profile_password(event){
    if (!userid){
        show_login_prompt();
        return;
    }
    event.preventDefault();
    if(!check_password()){
        return;
    }
    $.ajax({
        url: 'http://localhost:8001/wba2api/user/update/' + userid,
        method: 'put',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: $('#change-pw').serialize()
    }).done(function (response) {
        logout();
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}

function save_profile_editor(event){
    if (!userid){
        show_login_prompt();
        return;
    }
    event.preventDefault();

    var profilePic = document.getElementById("profile-pic");
    var profileBanner = document.getElementById("profile-banner");
    formdata = new FormData();
            

    for (var file of profilePic.files){
        formdata.append("profilePic", file);
    } 

    for (var file of profileBanner.files){
        formdata.append("profileBanner", file);
    }
    
    var daten = $('form').serializeArray();
    for (var i = 0; i< daten.length; i++ ){
        formdata.append(daten[i].name, daten[i].value);
    } 

    $.ajax({ 
        url: 'http://localhost:8001/wba2api/user/update/' + userid,
        method: 'put',
        dataType: 'json',
        data: formdata,
        processData: false,
        contentType: false,
        xhrFields: { withCredentials: true },
    }).done(function (response) {    
        window.location.replace("profile.html");
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}

function check_challenge_solution(){
    var challengeid = get_url_params().id;
    if (challengeid === undefined) {return;}

    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/solutioncheck/' + challengeid,
        method: 'post',
        dataType: 'json',
        xhrFields: { withCredentials: true },
        data: {"solution": $('#solution')[0].value}
    }).done(function (response) {    
        if (!response.daten){
            show_wrong_solution();
            return;
        }
        show_right_solution();
    }).fail(function (jqXHR, statusText, error) {
        response_handling(jqXHR, statusText, error);
    });
}

function show_right_solution(){
    $('#solution')[0].classList.remove("wrong");
    window.location.reload(true);
}

function show_wrong_solution(){
    $('#solution')[0].classList.remove("wrong");
    window.setTimeout(function(){
        $('#solution')[0].classList.add("wrong");
    },500);
}

function show_uploaded_files(files){
    var label = $("#fileupload")[0];
    var filenames = ""

    if (files.length > 10){
        label.innerHTML = "Too many files. Max is 10.";
        label.style.color = "#950239";
        return;
    }
    else{label.style.color = "white";}
    
    if (files.length == 0){
        return;
    }

    for (var i = 0; i < files.length; i++){
        if (i+1 === files.length){filenames += files[i].name}
        else{filenames += files[i].name + ", "}
    }
    label.innerHTML = filenames;
}
