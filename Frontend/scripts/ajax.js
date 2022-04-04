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
            link.href = "challenge.html";
            console.log('Created link:');
            console.log(link);
            
            // challenge wrapper
            let challenge = document.createElement("div");
            challenge.className = "challenge";
            console.log("Created wrapper:");
            console.log(wrapper);

            // challenge color
            let color = document.createElement("div");
            color.className = `challenge-color level-${response.daten[i].difficulty}`;
            let p = document.createElement("p");
            p.innerHTML = `${response.daten[i].difficulty}`;
            
            color.appendChild(p);
            challenge.appendChild(color);
            console.log("Created color:")
            console.log(challenge)

            // challenge image
            let image = document.createElement("img");
            image.className = "challenge-picture img-border";
            image.src = "images/BasicProfile.png";

            challenge.appendChild(image);
            console.log('Created image:');
            console.log(image);

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
function challenge_id(id){
    $.ajax({
        url: 'http://localhost:8001/wba2api/challenge/get/' + id,
        method: 'get',
        dataType: 'json'
    }).done(function (response) {
        console.log('Response:');
        console.log(response);

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
        // TODO: Load tags in simple for loop

        // challenge body
        var challenge = document.getElementsByClassName("challenge-text")[0];
        var description = document.createElement("div");
        description.className = "challenge-text";
        description.innerHTML = response.daten.description;
        challenge.appendChild(description);
        // TODO: Files!


    }).fail(function (jqXHR, statusText, error) {
        console.log('Response Code: ' + jqXHR.status + ' - Fehlermeldung: ' + jqXHR.responseText);
        $('#output').html('Ein Fehler ist aufgetreten');
    });
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