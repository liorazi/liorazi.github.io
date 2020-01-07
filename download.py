import time
import os
# import urllib.request
# import requests
# from bs4 import BeautifulSoup
import pickle
from selenium import webdriver
from selenium.webdriver.firefox.firefox_binary import FirefoxBinary

def main():
    while True:
        check_for_new_file()
        time.sleep(30)

def save_cookies(requests_cookiejar, filename):
    with open(filename, 'wb') as f:
        pickle.dump(requests_cookiejar, f)

def load_cookies(filename):
    with open(filename, 'rb') as f:
        return pickle.load(f)

def check_for_new_file():
    print('Testing 1...2....3...')
    # GOOGLE_CHROME_BIN = '/app/.apt/usr/bin/google_chrome'
    # CHROMEDRIVER_PATH = '/app/.chromedriver/bin/chromedriver'
    file_directory = os.path.abspath('files')
    chrome_options = webdriver.ChromeOptions()
    chrome_options.add_argument('--disable-gpu')
    chrome_options.add_argument('--no-sandbox')
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--disable-dev-shm-usage')
    chrome_options.binary_location = os.environ.get("GOOGLE_CHROME_BIN")
    prefs = { "download.default_directory": file_directory }
    chrome_options.add_experimental_option('prefs', prefs)
    url = 'https://data.gov.il/dataset/rechev-tag-nachim/resource/c8b9f9c8-4612-4068-934f-d4acd2e3c06e/download/'
    #url = "https://www.google.com"
    # url = "https://liorazi.github.io/info.html"

    # browser = webdriver.Firefox(firefox_binary=FirefoxBinary())
    driver = webdriver.Chrome(executable_path=os.environ.get("CHROMEDRIVER_PATH"), chrome_options=chrome_options)
    driver.get(url)
    pickle.dump( driver.get_cookies() , open("cookies.pkl","wb"))
    # print(driver.page_source)
    # soup = BeautifulSoup(browser.page_source, 'html.parser')
    #
    # data = soup.select(".ft0 a")
    # ads = []
    #
    # for i in data:
    #     link = i.get('href')
    #     ads.append(link)
    #
    # for job in ads:
    #     print(job)
    #save cookies
    # print('Getting the cookies...')
    # r = requests.get(url)
    # filename = "cookie"
    # save_cookies(r.cookies, filename)
    #
    # #load cookies and do a request
    # print('Getting the file...')
    # r = requests.get(url, cookies=load_cookies(filename))
    # print(r.text)

    # url = "http://www.google.com/"
    # request = urllib.request.Request(url)
    # response = urllib.request.urlopen(request)
    # print (response.read().decode('utf-8'))

    # download = open("index.html", "w")
    # download.write(response.read())
    # download.close()

    # url = 'https://data.gov.il/dataset/rechev-tag-nachim/resource/c8b9f9c8-4612-4068-934f-d4acd2e3c06e/download/'
    # myfile = requests.get(url, allow_redirects=True)
    # print(myfile)

    # _ANO = '2013/'
    # _MES = '01/'
    # _MATERIAS = 'matematica/'
    # _CONTEXT = 'wp-content/uploads/' + _ANO + _MES
    # _URL = 'https://data.gov.il/dataset/rechev-tag-nachim/resource/c8b9f9c8-4612-4068-934f-d4acd2e3c06e/download/'
    #
    # # functional
    # r = requests.get(_URL)
    # soup = bs(r.text)
    # urls = []
    # names = []
    # for i, link in enumerate(soup.findAll('a')):
    #     _FULLURL = _URL + link.get('href')
    #     if _FULLURL.endswith('.csv'):
    #         urls.append(_FULLURL)
    #         names.append(soup.select('a')[i].attrs['href'])
    #
    # names_urls = zip(names, urls)
    #
    # for name, url in names_urls:
    #     print (url)
    #     rq = urllib2.Request(url)
    #     res = urllib2.urlopen(rq)
    #     csv = open(name)
    #     csv.write(res.read())
    #     csv.close()

if __name__== "__main__":
  main()
