// puppeteer-extra is a drop-in replacement for puppeteer,
// it augments the installed puppeteer with plugin functionality
const puppeteer = require('puppeteer-extra')
const request = require('request');
const fs = require('fs');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
puppeteer.use(StealthPlugin())
let url = 'https://data.gov.il/dataset/11369651-1c70-4d8f-8090-ee49354a7c52/resource/c8b9f9c8-4612-4068-934f-d4acd2e3c06e/download/rechev_nachimmot.gov.il.csv'
var cookiez;
var rbzid;
var userAgent;

puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'], headless: true }).then(async browser => {
  const page = await browser.newPage()

  await page.goto(url)
  userAgent = await page.evaluate('navigator.userAgent');
  console.log(userAgent)
  await page.waitFor(2000)
  // Here we can get all of the cookies
  saveCookie(await page._client.send('Network.getAllCookies'));
  await browser.close()
  console.log(`Finished with browser...`)
}).then(async file => {
  console.log('Downloading file.....')
  downloadFile(rbzid)
})

function saveCookie(theCookie) {
  cookiez = theCookie;
  for (var i=0; i<cookiez["cookies"].length;i++) {
    if (cookiez["cookies"][i].name == "rbzid") {
      value = cookiez["cookies"][i].value
      prefix = 'rbzid='
      rbzid = prefix.concat(value)
      console.log("key: rbzid, value:"+rbzid)
      console.log("userAgent = "+userAgent);
    }
  }
}

async function downloadFile(cookie) {
  /* Create an empty file where we can save data */
  let file = fs.createWriteStream(`content.csv`);
  /* Using Promises so that we can use the ASYNC AWAIT syntax */

  await new Promise((resolve, reject) => {
      let stream = request({
          /* Here you should specify the exact link to the file you are trying to download */
          uri: url,
          headers: {
              'Cookie': cookie,
			        'Host': 'data.gov.il',
			        'cache-control': 'no-cache',
			        'upgrade-insecure-requests': '1',
              'user-agent' : userAgent,
			        'accept-language': 'en-US,en;q=0.9',
			        'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
			        'sec-fetch-site': 'same-origin',
			        'sec-fetch-mode': 'navigate',
			        'referer': 'https://data.gov.il/dataset/11369651-1c70-4d8f-8090-ee49354a7c52/resource/c8b9f9c8-4612-4068-934f-d4acd2e3c06e/download/rechev_nachimmot.gov.il.csv',
			        'pragma': 'no-cache'
          },
          jar : true,
          /* GZIP true for most of the websites now, disable it if you don't need it */
          gzip: true
      }, callback) //added callback here, so we'll be able to receive the csv body as string
      // .pipe(file) //removed pipe(file) because we dont want to save it to a file
      .on('finish', () => {
          console.log(`The file is finished downloading.`);
          resolve();
      })
      .on('error', (error) => {
          reject(error);
      })
  })
  .catch(error => {
      console.log(`Something happened: ${error}`);
  });

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      //check that the content type is text/csv or return
      var type = response.headers['content-type']
      // if (type != 'text/csv') {
      //   console.log("The file downloaded is not CSV! Exiting...")
      //   return;
      // }

      let buff = Buffer.from(body);
      var replacedString = buff.toString().replace(/\|/g, '\,');
      let newBuff = Buffer.from(replacedString, 'utf8');
      let base64data = newBuff.toString('base64');

      lior_url = "https://api.github.com/repos/liorazi/liorazi.github.io/contents"
      lior_token = process.env.LIOR_TOKEN
      lior_email = "lior.azi@gmail.com"
      lior_file_path = "tags.csv"
      lior_message = "Heroku: Update Tags CSV"

      amit_url = "https://api.github.com/repos/amitmdev/amitmdev.github.io/contents"
      amit_token = process.env.AMIT_TOKEN
      amit_email = "amitmdev@gmail.com"
      amit_file_path = "data.csv"
      amit_message = "Heroku: Update Tags CSV"

      uploadCSV(base64data, lior_url, lior_file_path, lior_email, lior_message, lior_token);
      uploadCSV(base64data, amit_url, amit_file_path, amit_email, amit_message, amit_token);
    }
  }

  function uploadCSV(encodedCSV, url, filePath, email, message, token) {
    console.log("Getting sha for file...");
    var headers = {
      'Content-type': 'application/vnd.github.v3+json',
      'User-Agent': "tagnehe",
      'Authorization': "token " + token
    };
    var options = {
      method: 'GET',
      headers: headers
    };

    request(url, options, function (error, response, body) {
      var sha = "";
      var body = response["body"];
      var jsonObject = JSON.parse(body);
      for (var i = 0, len = jsonObject.length; i < len; i++) {
        if (jsonObject[i] == filePath) {
          sha = jsonObject[i]
          console.log("sha is " + sha)
        }
      }
      // jsonObject.forEach(function (arrayItem) {
      //   if (arrayItem["path"] == filePath) {
      //     sha = arrayItem["sha"]
      //     console.log("sha is " + sha)
      //   }
      // });
     if (sha == undefined || sha == "") {
       console.log("No SHA found, exiting...");
       return;
     }

     console.log("Commiting csv to repo...");
     var data = {
       "message": message,
       "content": encodedCSV,
       "committer": {"name": "Heroku","email": email},
       "sha": sha
     }

     var options = {
       method: 'PUT',
       headers: headers,
       body: JSON.stringify(data),
     };

     request("" + url + "/" + filePath, options, function (error, response, body) {
       console.log(body)
     });
    });
  }
}
