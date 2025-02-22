// app/api/services/houseService.ts
'use client'
export interface SearchParameters {
    bedrooms?: number;
    bathrooms?: number;
    maxPrice?: number;
    minPrice?: number;
    location?: string;
    propertyType?: string;
    features?: string[];
  }
  
  interface Property {
    id: string;
    address: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    features: string[];
    location: string;
  }
  
  export class HouseService {
    async searchProperties(query: string): Promise<Property[]> {
      try {
        // Process natural language query
        const searchParams = await this.processQuery(query);
        
        // Convert NLP results to API parameters
        const apiParams = this.convertToAPIParams(searchParams);
        
        // Make API call
        const results = await this.makeAPICall(apiParams);
        
        return this.formatResults(results);
      } catch (error) {
        console.error('Error in property search:', error);
        throw error;
      }
    }
  
    private async processQuery(query: string): Promise<SearchParameters> {
      // Basic NLP processing
      const params: SearchParameters = {};
      
      // Extract bedrooms
      const bedroomMatch = query.match(/(\d+)\s*bed(room)?s?/i);
      if (bedroomMatch) {
        params.bedrooms = parseInt(bedroomMatch[1]);
      }
      
      // Extract bathrooms
      const bathroomMatch = query.match(/(\d+)\s*bath(room)?s?/i);
      if (bathroomMatch) {
        params.bathrooms = parseInt(bathroomMatch[1]);
      }
      
      // Extract price
      const priceMatch = query.match(/under\s*\$?(\d+(?:,\d{3})*)/i);
      if (priceMatch) {
        params.maxPrice = parseInt(priceMatch[1].replace(/,/g, ''));
      }
      
      // Extract location
      const locationMatch = query.match(/in\s+([^,\.]+)/i);
      if (locationMatch) {
        params.location = locationMatch[1].trim();
      }
  
      return params;
    }
  
    private convertToAPIParams(searchParams: SearchParameters): any {
      return {
        beds_min: searchParams.bedrooms,
        baths_min: searchParams.bathrooms,
        value_max: searchParams.maxPrice,
        value_min: searchParams.minPrice,
        city: searchParams.location,
        property_type: searchParams.propertyType,
      };
    }
  
    private async makeAPICall(params: any): Promise<any[]> {
      try {
        const response = await fetch('https://api.realestateapi.com/v2/PropertySearch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.REAL_ESTATE_API_KEY || '',
          },
          body: JSON.stringify({
            ...params,
            size: 50,
            ids_only: false,
            obfuscate: false,
            summary: false
          })
        });
  
        if (!response.ok) {
          throw new Error(`API request failed: ${response.statusText}`);
        }
  
        const data = await response.json();
        return data.properties || [];
      } catch (error) {
        console.error('Error calling Real Estate API:', error);
        throw error;
      }
    }
  
    private formatResults(apiResults: any[]): Property[] {
      return apiResults.map(result => ({
        id: result.id,
        address: result.address,
        price: result.value || result.last_sale_price,
        bedrooms: result.beds || 0,
        bathrooms: result.baths || 0,
        features: this.extractFeatures(result),
        location: result.city
      }));
    }
  
    private extractFeatures(property: any): string[] {
      const features = [];
      if (property.pool) features.push('pool');
      if (property.garage) features.push('garage');
      if (property.basement) features.push('basement');
      return features;
    }
  }