const https = require('https');
const fs = require('fs');

const url = "https://raw.githubusercontent.com/shivammathur/hindi-fonts/master/Kruti%20Dev%20010.ttf";
const file = fs.createWriteStream("public/krutidev010.ttf");

https.get(url, function(response) {
  if (response.statusCode === 200) {
    response.pipe(file);
    file.on('finish', function() {
      file.close();
      console.log("Font downloaded successfully.");
    });
  } else {
    console.log("Failed to download font. Status code: " + response.statusCode);
  }
}).on('error', function(err) {
  fs.unlink("public/krutidev010.ttf", () => {});
  console.log("Error: " + err.message);
});
