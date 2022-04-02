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
    
}