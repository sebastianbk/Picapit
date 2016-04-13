var fs = require('fs');
var request = require('request');

function tagImages() {
    console.log('Started tagging...');
    
    var options = {
        url: 'https://api.projectoxford.ai/vision/v1.0/tag',
        headers: {
            'Ocp-Apim-Subscription-Key': '65e5a134a9b0484f94bd8577381f67b9',
            'Content-Type': 'application/octet-stream'
        },
        method: 'POST'
    };
    
    fs.readdir('./tmp/', function (err, files) {
        if (!err) {
            for (i = 0; i < files.length; i++) {
                var file = files[i];
                var stream = fs.createReadStream('./tmp/' + file);
                options["body"] = stream;
                
                request(options, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        var result = JSON.parse(body);
                        console.log(response);
                        var tagFileName = response.request.body.path + '.json';
                        fs.writeFile(tagFileName, body, function (error) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log("Tagged: " + response.request.body.path);
                            }
                        });
                    } else {
                        console.log(response);
                    }
                });
            }
        }
    });
}

tagImages();