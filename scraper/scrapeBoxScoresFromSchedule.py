import pandas as pd
import json
from basketball_reference_scraper.box_scores import get_box_scores

df = pd.read_csv('BasketballSavants\scraper\nba_schedule_2023.csv')
print(df.head())


# counter = 5
# all_box_scores = []

# for index, row in df.iterrows():
#     date = row['DATE']
#     visitor = row['VISITOR_ACRONYM']
#     home = row['HOME_ACRONYM']
    
#     # gets the box score for the current game
#     box_score = get_box_scores(date, visitor, home, period='GAME', stat_type='BASIC')
    
#     # stores in python dict & json format
#     game_box_score = {
#         'date': date,
#         'visitor': visitor,
#         'home': home,
#         'box_score': box_score
#     }
    
#     all_box_scores.append(game_box_score)
        
#     counter += 1
    
#     if counter == 5:
#         break


# with open('box_scores.json', 'w') as f:
#     json.dump(all_box_scores, f, indent=4)

# print("Box scores saved to 'box_scores.json'.")
