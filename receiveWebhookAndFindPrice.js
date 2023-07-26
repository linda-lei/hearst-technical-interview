// Map to store the current lowest price for each SKU
const lowestPrices = new Map();

// Map to store the price history for each SKU
const priceHistory = new Map();

// Map to store the current retail price for each SKU
const currentPrices = new Map();

// Function to update the current price for each retailer for a SKU
function updateCurrentPrice(sku, price, retailer) {
  if (!currentPrices.has(sku)) {
    const mapOfRetailers = new Map();
    currentPrices.set(sku, mapOfRetailers);
  }
  let currPriceMapOfEachRetailer = currentPrices.get(sku);
  currPriceMapOfEachRetailer.set(retailer, price);
}

// Function to update the lowest price for a SKU
function updateLowestPrice(sku, price, retailer) {
  if (!lowestPrices.has(sku) || price < lowestPrices.get(sku).price) {
    lowestPrices.set(sku, { retailer, sku, price });
  } 
  else if (retailer === lowestPrices.get(sku).retailer && price > lowestPrices.get(sku).price) {
    
    if (!currentPrices.has(sku)) return;
    let currPriceMapOfEachRetailer = currentPrices.get(sku);
    
    let lowestPriceForSku = Number.MAX_VALUE; // initialize to the largest number in JavaScript
    let lpRetailerInfo = null;
    
    let retailers = Object.keys(currPriceMapOfEachRetailer);
    
    currPriceMapOfEachRetailer.forEach( (skuPrice, retailerName, retailerMap) => {
      
      if ( skuPrice < lowestPriceForSku ) {
        lowestPriceForSku = skuPrice;
        lpRetailerInfo = { retailer: retailerName, sku: sku, price: skuPrice };
      }
    });

    if(lpRetailerInfo) {
      lowestPrices.set(sku, lpRetailerInfo);
    }
      
  }
}

// Function to update the price history for a SKU
function updatePriceHistory(sku, price, retailer) {
  if (!priceHistory.has(sku)) {
    priceHistory.set(sku, []);
  }
  priceHistory.get(sku).push({ retailer, sku, price, timestamp: new Date() });

  // Send a message with the updated Price History ${priceHistory} object to the Pricing Analytics message queue for further analysis asychronously:
  // For example, send to a Data Warehouse 
}

// Function to receive and process the webhook payload
function receive(payload) {
  const { retailer, sku, price } = payload;

  // Update the current price for the SKU
  updateCurrentPrice(sku, price, retailer);

  // Update the lowest price for the SKU
  updateLowestPrice(sku, price, retailer);

  // Update the price history for the SKU
  updatePriceHistory(sku, price, retailer);
}

// Testing with the Sample data from interview question:
const payload1 = {
  retailer: "Walmart",
  sku: "CLOCK",
  price: 20,
  url: "https://walmart.com/product/CLOCK",
};

const payload2 = {
  retailer: "IKEA",
  sku: "BED",
  price: 90,
  url: "https://ikea.com/product/BED",
};

const payload3 = {
  retailer: "Target",
  sku: "CLOCK",
  price: 15,
  url: "https://target.com/product/CLOCK",
};

const payload4 = {
  retailer: "Target",
  sku: "CLOCK",
  price: 14,
  url: "https://target.com/product/CLOCK",
};

const payload5 = {
  retailer: "Best Buy",
  sku: "CLOCK",
  price: 30,
  url: "https://bestbuy.com/product/CLOCK",
};

const payload6 = {
  retailer: "Mor",
  sku: "BED",
  price: 120,
  url: "https://mor.com/product/BED",
};

const payload7 = {
  retailer: "Target",
  sku: "CLOCK",
  price: 25,
  url: "https://target.com/product/CLOCK",
};

const payload8 = {
  retailer: "Walmart",
  sku: "CLOCK",
  price: 27,
  url: "https://walmart.com/product/CLOCK",
};

const payload9 = {
  retailer: "Costco",
  sku: "CLOCK",
  price: 12,
  url: "https://costco.com/product/CLOCK",
};

const payload10 = {
  retailer: "IKEA",
  sku: "BED",
  price: 100,
  url: "https://ikea.com/product/BED",
};

const payload11 = {
  retailer: "Costco",
  sku: "CLOCK",
  price: 13,
  url: "https://costco.com/product/CLOCK",
};

receive(payload1);
receive(payload2);
receive(payload3);
receive(payload4);
receive(payload5);
receive(payload6);
receive(payload7);
receive(payload8);
receive(payload9);
receive(payload10);
receive(payload11);


// Get the current lowest price for sku "BED"
let productToSearch = {
  sku: "BED",
  priceHistory: null
};

let lowestPrice = lowestPrices.get(productToSearch.sku);
console.log(`Lowest Price for ${productToSearch.sku}:`, lowestPrice);

// Get the price history for sku "BED"
productToSearch.priceHistory = priceHistory.get(productToSearch.sku);
console.log(`Price History for ${productToSearch.sku}:`, productToSearch.priceHistory);

// Get the current lowest price for sku "CLOCK"
productToSearch = {
  sku: "CLOCK",
  priceHistory: null
};

lowestPrice = lowestPrices.get(productToSearch.sku);
console.log(`Lowest Price for ${productToSearch.sku}:`, lowestPrice);

// Get the price history for sku "CLOCK"
productToSearch.priceHistory = priceHistory.get(productToSearch.sku);
console.log(`Price History for ${productToSearch.sku}:`, productToSearch.priceHistory);


// Function to find the best price for a given SKU
function findPrice(sku) {
  // Check if the SKU is present in the in-memory cache
  if (lowestPrices.has(sku)) {
    return lowestPrices.get(sku);
  } 

  // Make a call to our remote cache, for example, Redis, to see if the SKU is present in the remote cache

  // If SKU is not in the cache, you can fetch it from the database or any other data source here
  // For simplicity, we'll return a default value indicating that the SKU is not found
  return { retailer: "Unknown Retailer", sku: sku, price: -1 };
}

// Test with sku "CLOCK"
let skuToSearch = "CLOCK";
let productPrice = findPrice(skuToSearch);
console.log(`The best price for ${productPrice.sku} is from ${productPrice.retailer} for $${productPrice.price}`);

// Test with sku "BED"
skuToSearch = "BED";
productPrice = findPrice(skuToSearch);
console.log(`The best price for ${productPrice.sku} is from ${productPrice.retailer} for $${productPrice.price}`);
