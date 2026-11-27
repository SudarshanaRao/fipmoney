import { getApiBaseUrl } from "./apiConfig";

/**
 * Centralized Live Bullion Rates Configuration
 * Single source of truth for Gold and Silver prices across the entire platform:
 * Used consistently in Home / Dashboard, Buy/Sell Modals, Vault, and Portfolio calculations.
 */
export const DEFAULT_LIVE_GOLD_PRICE = 11200.00; // Live 24K 99.9% Gold Price per gram in INR
export const DEFAULT_LIVE_SILVER_PRICE = 115.00; // Live 99.9% Pure Silver Price per gram in INR

export interface LiveMetalPricesState {
  goldPrice: number;
  silverPrice: number;
  lastUpdated?: string;
  updatedBy?: string;
}

export const getLiveGoldPrice = (): number => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('fm_live_gold_price');
    if (saved && !isNaN(Number(saved)) && Number(saved) > 0) {
      return Number(saved);
    }
  }
  return DEFAULT_LIVE_GOLD_PRICE;
};

export const getLiveSilverPrice = (): number => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('fm_live_silver_price');
    if (saved && !isNaN(Number(saved)) && Number(saved) > 0) {
      return Number(saved);
    }
  }
  return DEFAULT_LIVE_SILVER_PRICE;
};

export const setLiveMetalPricesLocal = (gold: number, silver: number) => {
  if (typeof window !== 'undefined') {
    if (gold > 0) localStorage.setItem('fm_live_gold_price', gold.toString());
    if (silver > 0) localStorage.setItem('fm_live_silver_price', silver.toString());
    window.dispatchEvent(new CustomEvent('fm_prices_updated', {
      detail: { goldPrice: gold, silverPrice: silver }
    }));
  }
};

/**
 * Fetch latest live gold & silver prices from backend API
 */
export const fetchLiveMetalPricesApi = async (): Promise<LiveMetalPricesState> => {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/users/metal-prices`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data = await res.json();
    if (data && data.success && data.goldPrice && data.silverPrice) {
      const gold = Number(data.goldPrice);
      const silver = Number(data.silverPrice);
      setLiveMetalPricesLocal(gold, silver);
      return {
        goldPrice: gold,
        silverPrice: silver,
        lastUpdated: data.lastUpdated,
        updatedBy: data.updatedBy
      };
    }
  } catch (err) {
    console.warn('[fetchLiveMetalPricesApi] Falling back to local/default rates:', err);
  }

  return {
    goldPrice: getLiveGoldPrice(),
    silverPrice: getLiveSilverPrice()
  };
};

/**
 * Update live prices from the Admin Panel
 */
export const updateLiveMetalPricesAdminApi = async (
  goldPrice: number,
  silverPrice: number,
  updatedBy: string = 'Admin'
): Promise<{ success: boolean; message?: string; data?: LiveMetalPricesState }> => {
  try {
    const baseUrl = getApiBaseUrl();
    const res = await fetch(`${baseUrl}/admin/metal-prices`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ goldPrice, silverPrice, updatedBy })
    });
    const data = await res.json();
    if (res.ok && data.success) {
      setLiveMetalPricesLocal(Number(goldPrice), Number(silverPrice));
      return {
        success: true,
        message: data.message,
        data: {
          goldPrice: Number(data.goldPrice || goldPrice),
          silverPrice: Number(data.silverPrice || silverPrice),
          lastUpdated: data.lastUpdated,
          updatedBy: data.updatedBy
        }
      };
    }
    return { success: false, message: data.message || 'Failed to update rates.' };
  } catch (err: any) {
    console.error('[updateLiveMetalPricesAdminApi Error]:', err);
    return { success: false, message: err.message || 'Network error updating prices.' };
  }
};
