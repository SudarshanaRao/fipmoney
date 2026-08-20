import fetch from 'node-fetch';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Zoho Campaigns Service
 * Handles OAuth 2.0 authentication, contact list sync, and campaign dispatch via Zoho Campaigns API.
 */

// Helper to get Accounts OAuth domain based on Data Center
function getZohoAccountsDomain() {
  const dc = (process.env.ZOHO_DATA_CENTER || 'in').toLowerCase().trim();
  if (dc === 'com' || dc === 'us') return 'https://accounts.zoho.com';
  if (dc === 'eu') return 'https://accounts.zoho.eu';
  if (dc === 'au') return 'https://accounts.zoho.com.au';
  return 'https://accounts.zoho.in'; // Default to India Data Center (.in)
}

// Helper to get Campaigns API domain based on Data Center
function getZohoCampaignsApiDomain() {
  const dc = (process.env.ZOHO_DATA_CENTER || 'in').toLowerCase().trim();
  if (dc === 'com' || dc === 'us') return 'https://campaigns.zoho.com';
  if (dc === 'eu') return 'https://campaigns.zoho.eu';
  if (dc === 'au') return 'https://campaigns.zoho.com.au';
  return 'https://campaigns.zoho.in'; // Default to India (.in)
}

/**
 * Exchange Grant Code for Refresh Token during OAuth Callback
 */
export async function exchangeGrantCodeForTokens(code, redirectUri) {
  const clientId = process.env.ZOHO_CAMPAIGNS_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CAMPAIGNS_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('ZOHO_CAMPAIGNS_CLIENT_ID and ZOHO_CAMPAIGNS_CLIENT_SECRET must be set before authorizing.');
  }

  const accountsDomain = getZohoAccountsDomain();
  const tokenUrl = `${accountsDomain}/oauth/v2/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', clientId);
  params.append('client_secret', clientSecret);
  params.append('redirect_uri', redirectUri);
  params.append('code', code);

  console.log(`[Zoho OAuth] Attempting token exchange with redirect_uri: ${redirectUri}`);

  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params,
  });

  const data = await res.json();
  console.log('[Zoho OAuth Token Response]:', data);

  if (data.refresh_token) {
    process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN = data.refresh_token;
    return {
      success: true,
      refreshToken: data.refresh_token,
      accessToken: data.access_token,
      data,
    };
  } else {
    throw new Error(data.error || JSON.stringify(data));
  }
}

let cachedAccessToken = null;
let tokenExpiresAt = 0;

/**
 * Exchange Refresh Token for a fresh OAuth Access Token from Zoho Accounts
 */
export async function getZohoCampaignsAccessToken() {
  if (cachedAccessToken && Date.now() < tokenExpiresAt) {
    return cachedAccessToken;
  }

  const clientId = process.env.ZOHO_CAMPAIGNS_CLIENT_ID;
  const clientSecret = process.env.ZOHO_CAMPAIGNS_CLIENT_SECRET;
  const refreshToken = process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Zoho Campaigns API credentials missing in environment variables (ZOHO_CAMPAIGNS_CLIENT_ID, ZOHO_CAMPAIGNS_CLIENT_SECRET, ZOHO_CAMPAIGNS_REFRESH_TOKEN).');
  }

  const accountsDomain = getZohoAccountsDomain();
  const tokenUrl = `${accountsDomain}/oauth/v2/token?grant_type=refresh_token&client_id=${encodeURIComponent(clientId)}&client_secret=${encodeURIComponent(clientSecret)}&refresh_token=${encodeURIComponent(refreshToken)}`;

  try {
    const res = await fetch(tokenUrl, { method: 'POST' });
    const data = await res.json();

    if (data.access_token) {
      cachedAccessToken = data.access_token;
      tokenExpiresAt = Date.now() + ((data.expires_in || 3600) - 300) * 1000;
      return cachedAccessToken;
    } else {
      throw new Error(`Zoho OAuth Error: ${data.error || JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error('[Zoho Campaigns OAuth Token Error]:', err.message);
    throw err;
  }
}

export const campaignHtmlStore = new Map();

/**
 * Create and send an email marketing campaign via Zoho Campaigns API
 */
export async function sendZohoMarketingCampaign({ campaignName, subject, fromEmail, fromName, htmlContent, recipients = [] }) {
  const clientId = process.env.ZOHO_CAMPAIGNS_CLIENT_ID;
  const refreshToken = process.env.ZOHO_CAMPAIGNS_REFRESH_TOKEN;

  // Check if Zoho Campaigns API credentials are provided
  if (!clientId || !refreshToken) {
    console.log('[Zoho Campaigns Service]: API Credentials not configured in .env. Falling back to transactional email service dispatch.');
    return {
      isZohoCampaignsConfigured: false,
      message: 'Zoho Campaigns API credentials (ZOHO_CAMPAIGNS_CLIENT_ID, ZOHO_CAMPAIGNS_REFRESH_TOKEN) not set. Please set environment variables.',
    };
  }

  try {
    const accessToken = await getZohoCampaignsAccessToken();
    const campaignsApiDomain = getZohoCampaignsApiDomain();

    // 1. Store HTML content for Zoho crawler to fetch via content_url
    const contentId = 'c_' + Date.now() + '_' + Math.random().toString(36).substring(2, 8);
    campaignHtmlStore.set(contentId, htmlContent);

    // Host URL for Zoho Campaigns content crawler
    const baseHost = process.env.APP_BASE_URL || 'https://dev-server.fipmoney.com';
    const contentUrl = `${baseHost}/api/admin/zoho-oauth/campaign-content/${contentId}`;

    // Dynamically resolve listId if not set in .env
    let listId = process.env.ZOHO_CAMPAIGNS_LIST_ID || '';
    if (!listId) {
      try {
        const listRes = await fetch(`${campaignsApiDomain}/api/v1.1/getmailinglists?resfmt=JSON`, {
          headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
        });
        const listData = await listRes.json();
        if (listData?.list_of_details && listData.list_of_details.length > 0) {
          listId = listData.list_of_details[0].listkey;
          process.env.ZOHO_CAMPAIGNS_LIST_ID = listId;
        }
      } catch (lErr) {
        console.warn('[Zoho Campaigns Service] List key fetch warning:', lErr.message);
      }
    }

    // Dynamically resolve topicId if not set in .env
    let topicId = process.env.ZOHO_CAMPAIGNS_TOPIC_ID || '';
    if (!topicId) {
      try {
        const topicRes = await fetch(`${campaignsApiDomain}/api/v1.1/topics?resfmt=JSON`, {
          headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
        });
        const topicData = await topicRes.json();
        if (topicData?.topicDetails && topicData.topicDetails.length > 0) {
          topicId = topicData.topicDetails[0].topicId;
          process.env.ZOHO_CAMPAIGNS_TOPIC_ID = topicId;
        }
      } catch (tErr) {
        console.warn('[Zoho Campaigns Service] Topic ID fetch warning:', tErr.message);
      }
    }

    // 2. Create Campaign in Zoho Campaigns using content_url
    const createUrl = `${campaignsApiDomain}/api/v1.1/createCampaign`;
    const params = new URLSearchParams();
    params.append('resfmt', 'JSON');
    params.append('campaignname', campaignName);
    params.append('from_email', fromEmail || 'info@fipmoney.com');
    params.append('from_name', fromName || 'Fipmoney');
    params.append('subject', subject);
    params.append('content_url', contentUrl);
    if (topicId) {
      params.append('topicId', topicId);
    }
    if (listId) {
      params.append('list_details', JSON.stringify({ [listId]: [] }));
    }

    let createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    let createData = await createRes.json();
    console.log('[Zoho Campaigns Create API Response]:', createData);

    // If crawler could not reach content_url, fallback to passing direct html_content parameter
    if (createData?.Code === 'UNABLE_TO_IMPORT' || (createData?.status === 'error' && !createData?.campaignKey)) {
      console.log('[Zoho Campaigns Service] content_url fetch failed. Retrying with direct html_content parameter...');
      const fallbackParams = new URLSearchParams();
      fallbackParams.append('resfmt', 'JSON');
      fallbackParams.append('campaignname', campaignName);
      fallbackParams.append('from_email', fromEmail || 'info@fipmoney.com');
      fallbackParams.append('from_name', fromName || 'Fipmoney');
      fallbackParams.append('subject', subject);
      fallbackParams.append('html_content', htmlContent);
      if (topicId) fallbackParams.append('topicId', topicId);
      if (listId) fallbackParams.append('list_details', JSON.stringify({ [listId]: [] }));

      const retryRes = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: fallbackParams,
      });
      createData = await retryRes.json();
      console.log('[Zoho Campaigns Create API Retry Response]:', createData);
    }

    const campaignKey = createData?.campaignKey || createData?.campaign_details?.campaignKey || '';

    if (campaignKey) {
      // 3. Trigger Send Campaign via lowercase /api/v1.1/sendcampaign
      const sendUrl = `${campaignsApiDomain}/api/v1.1/sendcampaign`;
      const sendParams = new URLSearchParams();
      sendParams.append('resfmt', 'JSON');
      sendParams.append('campaignkey', campaignKey);

      const sendRes = await fetch(sendUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Zoho-oauthtoken ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: sendParams,
      });

      const sendData = await sendRes.json();
      console.log('[Zoho Campaigns Send API Response]:', sendData);

      return {
        isZohoCampaignsConfigured: true,
        success: true,
        campaignKey,
        data: sendData,
        message: `Campaign '${campaignName}' successfully created & triggered in Zoho Campaigns!`,
      };
    } else {
      return {
        isZohoCampaignsConfigured: true,
        success: false,
        data: createData,
        message: createData.message || 'Failed to create campaign in Zoho Campaigns',
      };
    }
  } catch (err) {
    console.error('[Zoho Campaigns Dispatch Error]:', err);
    return {
      isZohoCampaignsConfigured: true,
      success: false,
      error: err.message,
      message: 'Zoho Campaigns Dispatch Exception',
    };
  }
}

/**
 * Fetch campaign details and analytics report from Zoho Campaigns API
 */
export async function getZohoCampaignDetails(campaignKey) {
  if (!campaignKey) return null;
  try {
    const accessToken = await getZohoCampaignsAccessToken();
    const campaignsApiDomain = getZohoCampaignsApiDomain();
    const url = `${campaignsApiDomain}/api/v1.1/getcampaigndetails?resfmt=JSON&campaignkey=${encodeURIComponent(campaignKey)}`;

    const res = await fetch(url, {
      headers: { 'Authorization': `Zoho-oauthtoken ${accessToken}` }
    });
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('[Zoho Campaigns Get Details Error]:', err.message);
    return null;
  }
}

/**
 * Delete a campaign from Zoho Campaigns API
 */
export async function deleteZohoCampaign(campaignKey) {
  if (!campaignKey) return false;
  try {
    const accessToken = await getZohoCampaignsAccessToken();
    const campaignsApiDomain = getZohoCampaignsApiDomain();
    const url = `${campaignsApiDomain}/api/v1.1/deletecampaign`;

    const params = new URLSearchParams();
    params.append('resfmt', 'JSON');
    params.append('campaignkey', campaignKey);

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });
    const data = await res.json();
    return data?.status === 'success' || data?.code === '200';
  } catch (err) {
    console.error('[Zoho Campaigns Delete Error]:', err.message);
    return false;
  }
}
