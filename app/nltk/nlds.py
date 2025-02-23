import json
import os
from openai import OpenAI

#print (os.getenv("OPENAI_API_KEY"))
client = OpenAI(
  api_key=os.getenv("OPENAI_API_KEY")
)

# Load API key from environment variables (replace with your secure storage method)
#OpenAI_API_KEY = os.getenv("OPENAI_API_KEY")
def extract_query_info(query):
    """
    Use OpenAI GPT to extract structured data from a real estate query.
    """
    prompt = f"""
    Extract the following structured information from the real estate query:
    - "location": The city or area the user is interested in.
    - "price": The maximum price the user is willing to pay (numeric value).
    - "bedrooms": The number of bedrooms the user is looking for (numeric value).
    - "bathrooms": The number of bathrooms the user is looking for (numeric value).
    - "square_feet": The minimum square footage the user is looking for (numeric value).
    - "maxPrice": The maximum price the user is willing to pay (numeric value).
    - "rentMaxPrice": The maximum rent the user is willing to pay (numeric value).
    - "bathsMin": The minimum number of bathrooms the user is looking for (numeric value).
    - "bedsMin": The minimum number of bedrooms the user is looking for (numeric value).
    - "isBasementUnfinished": Whether the user is looking for a property with an unfinished basement (boolean).
    - "isBasementFinished": Whether the user is looking for a property with a finished basement (boolean).
    - 
    - "home_type": The type of home the user is looking for. Possible values are:
        - For Rent:
            - "Townhomes"
            - "Houses"
            - "Apartments_Condos_Co-ops"
        - For Others (e.g., for sale, lease, etc.):
            - "Multi-family"
            - "Apartments"
            - "Houses"
            - "Manufactured"
            - "Condos"
            - "LotsLand"
            - "Townhomes"
    
    If any field is not explicitly mentioned in the query, set its value to null.

    Query: "{query}"

    Return the output as a JSON object.
    """


    completion = client.chat.completions.create(
        model="gpt-4o-mini",  # Use GPT-4o mini
        messages=[
            {"role": "system", "content": "You extract structured data from real estate queries."},
            {"role": "user", "content": prompt}
        ],
        max_tokens=100,
        temperature=0
    )

    response_content = completion.choices[0].message.content.strip()

    # Handle JSON response
    if response_content.startswith("```json"):
        response_content = response_content.strip("```json").strip("```")
    elif response_content.startswith("```"):
        response_content = response_content.strip("```")

    return json.loads(response_content)
    
    """    
        # Debugging: Print raw response
        print(f"Raw response content: {response_content}")
    try:
        completion = client.chat.completions.create(
            model="gpt-4o-mini",  # Use GPT-4o
            messages=[
                {"role": "system", "content": "You extract structured data from real estate queries."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=100,
            temperature=0
        )

        response_content = completion.choices[0].message.content.strip()
        
        # Debugging: Print raw response
        print(f"Raw response content: {response_content}")

        # Ensure proper JSON parsing
        if response_content.startswith("```json"):
            response_content = response_content.strip("```json").strip("```")
        return json.loads(response_content)

    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}\nResponse was: {response_content}")
        return {"location": None, "price": None, "property_type": None}
    except Exception as e:
        print(f"OpenAI API error: {e}")
        return {"location": None, "price": None, "property_type": None}

# Example queries
queries = [
    "show me 4 bedroom apartments in Waterloo",
    "find 2 bedroom houses in Toronto",
    "list all 3 bedroom condos in Vancouver",
    "search for 1 bedroom studios in Montreal",
    "give me 500000 dollar villas in Ottawa",
    "find pet-friendly apartments in Calgary",
    "show me luxury homes in Edmonton",
    "list affordable rentals in Quebec City",
    "search for furnished apartments in Halifax",
    "give me student housing options in Kingston"
]

for query in queries:
    print(extract_query_info(query))
"""