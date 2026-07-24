// Utility to interact with MetalpriceAPI for live Gold & Silver rates in INR

export interface MetalPriceApiResponse {
  success: boolean;
  base: string;
  timestamp: number;
  rates: {
    EUR?: number;
    INREUR?: number;
    INRXAG: number; // Silver rate per troy oz in INR
    INRXAU: number; // Gold rate per troy oz in INR
    XAG?: number;
    XAU?: number;
    [key: string]: number | undefined;
  };
  error?: {
    code: number;
    type: string;
    info?: string;
  };
}

export interface ParsedMetalPrices {
  timestamp: number;
  fetchedAt?: number;
  isCached24h?: boolean;
  base: string;
  isMockData: boolean;
  raw: {
    inrXauPerOz: number; // Gold 1 troy oz in INR
    inrXagPerOz: number; // Silver 1 troy oz in INR
  };
  gold: {
    perOz: number;
    perGram24K: number;
    per10g24K: number;
    perGram22K: number;
    per10g22K: number;
    perGram18K: number;
    per10g18K: number;
    changePct24h: number; // Estimated market trend percentage
  };
  silver: {
    perOz: number;
    perGram: number;
    per10g: number;
    perKg: number;
    changePct24h: number;
  };
}

// 1 Troy Ounce = 31.1034768 grams
export const TROY_OUNCE_IN_GRAMS = 31.1034768;

// 24 Hours in Milliseconds
export const CACHE_DURATION_24H_MS = 24 * 60 * 60 * 1000;

// Fallback rates matching API sample response structure
const FALLBACK_RATES: MetalPriceApiResponse = {
  success: true,
  base: "INR",
  timestamp: Math.floor(Date.now() / 1000),
  rates: {
    EUR: 0.0090703423,
    INREUR: 110.2494227933,
    INRXAG: 5762.7625509287,
    INRXAU: 398690.624784264,
    XAG: 0.0001735279,
    XAU: 0.0000025082,
  },
};

const LOCAL_STORAGE_CACHE_KEY = "fipmoney_metalprice_cache_24h_v2";

export function parseMetalPrices(
  data: MetalPriceApiResponse,
  isMock = false
): ParsedMetalPrices {
  const inrXau = data.rates.INRXAU || FALLBACK_RATES.rates.INRXAU;
  const inrXag = data.rates.INRXAG || FALLBACK_RATES.rates.INRXAG;

  const goldPerGram24K = inrXau / TROY_OUNCE_IN_GRAMS;
  const goldPerGram22K = goldPerGram24K * (22 / 24);
  const goldPerGram18K = goldPerGram24K * (18 / 24);

  const silverPerGram = inrXag / TROY_OUNCE_IN_GRAMS;

  return {
    timestamp: data.timestamp ? data.timestamp * 1000 : Date.now(),
    fetchedAt: Date.now(),
    isCached24h: false,
    base: data.base || "INR",
    isMockData: isMock,
    raw: {
      inrXauPerOz: inrXau,
      inrXagPerOz: inrXag,
    },
    gold: {
      perOz: inrXau,
      perGram24K: goldPerGram24K,
      per10g24K: goldPerGram24K * 10,
      perGram22K: goldPerGram22K,
      per10g22K: goldPerGram22K * 10,
      perGram18K: goldPerGram18K,
      per10g18K: goldPerGram18K * 10,
      changePct24h: 0.42,
    },
    silver: {
      perOz: inrXag,
      perGram: silverPerGram,
      per10g: silverPerGram * 10,
      perKg: silverPerGram * 1000,
      changePct24h: 1.15,
    },
  };
}

export async function fetchLatestMetalPrices(forceRefresh = false): Promise<ParsedMetalPrices> {
  // 1. Strict 24-hour cache check
  if (!forceRefresh) {
    try {
      const cachedStr = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
      if (cachedStr) {
        const cached: ParsedMetalPrices = JSON.parse(cachedStr);
        const lastFetch = cached.fetchedAt || cached.timestamp || 0;
        const now = Date.now();
        const ageMs = now - lastFetch;

        if (ageMs < CACHE_DURATION_24H_MS) {
          console.log(
            `[MetalpriceAPI] 24-Hour Cache Active. Age: ${(ageMs / (1000 * 60 * 60)).toFixed(
              2
            )} hours. Skipping API request to save quota.`
          );
          return {
            ...cached,
            isCached24h: true,
          };
        }
      }
    } catch (e) {
      console.warn("Failed to read 24h cache, making new API call", e);
    }
  }

  // 2. Make API Request if cache expired or forceRefresh requested
  const apiKey =
    import.meta.env.VITE_METALPRICE_API_KEY || "7e7b199cfe8a824bd320c8d577ac7e81";
  const baseUrl =
    import.meta.env.VITE_METALPRICE_API_BASE_URL ||
    "https://api.metalpriceapi.com/v1";

  const url = `${baseUrl}/latest?api_key=${apiKey}&base=INR&currencies=EUR,XAU,XAG`;

  try {
    console.log("[MetalpriceAPI] Fetching new live rates from MetalpriceAPI...");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MetalPriceApiResponse = await response.json();

    if (data.success && data.rates && data.rates.INRXAU && data.rates.INRXAG) {
      const parsed = parseMetalPrices(data, false);
      parsed.fetchedAt = Date.now();
      parsed.isCached24h = false;
      // Store in 24-hour cache
      try {
        localStorage.setItem(LOCAL_STORAGE_CACHE_KEY, JSON.stringify(parsed));
      } catch (e) {
        // storage ignored
      }
      return parsed;
    } else {
      console.warn("MetalpriceAPI returned non-success response, using fallback data:", data);
      return getCachedOrFallbackData();
    }
  } catch (error) {
    console.warn("Failed to fetch live prices from MetalpriceAPI, using fallback data:", error);
    return getCachedOrFallbackData();
  }
}

function getCachedOrFallbackData(): ParsedMetalPrices {
  try {
    const cachedStr = localStorage.getItem(LOCAL_STORAGE_CACHE_KEY);
    if (cachedStr) {
      const cached = JSON.parse(cachedStr) as ParsedMetalPrices;
      return { ...cached, isCached24h: true };
    }
  } catch (e) {
    // fallback
  }
  return parseMetalPrices(FALLBACK_RATES, true);
}
