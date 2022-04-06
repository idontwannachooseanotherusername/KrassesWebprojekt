function challenge_all(){    
    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/all',
        method: 'get',
        dataType: 'json'
    }).done(function (response) {
        console.log('Response:');
        console.log(response);
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

            console.log('Appended everything:'); 
            console.log(challenge)

            // add to link-wrapper and to wrapper
            link.appendChild(challenge);
            wrapper.appendChild(link);

            console.log('Final wrapper: ' + wrapper)
        }
    }).fail(function (jqXHR, statusText, error) {
        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        $('#output').html('Ein Fehler ist aufgetreten');
    });
}
function challenge_id(){
    var items = location.search.substr(1).split("&");
        for (var index = 0; index < items.length; index++) {
            tmp = items[index].split("=");
            if (tmp[0] === 'id')
                var challengeid = decodeURIComponent(tmp[1]);
                break;
        }

    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/get/' + challengeid,
        method: 'get',
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
        }

        // challenge body
        var challenge = document.getElementsByClassName("challenge-information")[0];
        var description = document.createElement("div");
        description.className = "challenge-text";
        description.innerHTML = response.daten.description;
        challenge.prepend(description);
        // TODO: Files!


    }).fail(function (jqXHR, statusText, error) {
        //console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        //$('#output').html('Ein Fehler ist aufgetreten');

        var site = document.getElementsByClassName("challenge-site")[0];
        var error = document.createElement("div");
        error.style = "position: absolute; height: 100%; width: 100%; z-index: 1000;";
        var text = document.createElement("p");
        text.style = "position: sticky; margin-left: auto; margin-right: auto; left: 0; right: 0; text-align: center; top: 50%; font-size: 1.2em; color: red;";
        text.innerHTML = "This challenge does not exist!";
        error.appendChild(text);
        site.style.filter = "blur(5px)";
        site.parentNode.prepend(error);
    });
}

function check_hints(){
    // Get challenge id
    var items = location.search.substr(1).split("&");
    for (var index = 0; index < items.length; index++) {
        tmp = items[index].split("=");
        if (tmp[0] === 'id')
            var challengeid = decodeURIComponent(tmp[1]);
            break;
    }
    $.ajax({
        url: 'http://localhost:8001/wba2api/hint/check/' + challengeid,
        method: 'get',
        dataType: 'json'
    }).done(function (response) {    
        var unavailable = document.getElementsByClassName("hint-unavailable");
        var texts = document.getElementsByClassName("hint-text");
        for (let e in response.daten){
            texts[response.daten[e].Class - 1].innerHTML = "Voluptatem maiores amet quae. Aliquid quia ut exercitationem voluptatibus ut. Iure aut velit nisi.";
            unavailable[response.daten[e].Class - 1].innerHTML = "";
        }

    }).fail(function (jqXHR, statusText, error) {
        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        alert.html('Ein Fehler ist aufgetreten');
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
                var items = location.search.substr(1).split("&");
                for (var index = 0; index < items.length; index++) {
                    tmp = items[index].split("=");
                    if (tmp[0] === 'id')
                        var challengeid = decodeURIComponent(tmp[1]);
                        break;
                }
                $.ajax({
                    url: 'http://localhost:8001/wba2api/hint/get-from-challenge/' + id + '/' + challengeid,
                    method: 'get',
                    dataType: 'json'
                }).done(function (response) {
                    console.log(response);
                    hint.lastChild.remove();
                    text.innerHTML = response.daten.description;;
                }).fail(function (jqXHR, statusText, error) {
                    console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
                    alert.html('Ein Fehler ist aufgetreten');
                });
            }
        }
    }
}

function load_profile(id){
    $.ajax({
        url: 'http://localhost:8001/wba2api/user/get/' + id,
        method: 'get',
        dataType: 'json'
    }).done(function (response) {
        console.log(response);
        $(".user-name").html(response.daten.username);
        $('#profile-description').html(response.daten.bio);
        $('#profile-country').html(response.daten.country);
        $('#profile-points').html(response.daten.points);

        // solved and created challenges
        var solved = document.getElementById("profile-solved");
        var created = document.getElementById("profile-created");
        for (var i = 0; i < response.daten.solved.length; i++){
            var li = document.createElement("li");
            var a = document.createElement("a");
            a.href = "challenge.html";
            a.innerHTML = '(' + response.daten.solved[i].challengeid + ') ' + response.daten.solved[i].challengename;
            li.appendChild(a);
            solved.appendChild(li);

            var li2 = document.createElement("li");
            var a2 = document.createElement("a");
            a2.href = "challenge.html";
            a2.innerHTML = '(' + response.daten.created[i].challengeid + ') ' + response.daten.created[i].challengename;
            li2.appendChild(a2);
            created.appendChild(li2);
        }  
    }).fail(function (jqXHR, statusText, error) {
        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        alert.html('Ein Fehler ist aufgetreten');
    });
}