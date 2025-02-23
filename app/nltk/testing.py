import requests
import time
from nlds import extract_query_info
from api import search_zillow_properties

url = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch"

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

headers = {
	"x-rapidapi-key": "634eead9a7mshf9a007c48b29cc6p18a484jsnfcb7db5fb3f3",
	"x-rapidapi-host": "zillow-com1.p.rapidapi.com"
}

response = requests.get(url, headers=headers, params=extracted_info)
print(response.json())

