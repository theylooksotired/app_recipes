const fs = require('fs');
const fetch = require('node-fetch');
const exec = require('child_process').exec;
const argv = require('minimist')(process.argv.slice(2));


// APP id: 3302785
// ANDROID KEY
// pgb unlock android 132896
// pgb clone 3302785 && pgb download 3302785 android

let apps = [{country: 'argentina', url: 'https://www.recetas-argentinas.com/json-phonegap'},
			{country: 'uruguay', url: 'https://www.cocina-uruguaya.com/json-phonegap'},
            {country: 'colombia', url: 'https://www.cocina-colombiana.com/json-phonegap'}];

let app = {};
for (let i=0; i < apps.length; i++) {
    if (apps[i].country == argv.c || apps[i].country == argv.country) {
        app = apps[i];
    }
}

if (app.country) {
	let urlFetch = app.url;
    fetch(urlFetch , {
            method: 'GET',
            headers: {
                'Authorization': 'plastic',
                'Content-Type': 'application/json'
            }
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(json){
            // Save the db file
            fs.writeFile('src/db/db.json', JSON.stringify(json, null, 2), 'utf8', function (err) {
                if (err) return console.log(err);
            });
            console.log('===============');
            console.log('===============');
            console.log('Saved JSON');
            // Save the config xml file
            fs.readFile('config_base.xml', 'utf8', function (err,data) {
                if (err) return console.log(err);
                let result = data;
                result = result.replace(/APP_TITLE/g, json.site.title);
                result = result.replace(/APP_DESCRIPTION/g, json.site.description);
                result = result.replace(/APP_VERSION/g, '4.0.8');
                result = result.replace(/APP_ID/g, json.site.id);
                fs.writeFile('config.xml', result, 'utf8', function (err) {
                    if (err) return console.log(err);
                });
                console.log('===============');
                console.log('===============');
                console.log('SAVED');
            });
            // Build the app
            exec('npm run build', function(err, stdout, stderr) {
                if (err) return console.log(err);
                else console.log(stdout);
                console.log('===============');
                console.log('===============');
                console.log('BUILT');
                exec('git add -A && git commit -m "New version" && git push origin master', function(err, stdout, stderr) {
                    if (err) return console.log(err);
                    else console.log(stdout);
                    console.log('===============');
                    console.log('===============');
                    console.log('UPLOADED TO GIT');
                    /*
                    exec('pgb clone 3302785 && pgb download 3302785 android releases/', function(err, stdout, stderr) {
                        if (err) return console.log(err);
                        else console.log(stdout);
                        console.log('===============');
                        console.log('===============');
                        console.log('SAVED THE BUILT VERSION');
                    });
                    */
                });
            });
        });
}