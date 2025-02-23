import os
import requests
import time
from dotenv import load_dotenv # import env variable
load_dotenv()
# Zillow API configuration
ZILLOW_API_URL = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch"  # Example endpoint, check the correct one in the docs
ZILLOW_API_KEY = os.getenv("ZILLOW_API_KEY")
ZILLOW_API_HOST = "zillow-com1.p.rapidapi.com"

def search_zillow_properties(location, bedrooms=None, bathrooms=None, price=None, property_type=None):
    """
    Search for properties on Zillow using the extracted parameters.
    """
    querystring = {
        "location": location,
        "bedrooms": bedrooms,
        "bathrooms": bathrooms,
        "price": price,
        "property_type": property_type
    }

    headers = {
        "x-rapidapi-key": ZILLOW_API_KEY,
        "x-rapidapi-host": ZILLOW_API_HOST
    }

    response = requests.get(ZILLOW_API_URL, headers=headers, params=querystring)
    return response.json()
