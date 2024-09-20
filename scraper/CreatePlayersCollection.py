from pymongo import MongoClient
from dotenv import load_dotenv
import os, math



load_dotenv('BasketballSavants/server/config.env')
atlas_uri = os.getenv('ATLAS_URI')
client = MongoClient(atlas_uri)
db = client['BoxScores_2023'] 

boxscore_collection = db['all_boxscores']
players_collection = db['players_22-23']

# This creates an index on the _id field (player name)
players_collection.create_index([("_id", 1)])  



def safe_int(value):
    try:
        return int(value)
    except (ValueError, TypeError):
        return 0  # Fallback value if stat is Nan

def safe_float(value):
    try:
        return float(value)
    except (ValueError, TypeError):
        return 0.0  

def extract_player_stats(player):
    return {
        "MP": player["MP"],
        "FG": safe_int(player.get("FG", 0)),
        "FGA": safe_int(player.get("FGA", 0)),
        "3P": safe_int(player.get("3P", 0)),
        "3PA": safe_int(player.get("3PA", 0)),
        "PTS": safe_int(player.get("PTS", 0)),
        "AST": safe_int(player.get("AST", 0)),
        "REB": safe_int(player.get("TRB", 0)),
        "DRB": safe_int(player.get("DRB", 0)),
        "ORB": safe_int(player.get("ORB", 0)),
        "TOV": safe_int(player.get("TOV", 0)),
        "STL": safe_int(player.get("STL", 0)),
        "BLK": safe_int(player.get("BLK", 0)),
        "GMSC": safe_float(player.get("GmSc", 0)),
        "PluMin": safe_int(player.get("+/-", 0)),
        # can add additional fields as necessary
    }


def update_player_stats(players_collection, player_name, game_date, opponent, location, player_stats, team):
    """
    Updates players based on boxscores in databse, for 2023 season this is fine but eventually for 2024-2025 
    we need to filter by todays date and only scrape for games from the current date forward. 
    Also we'll need a bot to automate this function being calle d everyday
    """
    # update player's document in the 'players' collection by using the schema below
    players_collection.update_one(
        {"_id": player_name},
        {
            "$set": {"name": player_name},
            "$push": {
                "games_played": {
                    "date": game_date,
                    "opponent": opponent,
                    "location": location, 
                    "team": team,
                    "stats": player_stats
                }
            },
            "$inc": {
                "aggregated_stats.total_points": player_stats["PTS"],
                "aggregated_stats.total_assists": player_stats["AST"],
                "aggregated_stats.total_rebounds": player_stats["REB"],
                "aggregated_stats.total_rebounds": player_stats["STL"],
                "aggregated_stats.total_rebounds": player_stats["BLK"],
                "aggregated_stats.total_rebounds": player_stats["TOV"],
                "aggregated_stats.total_rebounds": player_stats["3P"],
            }
        },
        upsert=True
    )

# Loop through each game in the boxscore 2023 collection
for game in boxscore_collection.find():
    game_date = game["date"]

    print("processing game for ", game["home"], "vs ", game["visitor"], "\n")
    
    # Process both teams
    for team in ["visitor", "home"]:
        opponent_team = game["home"] if team == "visitor" else game["visitor"]
        location = "away" if team == "visitor" else "home"  # Determine if the game was home or away
        team_name = game[team]
        
        # Loop through the players in the box score
        for player in game["box_score"][game[team]]:
            player_name = player["PLAYER"]
            player_stats = extract_player_stats(player)
            
            # Update or insert player stats in the players collection
            update_player_stats(players_collection, player_name, game_date, opponent_team, location, player_stats, team_name)
