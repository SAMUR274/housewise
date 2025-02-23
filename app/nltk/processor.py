from flask import Flask, request, jsonify
import spacy

nlp = spacy.load("en_core_web_md")
app = Flask(__name__)

# Sample queries
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
    doc = nlp(query)
    print(f"Query: {query}")
    for token in doc.ents:
        print(token.text, "-->", token.label_, "-->", spacy.explain(token.label_))
    print("\n")

def extract_query_info(query):
    """
    Extract location, price, and property type from the query using spaCy.
    """
    doc = nlp(query)

    property_types = {
    "flat": "apartment",
    "townhouse": "house",
    "studio": "apartment",
    "bungalow": "house",
    "condo": "condo",
    "villa": "villa",
    "villas": "villa",
    "apartment": "apartment",
    "apartments": "apartment",
    }

    for token in doc:
        lemma = token.lemma_.lower().strip(",.!?")
        if lemma in property_types:
            property_type = lemma
            break
        elif lemma in property_types:
            property_type = property_types[lemma]
            break
    
    location = None
    price = None
    property_type = None
    
    # Extract entities
    for ent in doc.ents:
        if ent.label_ == "GPE":  # Geo-political entity (e.g., New York)
            location = ent.text
        elif ent.label_ == "MONEY":  # Money (e.g., $500,000)
            price = float(ent.text.replace('$', '').replace(',', ''))

    # Extract property type using keywords
    for token in doc:
        if token.text.lower() in property_types:
            property_type = token.text.lower()
            break

    return {
        "location": location,
        "price": price,
        "property_type": property_type
    }

# Call the extract_query_info function for each query and print the results
for query in queries:
    extracted_info = extract_query_info(query)
    print(f"Query: {query}")
    print(f"Extracted Info: {extracted_info}")
    print("\n")
# https://medinum.com/@agrawalprince617/demystifying-nlp-exploring-spacy-integration-in-flask-for-powerful-natural-language-processing-52c573785ca9
# https://spacy.io/models/en#en_core_web_lg