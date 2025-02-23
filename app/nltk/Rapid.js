const axios = require('axios');
require('dotenv').config();
const { OpenAI } = require('openai');

// Load OpenAI API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Repliers API configuration
const REPLIERS_API_URL = process.env.REPLIERS_API_URL; // Load from environment variables
const REPLIERS_API_KEY = process.env.REPLIERS_API_KEY; // Load from environment variables

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
 * Search for properties on Repliers using the extracted parameters.
 * @param {string} location - The location to search for properties.
 * @param {string} [home_type] - Type of property.
 * @param {string} [status_type] - Status of the property (e.g., "ForSale", "ForRent").
 * @returns {Promise<Object>} - The search results.
 */
async function searchRepliersProperties(location, home_type, status_type = "ForSale") {
    const querystring = {
        location: location || "Waterloo",  // ✅ Use function parameter
        home_type: home_type || "Apartments",  // ✅ Use function parameter
    };

    const headers = {
        "accept": "application/json",
        "content-type": "application/json",
        "REPLIERS-API-KEY": REPLIERS_API_KEY,  // ✅ Use environment variable
    };

    console.log("Headers being sent:", headers);  // Debugging
    console.log("Repliers API Key:", REPLIERS_API_KEY);

    try {
        const response = await axios.get(REPLIERS_API_URL, { headers, params: querystring });
        return response.data;
    } catch (error) {
        console.error("Error searching REPLIERS properties:", error);
        return null;
    }
}

// Example queries
const queries = [
    "show me 4 bedroom apartments in Waterloo",
];

// Test the OpenAI extraction and REPLIERS API integration
(async () => {
    for (const query of queries) {
        console.log(`Query: ${query}`);
        const extractedInfo = await extractQueryInfo(query);
        console.log(`Extracted Info: ${JSON.stringify(extractedInfo)}`);

        const searchResults = await searchRepliersProperties(
            extractedInfo.location,
            extractedInfo.home_type
        );
        console.log(`Search Results: ${JSON.stringify(searchResults)}`);
        console.log("\n");

        // Add a delay to avoid hitting rate limits
        await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between requests
    }
})();