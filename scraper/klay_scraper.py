try:
    from basketball_reference_scraper.teams import get_teams
    print("Import successful!")
except ImportError as e:
    print(f"Import error: {e}")
