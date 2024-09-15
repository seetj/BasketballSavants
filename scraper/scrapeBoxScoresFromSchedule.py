import pandas as pd
import json, time, os
from basketball_reference_scraper.box_scores import get_box_scores
from pymongo import MongoClient
from dotenv import load_dotenv


# load environment variable for config.env to setup Mongodb Client URI
load_dotenv('BasketballSavants/server/config.env')
atlas_uri = os.getenv('ATLAS_URI')
client = MongoClient(atlas_uri)
db = client['BoxScores_2023'] 
collection = db['all_boxscores']

df = pd.read_csv('BasketballSavants/scraper/nba_schedule_2023.csv')
print(df)

#test on single boxscore and row
# row = df.iloc[6]
# box_score = get_box_scores(row['DATE'], row['VISITOR_ACRONYM'], row['HOME_ACRONYM'], period='GAME', stat_type='BASIC')
# print(box_score)

counter = 0
all_box_scores = []

for index, row in df.iterrows():
    date = row['DATE']
    visitor = row['VISITOR_ACRONYM']
    home = row['HOME_ACRONYM']
    
    # gets the box score for the current game
    #box_score = get_box_scores(date, visitor, home, period='GAME', stat_type='BASIC')
    


    # Retry mechanism with backoff strategy
    retries = 3
    wait_times = [10, 30, 60]  # Backoff strategy: increasing wait times between retries
    for attempt in range(retries):
        try:
            box_score = get_box_scores(date, visitor, home, period='GAME', stat_type='BASIC')
            break  # If successful, exit retry loop
        except ConnectionError:
            print(f"Attempt {attempt+1} failed for {visitor} vs {home} on {date}. Retrying in {wait_times[attempt]} seconds...")
            time.sleep(wait_times[attempt])  # Wait before retrying
    else:
        print(f"Failed to retrieve box score for {visitor} vs {home} on {date} after {retries} attempts.")
        continue  # Skip to the next game if all retries failed

    # Add delay after every 5 successful requests
    if (index + 1) % 5 == 0:
        print("Waiting for 60 seconds to avoid rate limiting...")
        time.sleep(60)  # Wait for 1 minute after every 5 games

    # Add base delay between requests
    time.sleep(5)  # Small delay between requests
    
    # stores in python dict & json format
    # converts Pandas DataFrames in the box_score dict to JSON-serializable dictionaries, from my helpful friend at openai
    game_box_score = {
        'date': date,
        'visitor': visitor,
        'home': home,
        'box_score': {
            visitor: box_score[visitor].to_dict(orient='records'),  
            home: box_score[home].to_dict(orient='records')         
        }
    }
    
    # all_box_scores.append(game_box_score) uncomment to make json file
    collection.insert_one(game_box_score)
        
    counter += 1
    
    # if counter % 5 == 0:
    #     time.sleep(300)
    # time.sleep(5)

    print("Number of boxscores processed", counter)


# with open('box_scores.json', 'w') as f:
#     json.dump(all_box_scores, f, indent=4)

# print("Box scores saved to 'box_scores.json'.")
print(f"Box scores saved to Mongodb collection ")
