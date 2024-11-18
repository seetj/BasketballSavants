import pandas as pd
import json
import time
import os
from basketball_reference_scraper.box_scores import get_box_scores
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime,date,timedelta
from typing import Dict, List, Optional
import logging


class BoxScoreScraper:
    def __init__(self, schedule_path: str, env_path: str):
        # Setup logging
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('scraper.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)
        
        # Load environment variables and initialize MongoDB
        self._setup_mongodb(env_path)
        print(env_path)
        
        # Load schedule data
        self.schedule_df = self._load_schedule(schedule_path)
        
        # Configure retry parameters
        self.retry_attempts = 3
        self.wait_times = [10, 30, 60]  # seconds
        self.base_delay = 5  # seconds between requests
        
    def _setup_mongodb(self, env_path: str) -> None:
        """Initialize MongoDB connection"""
        load_dotenv(env_path)
        atlas_uri = os.getenv("ATLAS_URI")
        if not atlas_uri:
            raise ValueError("ATLAS_URI not found in environment variables")
        
        self.client = MongoClient(atlas_uri)
        self.db = self.client["BoxScores_2023"]
        self.collection = self.db["all_boxscores"]
        
    def _load_schedule(self, path: str) -> pd.DataFrame:
        """Load and validate schedule data"""
        if not os.path.exists(path):
            raise FileNotFoundError(f"Schedule file not found: {path}")
        return pd.read_csv(path)
    
    def _get_box_score_with_retry(self, date: str, visitor: str, home: str) -> Optional[Dict]:
        """Attempt to get box score with retry mechanism"""
        for attempt in range(self.retry_attempts):
            try:
                box_score = get_box_scores(
                    date, visitor, home, period="GAME", stat_type="BASIC"
                )
                return box_score
            except Exception as e:
                self.logger.warning(
                    f"Attempt {attempt+1} failed for {visitor} vs {home} on {date}: {str(e)}"
                )
                if attempt < self.retry_attempts - 1:
                    time.sleep(self.wait_times[attempt])
                else:
                    self.logger.error(
                        f"Failed to retrieve box score after {self.retry_attempts} attempts"
                    )
        return None
    
    def _format_box_score(self, box_score: Dict, date: str, visitor: str, home: str) -> Dict:
        """Format box score data for storage"""
        return {
            "date": date,
            "visitor": visitor,
            "home": home,
            "box_score": {
                visitor: box_score[visitor].to_dict(orient="records"),
                home: box_score[home].to_dict(orient="records"),
            },
            "scraped_at": datetime.now().isoformat()
        }
    
    def scrape_and_store(self, start_idx: int = 0, end_idx: Optional[int] = None,date: Optional[str] = None) -> None:
        """Main method to scrape and store box scores"""
        counter = 0
        if date:
            df_slice = self.schedule_df[self.schedule_df["DATE"] == date]
        elif end_idx:
            df_slice = self.schedule_df.iloc[start_idx:end_idx] 
        else:
            df_slice =self.schedule_df.iloc[start_idx:]
        
        for index, row in df_slice.iterrows():
            date = row["DATE"]
            visitor = row["VISITOR_ACRONYM"]
            home = row["HOME_ACRONYM"]
            
            # Check if game already exists in database
            if self.collection.find_one({"date": date, "visitor": visitor, "home": home}):
                self.logger.info(f"Skipping existing game: {visitor} vs {home} on {date}")
                continue
            
            # Get and process box score
            box_score = self._get_box_score_with_retry(date, visitor, home)
            if box_score:
                formatted_score = self._format_box_score(box_score, date, visitor, home)
                self.collection.insert_one(formatted_score)
                counter += 1
                self.logger.info(f"Processed game {counter}: {visitor} vs {home} on {date}")
                
                # Add base delay between requests
                time.sleep(self.base_delay)
            
        self.logger.info(f"Scraping completed. Total games processed: {counter}")

    def export_to_json(self, output_path: str) -> None:
        """Export MongoDB collection to JSON file"""
        cursor = self.collection.find({}, {'_id': 0})
        data = list(cursor)
        
        with open(output_path, 'w') as f:
            json.dump(data, f, indent=4)
        
        self.logger.info(f"Data exported to {output_path}")

if __name__ == "__main__":
    scraper = BoxScoreScraper(
        schedule_path="scraper/nba_schedule_2025.csv",
        env_path="api/config.env"
    )
    
    try:
        # Scrape all games
        scraper.scrape_and_store(date= (date.today()-timedelta(days=1)))
        
        # Optionally export to JSON
        # scraper.export_to_json("box_scores.json")
        
    except Exception as e:
        logging.error(f"An error occurred: {str(e)}")
    finally:
        scraper.client.close()