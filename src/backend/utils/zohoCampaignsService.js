import fetch from 'node-fetch';

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

/**
 * Exchange Refresh Token for a fresh OAuth Access Token from Zoho Accounts
 */
export async function getZohoCampaignsAccessToken() {
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
      return data.access_token;
    } else {
      throw new Error(`Zoho OAuth Error: ${data.error || JSON.stringify(data)}`);
    }
  } catch (err) {
    console.error('[Zoho Campaigns OAuth Token Error]:', err.message);
    throw err;
  }
}

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

    // 1. Create Campaign in Zoho Campaigns
    const createUrl = `${campaignsApiDomain}/api/v1.1/createCampaign`;
    const listId = process.env.ZOHO_CAMPAIGNS_LIST_ID || '';

    const params = new URLSearchParams();
    params.append('resfmt', 'JSON');
    params.append('campaignname', campaignName);
    params.append('from_email', fromEmail || 'info@fipmoney.com');
    params.append('from_name', fromName || 'Fipmoney');
    params.append('subject', subject);
    params.append('html_content', htmlContent);
    if (listId) {
      params.append('list_details', JSON.stringify({ [listId]: [] }));
    }

    const createRes = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Zoho-oauthtoken ${accessToken}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const createData = await createRes.json();
    console.log('[Zoho Campaigns Create API Response]:', createData);

    const campaignKey = createData?.campaignKey || createData?.campaign_details?.campaignKey || '';

    if (campaignKey) {
      // 2. Trigger Send Campaign
      const sendUrl = `${campaignsApiDomain}/api/v1.1/sendCampaign`;
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
    };
  }
}
