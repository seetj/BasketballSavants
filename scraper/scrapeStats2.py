from bs4 import BeautifulSoup
import csv,scrapeNames,requests

headers = {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'}

for name in scrapeNames.converted_names:
    url = "https://www.basketball-reference.com/players/{player[0]}/{player}/gamelog/2024".format(player=name)
    response = requests.get(url,headers=headers)
    content = response.content
    soup = BeautifulSoup(content,'html.parser')
    print(content)