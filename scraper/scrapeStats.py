from selenium import webdriver 
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service 
import scrapeNames,csv
import os

#Setup env since this is multi OS project (Mac Os + Windows)
chrome_driver_path = os.getenv('CHROME_DRIVER_PATH')
options = Options()
options.add_argument("--start-maximized")

s = Service(executable_path=chrome_driver_path)
driver = webdriver.Chrome(options=options,service = s)
for name in scrapeNames.converted_names:
    url = "https://www.basketball-reference.com/players/{player[0]}/{player}/gamelog/2024".format(player=name)
    driver.get(url)
    driver.implicitly_wait(3)

    
    element = driver.find_element(By.XPATH,'/html/body/div[4]/div[5]/div[5]/div/div[1]/div/ul/li[1]/span')
    driver.execute_script("arguments[0].scrollIntoView();", element)
    driver.implicitly_wait(3)
    element.click()

    element = driver.find_element(By.XPATH,'/html/body/div[4]/div[5]/div[5]/div/div[1]/div/ul/li[1]/div/ul/li[3]/button')
    element.click()
    driver.implicitly_wait(3)


    elements = driver.find_element(By.ID,'csv_pgl_basic').get_attribute()
    driver.implicitly_wait(3)

    print(elements)
    # with open('{player}'.format(player=name), mode='w', newline='') as file:
    #     writer = csv.writer(file)
    #     for item in data:
    #         writer.writerow([item])


