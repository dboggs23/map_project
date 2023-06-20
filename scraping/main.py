from typing import TypedDict
from bs4 import BeautifulSoup
import requests
import js2py
import os
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support import expected_conditions as EC
import time
import sys
import numpy as np
import pandas as pd
import regex as re
import chromedriver_autoinstaller as chromedriver
import pyvirtualdisplay
import csv
import psycopg2
from dotenv import load_dotenv
import pprint
import datetime
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import urllib.parse
from models.models import Property, PropertyEvent 
import glob
from fake_useragent import UserAgent

load_dotenv()
dbname=os.environ.get("POSTGRES_DB")
user=os.environ.get("POSTGRES_USER")
password=urllib.parse.quote_plus(os.environ.get("POSTGRES_PW"))
host=os.environ.get("POSTGRES_HOST")
port=os.environ.get("POSTGRES_PORT")

connectionString = f'postgresql+psycopg2://{user}:{password}@{host}:{port}/{dbname}'

engine = create_engine(connectionString)

Session = sessionmaker(bind=engine)

def get_connection():
    try: 
        connection = psycopg2.connect(
            dbname=os.environ.get("POSTGRES_DB"),
            user=os.environ.get("POSTGRES_USER"),
            password=os.environ.get("POSTGRES_PW"),
            host=os.environ.get("POSTGRES_HOST"),
            port=os.environ.get("POSTGRES_PORT")
        )   
        return connection
    except:
        print('database connection error')


def getProxies():
    
    u=list()

    url="https://www.proxynova.com/proxy-server-list"
    respo = requests.get(url).text

    soup = BeautifulSoup(respo,'html.parser')

    allproxy = soup.find_all("tr")

    for proxy in allproxy:
        l={}
        foo = proxy.find_all("script")
        try:
            l["ip"] = js2py.eval_js(foo[0].text.replace("document.write(", "")[:-1])
        except:
            l["ip"]=None 
        

        try:
            l["port"]=proxy.find_all('td')[1].a.text.strip()
        except:
            l["port"]=None 

        try:
            l["country"]=foo[5].text.replace("\n","").replace(" ","")
        except:
            l["country"]=None 
            
        if((l.get("ip") is not None) and (l.get("port") is not None)):
            u.append(l)
    print(u)

def initDriver():
    try:
        chromeDriverPath = 'C:\ChromeDriver\chromedriver.exe'
        service = Service(chromeDriverPath)
        ua = UserAgent(browsers=['chrome'])
        user_agent = ua

        download_dir = os.path.join(os.getcwd(), 'scraping\download_results')
        options = Options()
        caps = DesiredCapabilities().CHROME
        caps["pageLoadStrategy"] = "eager"
        #options.headless = True
        options.add_experimental_option('prefs',  {
            "download.default_directory": download_dir,
            "download.prompt_for_download": False,
            "download.directory_upgrade": True,
            "plugins.always_open_pdf_externally": True,
            "profile.managed_default_content_settings.images": 2
            }
        )
        options.add_argument('--ignore-certificate-errors')
        options.add_argument('--ignore-ssl-errors')
        options.add_experimental_option('excludeSwitches', ['disable-component-update',
                                                            'ignore-certificate-errors'])
        #options.add_argument('--headless')
        options.add_argument(f"user-agent={user_agent}")
        #options.add_argument('--blink-settings=imagesEnabled=false')
        #service=Service(ChromeDriverManager(version='113.0.5672.127').install())
        driver = webdriver.Chrome(service=service, options=options, desired_capabilities=caps)
        time.sleep(2)
        return driver
    except:
        print('error starting driver')

def openPageWithDriver(driver, url):
    driver.get(url)
    
    return driver

def getSoupFromDriver(driver):
    soup = BeautifulSoup(driver.page_source, 'html.parser')
    return soup

def downloadRedfinZipcodePageData(driverWithPageLocation):
    driver = driverWithPageLocation
    
    try: 
        wait = WebDriverWait(driver, 10)
        wait.until(EC.visibility_of_element_located((By.ID, 'download-and-save')))
        clickable = driver.find_element(By.ID, "download-and-save")
        time.sleep(2)
        clickable.click()
        time.sleep(5)
        driver.close()
    except Exception as e:
        print("Error downloading redfin zipcode page data: ", e)


def zip_codes_by_county():
    zipCodes = []
    with open('Missouri_Zip_Codes_by_County_City.csv') as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')

        line_count = 0
        for row in csv_reader:
            if line_count > 0:
                zipCodes.append(row[1])
            line_count += 1
    return zipCodes

def get_properties_file_path():
    path = os.path.join(os.getcwd(), 'scraping\download_results\*')
    list_of_files = glob.glob(path)
    latest_file = max(list_of_files)
    return latest_file
    #files = [f for f in os.listdir(path) if os.path.isfile(os.path.join(path, f))]
    #try:
    #    return path + "\\" + files[0]
    #except:
    #    return 'error'
    
#   {
#        'properties': [{url: str, price: int, address: str, zip_code: int}],
#        'columns': [columnNames]
#    }
#   
def get_info_from_property_file(propertyFile):
    propertyArr = []
    columnNames = []
    with open(propertyFile) as csv_file:
        csv_reader = csv.reader(csv_file, delimiter=',')
        line_count = 0
        
        for row in csv_reader:
            if line_count > 0:
                propertyInfo = {}
                propertyInfo['address'] = row[3]
                propertyInfo['zip_code'] = row[6]
                propertyInfo['price'] = row[7]
                propertyInfo['city'] = row[4]
                propertyInfo['state'] = row[5]
                propertyInfo['beds'] = row[8]
                propertyInfo['baths'] = row[9]
                propertyInfo['location'] = row[10]
                propertyInfo['squareFootage'] = row[11]
                propertyInfo['lotSize'] = row[12]
                propertyInfo['yearBuilt'] = row[13]
                propertyInfo['latitude'] = row[25]
                propertyInfo['longitude'] = row[26]
                propertyInfo['url'] = row[20]
                
                propertyArr.append(propertyInfo)
            else:
                columnNames.append(row)
            line_count += 1
    return {
        'properties': propertyArr,
        'columns': columnNames
    }


#input -> full property row from excel file
def check_for_property_and_handle(singleProperty):
    '''
        1. check if property exists
            a. if exists, check if price has changed 
            b. if price has changed, insert new price 
        
        2. if doesn't exist, grab data from page
            a. create record in property table
            b. with same ID, create record(s) of price in price table
            c. open_details_page_and_scrape()
        3. There are going to need to be some checks for if a house was previously
            on the market but there isn't a "sold" entry. If a house is sold it's obviously 
            not going to show up in the current for sale listings so the sale price needs
            to be checked somehow
    '''
    session = Session()
    # join property on most recent price 
    results = session.query(Property, PropertyEvent)\
        .join(PropertyEvent, Property.id == PropertyEvent.propertyId)\
        .filter(Property.address==singleProperty['address'])\
        .all()
    
    # if the property exists in the db
    if(len(results) > 0):
        price = results[0][1].price
        #if exists, check and update if price has changed 
        if(price != singleProperty['price']):
            existingPropertyId = results[0][0].id
            propertyEvent = PropertyEvent(
                date = datetime.date.today(),
                price = int(singleProperty['price']),
                propertyId = existingPropertyId
            )
            session.add(propertyEvent)
            session.commit()

    else:
        newProperty = Property(
            address = singleProperty['address'],
            city = singleProperty['city'],
            state = singleProperty['state'],
            zipcode = int(singleProperty['zip_code']), 
            beds = 0 if singleProperty['beds'] == '' else int(singleProperty['beds']),
            baths = 0 if singleProperty['baths'] == '' else float(singleProperty['baths']),
            location = singleProperty['location'],
            squareFootage = 0 if singleProperty['squareFootage'] == '' else int(singleProperty['squareFootage']), 
            lotSize = 0 if singleProperty['lotSize'] == '' else int(singleProperty['lotSize']), 
            yearBuilt = 0 if singleProperty['yearBuilt'] == '' else int(singleProperty['yearBuilt']), 
            url = singleProperty['url'], 
            latitude = float(singleProperty['latitude']),
            longitude = float(singleProperty['longitude']),
        )
        propertyEvent = PropertyEvent(
            date = datetime.date.today(),
            price = int(singleProperty['price']),
            status = 'active'
        )
        newProperty.prices.append(propertyEvent)
        session.add(newProperty)
        session.commit() 

        # boolean for if I want to scrape details page for property 
        if(True and singleProperty['url'] != ''):
            print('opening details page')
            propertyEntry = session.query(Property).filter(Property.address==singleProperty['address']).one()
            events = open_details_page_and_scrape(singleProperty['url'])
            propertyEventObjects = []
            for event in events:
                event['propertyId'] = propertyEntry.id
            for event in events:
                #{'date': '2009-11-30 00:00:00', 'status': 'sold', 'price': '180000', 'propertyId': 656}
                propertyEventObjects.append(PropertyEvent(
                    date=event['date'],
                    status=event['status'],
                    price=event['price'],
                    propertyId=event['propertyId']
                ))
                print(event)
            if len(events) > 0:
                try:
                    session.bulk_save_objects(propertyEventObjects)
                    session.commit()
                except Exception as e:
                    print(e)

    

#{date, status, price}
def formatTimelineActivity(timelineActivity): 
    statusTypes = ['sold', 'listed', 'price changed']

    try:
        formattedDate = datetime.datetime.strptime(timelineActivity['date'], "%B %d, %Y").strftime('%Y-%m-%d %H:%M:%S')
    except: 
        formattedDate = datetime.datetime.strptime(timelineActivity['date'], "%b %d, %Y").strftime('%Y-%m-%d %H:%M:%S')

    timelineActivity['date'] = formattedDate

    for status in statusTypes:
        try:
            activityStatus = str(timelineActivity['status'])
            if activityStatus.lower().find(status) >= 0:
                timelineActivity['status'] = status
                break
            
        except:
            continue

    if(timelineActivity['status'] not in statusTypes):
        timelineActivity['status'] = None
    
    
    price = timelineActivity['price'].split(' ')[0].replace('$', '').replace(',', '')

    if (price.isdigit()):
        timelineActivity['price'] = price
    else:
        timelineActivity['price'] = None

    return timelineActivity
    

def open_details_page_and_scrape(url):

    records = []
    #record: {
    #  date,
    #  price,
    #  status   
    # }
    print('opening page now')
    driver = initDriver()
    #driver.set_page_load_timeout(30)
    time.sleep(2)
    print('driver started')
    driver.get(url)
    time.sleep(3)
    print('going to try to find click element')

    driver.execute_script("window.scrollTo(0,document.body.scrollHeight)")


    #WebDriverWait(driver, 30).until(lambda d: d.execute_script("return document.readyState") == "complete")
    
    try:
        print('done waiting, looking now for clickable')
        #driver.implicitly_wait(3)
        wait = WebDriverWait(driver, 3)
        #! scroll halfway down the page 
        wait.until(EC.visibility_of_element_located((By.XPATH, '//*[@id="propertyHistory-expandable-segment"]/div[2]/div/button')))
        clickable = driver.find_element(By.XPATH, '//*[@id="propertyHistory-expandable-segment"]/div[2]/div/button')
        print('found clickable')
        time.sleep(1)
        clickable.click()
            
    except:
        print('no clickable element')
    finally:
        
        

        time.sleep(2)
        soup = getSoupFromDriver(driver)
        # check if there's a date AND price 
        # check if status is listed, sold, or price changed 


        propertyHistoryContainer = soup.select('.property-history-content-container')
        print('property history container found: ',len(propertyHistoryContainer))

        for propertyHistory in propertyHistoryContainer:
            eventRows = propertyHistory.select('.PropertyHistoryEventRow')
            for eventRow in eventRows:
                timelineActivity = {}
                date = eventRow.select_one("div:nth-of-type(1) div p").text
                status = eventRow.select_one(".description-col > div").text
                price = eventRow.select_one(".price-col").text

                timelineActivity['date'] = date
                timelineActivity['status'] = status
                timelineActivity['price'] = price

                records.append(formatTimelineActivity(timelineActivity))
        time.sleep(1)
        
        driver.quit()
        
        return records
    
def page_has_loaded(driver):
    page_state = driver.execute_script('return document.readyState;')
    return page_state == 'complete'

def executeQueryAndReturnData(query):
    try:
        conn = get_connection()
        cursor = conn.cursor()
        cursor.execute(query)
        data = cursor.fetchall()
        conn.close()
        return data
    except:
        print(f'Error at query: {query}')

def executePostAndReturnSuccess(query, params):
    return True

def scrapingMain():
    
    #countyZipCodes = zip_codes_by_county()
    # for testing 
    countyZipCodes = [63104, 63139,63116, 63110, 63109, 63117, 63143,63118,63108,63112,63113,63106,63107,63115,63120,63147,63102,63101,63143,63144,63117,63105,63130,63133,63121,63114,63132,63124, 63122,63131,63119,63123]
    for zipCode in countyZipCodes:
        driver = initDriver()
        url = f"https://www.redfin.com/zipcode/{zipCode}"
        zipCodePage = openPageWithDriver(driver, url)
        downloadRedfinZipcodePageData(zipCodePage)
        driver.quit()
        filePath = get_properties_file_path()
        propertyInfo = get_info_from_property_file(filePath)

        for singleProperty in propertyInfo['properties']:
            try:
                check_for_property_and_handle(singleProperty)
            except Exception as e:
                print('error at check for property and handle',e)

def getFromLocalFileManually():
    propertyInfo = get_info_from_property_file(get_properties_file_path())
    print('got property info')
    for singleProperty in propertyInfo['properties']:
        try:
            check_for_property_and_handle(singleProperty)
        except Exception as e:
            print(e)
    


        
#TODO: make a script / function that processes all properties put in the db on the previous day
if __name__ == "__main__":
    #driver = initDriver()
    #driver = openPageWithDriver(driver, url)
    #downloadRedfinZipcodePageData(driver, 63109)
    #print(collectPropertiesOnZipcodePage(driver))  
    #print(get_info_from_property_file(get_properties_file_path())  )
    #open_details_page_and_scrape('https://www.redfin.com/MO/Saint-Louis/5433-Murdoch-Ave-63109/home/62764636')
    #mystring = str('Sold(Public Records)Public Record')
    #print(mystring.lower().find('Sold'))

    #filePath = get_properties_file_path()
    #propertyInfo = get_info_from_property_file(filePath)
    ##check_for_property_and_handle(propertyInfo['properties'][5], propertyInfo['columns'])
    #scrapingMain()

    #getFromLocalFileManually()
    scrapingMain()


