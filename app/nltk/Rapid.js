const axios = require('axios');
require('dotenv').config();
const { OpenAI } = require('openai');


// Load OpenAI API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Zillow API configuration
const ZILLOW_API_URL = "https://zillow-com1.p.rapidapi.com/propertyExtendedSearch"; // Example endpoint, check the correct one in the docs
const ZILLOW_API_KEY = "63Aeead9a7mshf9a007c48b29cc6p18a484jsnfcb7db5fb3f3";
const ZILLOW_API_HOST = "zillow-com1.p.rapidapi.com";

/**
 * Use OpenAI GPT to extract structured data from a real estate query.
 * @param {string} query - The real estate query.
 * @returns {Promise<Object>} - The extracted structured data.
 */
async function extractQueryInfo(query) {
    const prompt = `
    Extract the following structured information from the real estate query:
    - "location": The city or area the user is interested in.
    - "price": The maximum price the user is willing to pay (numeric value).
    - "bedrooms": The number of bedrooms the user is looking for (numeric value).
    - "bathrooms": The number of bathrooms the user is looking for (numeric value).
    - "square_feet": The minimum square footage the user is looking for (numeric value).
    - "home_type": The type of home the user is looking for. Possible values are:
        - "Houses"
        - "Apartments"
        - "Condos"
        - "Townhomes"
        - "Multi-family"
        - "Manufactured"
        - "LotsLand"
    
    If any field is not explicitly mentioned in the query, set its value to null.

    Query: "${query}"

    Return the output as a JSON object.
    `;

    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Replace with "gpt-4o-mini" if it's a valid custom model
        messages: [
            { role: "system", content: "You extract structured data from real estate queries." },
            { role: "user", content: prompt }
        ],
        max_tokens: 200,
        temperature: 0,
    });

    const responseContent = completion.choices[0].message.content.trim();

    // Handle JSON response
    let jsonResponse = responseContent;
    if (responseContent.startsWith("```json")) {
        jsonResponse = responseContent.slice(7, -3).trim(); // Remove ```json and ```
    } else if (responseContent.startsWith("```")) {
        jsonResponse = responseContent.slice(3, -3).trim(); // Remove ```
    }

    return JSON.parse(jsonResponse);
}

/**
 * Search for properties on Zillow using the extracted parameters.
 * @param {string} location - The location to search for properties.
 * @param {string} [home_type] - Type of property.
 * @param {string} [status_type] - Status of the property (e.g., "ForSale", "ForRent").
 * @returns {Promise<Object>} - The search results.
 */
async function searchZillowProperties(location, home_type, status_type = "ForSale") {
    const querystring = {
        location: location || "Waterloo",  // ✅ Use function parameter
        home_type: home_type || "Apartments",  // ✅ Use function parameter
    };

    const headers = {
        "x-rapidapi-key": process.env.ZILLOW_API_KEY,  // Load from .env
        "x-rapidapi-host": ZILLOW_API_HOST,  // ✅ Fix: Use correct variable
        "Content-Type": "application/json"
    };

    console.log("Headers being sent:", headers);  // Debugging
    console.log("Zillow API Key:", process.env.ZILLOW_API_KEY);

    try {
        const response = await axios.get(ZILLOW_API_URL, { headers, params: querystring });
        return response.data;
    } catch (error) {
        console.error("Error searching Zillow properties:", error);
        return null;
    }
}


// Example queries
const queries = [
    "show me 4 bedroom apartments in Waterloo",
];

// Test the OpenAI extraction and Zillow API integration
(async () => {
    for (const query of queries) {
        console.log(`Query: ${query}`);
        const extractedInfo = await extractQueryInfo(query);
        console.log(`Extracted Info: ${JSON.stringify(extractedInfo)}`);

        const searchResults = await searchZillowProperties(
            extractedInfo.location,
            extractedInfo.home_type
        );
        console.log(`Search Results: ${JSON.stringify(searchResults)}`);
        console.log("\n");

        // Add a delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
    }
})();