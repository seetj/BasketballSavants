from basketball_reference_scraper.teams import get_roster, get_team_stats, get_opp_stats, get_roster_stats, get_team_misc
import unicodedata
rosterdf = get_roster(team="GSW",season_end_year=2024)
roster = rosterdf["PLAYER"].tolist()
#convert player name into curryst01 

def convert_names_to_string(names):
    suffixes = ["II", "III", "IV", "Jr.", "Sr."]  # List of common suffixes
    result = []
    
    for name in names:
        name_parts = name.split()
        first_name = name_parts[0]  
        last_name = name_parts[-1]  # Assume last part is the last name
        
        if last_name in suffixes:
            last_name = name_parts[-2]  # Take the second-to-last part if it's a suffix
        
        last_name = unicodedata.normalize('NFKD', last_name).encode('ascii', 'ignore').decode('utf-8')
        first_name = unicodedata.normalize('NFKD', first_name).encode('ascii', 'ignore').decode('utf-8')
        last_name_part = last_name[:5].lower()  # First 5 letters of the last name
        first_name_part = first_name[:2].lower()  # First 2 letters of the first name
        converted_name = last_name_part + first_name_part + "01"  # Combine and append "01"
        result.append(converted_name)
    return result
converted_names = convert_names_to_string(roster)
print(converted_names)
# for player in converted_names:
#     url = "https://www.basketball-reference.com/players/{player}/gamelog/2024".format(player=player)