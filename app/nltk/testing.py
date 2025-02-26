import requests
import time
from nlds import extract_query_info
from api import search_zillow_properties

# Example queries
queries = [
    "show me 4 bedroom apartments in Waterloo"
]

# Test the OpenAI extraction and Zillow API integration
for query in queries[:1]:
    print(f"Query: {query}")
    extracted_info = extract_query_info(query)
    print(f"Extracted Info: {extracted_info}")
    search_results = search_zillow_properties(
        location=extracted_info["location"],
        bedrooms=extracted_info["bedrooms"],
        bathrooms=extracted_info["bathrooms"],
        price=extracted_info["price"],
        home_type=extracted_info["home_type"]
    )
    print(f"Search Results: {search_results}")
    print("\n")
    
    # Add a delay to avoid hitting rate limits
    time.sleep(1)  # Wait 1 second between requests
"""
headers = {
	"x-rapidapi-key": "===",
	"x-rapidapi-host": "zillow-com1.p.rapidapi.com"
}

response = requests.get(ZILLOW_API_URL, headers=headers, params=extracted_info)
print(response.json())

"""