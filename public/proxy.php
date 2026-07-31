<?php
// Provide a fallback for getallheaders if not using Apache mod_php
if (!function_exists('getallheaders')) {
    function getallheaders()
    {
        $headers = [];
        foreach ($_SERVER as $name => $value) {
            if (substr($name, 0, 5) == 'HTTP_') {
                $headers[str_replace(' ', '-', ucwords(strtolower(str_replace('_', ' ', substr($name, 5)))))] = $value;
            } else if ($name == "CONTENT_TYPE") {
                $headers["Content-Type"] = $value;
            } else if ($name == "CONTENT_LENGTH") {
                $headers["Content-Length"] = $value;
            }
        }
        return $headers;
    }
}

// Check if someone is trying to access the API directly via browser (direct navigation sends text/html)
$is_browser = false;
foreach (getallheaders() as $name => $value) {
    if (strtolower($name) === 'accept' && strpos(strtolower($value), 'text/html') !== false) {
        $is_browser = true;
        break;
    }
}

// If it's a direct browser hit, show the funny counter punch page!
if ($is_browser) {
    http_response_code(403);
    header("Content-Type: text/html; charset=UTF-8");

    echo <<<HTML
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>403 • Restricted Area</title>

<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700&display=swap" rel="stylesheet">

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Space Grotesk', sans-serif;
    background-color: #0f172a; /* Fipmoney Dark Slate */
    background-image: radial-gradient(circle at top right, #1e293b, #0f172a 80%);
    color: #f8fafc;
    overflow: hidden;
    padding: 20px;
}

.card {
    position: relative;
    width: 100%;
    max-width: 600px;
    padding: 50px 40px;
    background: #1e293b;
    border-radius: 20px;
    border: 1px solid rgba(245, 158, 11, 0.2); /* Fipmoney Gold subtle border */
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(245, 158, 11, 0.4);
    text-align: center;
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform: translateY(30px);
    opacity: 0;
}

@keyframes slideUp {
    to { transform: translateY(0); opacity: 1; }
}

.badge {
    display: inline-block;
    padding: 8px 16px;
    background-color: rgba(239, 68, 68, 0.1);
    color: #ef4444;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 50px;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 30px;
}

h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    color: #f59e0b; /* Fipmoney Gold */
    margin-bottom: 20px;
    font-weight: 700;
    letter-spacing: -1px;
}

.attitude-box {
    background: #0f172a;
    border-left: 4px solid #f59e0b;
    padding: 25px;
    border-radius: 8px;
    margin: 30px 0;
    text-align: left;
}

.attitude-box p {
    font-size: 1.1rem;
    line-height: 1.7;
    color: #cbd5e1;
    margin-bottom: 15px;
}

.attitude-box p:last-child {
    margin-bottom: 0;
}

.punchline {
    font-size: 1.25rem;
    font-weight: 600;
    color: #f8fafc;
}

.branding {
    margin-top: 40px;
    font-size: 14px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 2px;
}
.branding span {
    color: #f59e0b;
}

/* Warning pulses */
.card::before {
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    background: linear-gradient(45deg, #f59e0b, transparent, #ef4444);
    z-index: -1;
    border-radius: 22px;
    opacity: 0.15;
    animation: pulseBorder 3s infinite alternate;
}

@keyframes pulseBorder {
    0% { opacity: 0.1; }
    100% { opacity: 0.3; }
}

@media (max-width: 480px) {
    .card { padding: 40px 25px; }
    .attitude-box { padding: 20px 15px; }
}
</style>
</head>
<body>

<div class="card">
    <div class="badge">Error 403 • Access Denied</div>
    
    <h1>Are you lost?</h1>
    
    <div class="attitude-box">
        <p>What exactly are you trying to accomplish by poking around our backend APIs in your browser?</p>
        <p>This is highly restricted, private infrastructure. It's not a playground for your curiosity.</p>
        <p class="punchline">Unless you suddenly gained clearance (which you haven't), I highly suggest you close this tab and get back to where you belong.</p>
    </div>
    
    <div class="branding">
        Protected by <span>Fipmoney</span> Security
    </div>
</div>

</body>
</html>
HTML;

    exit;
}

// Define the target backend URL
$target_base = 'https://prod-server.fipmoney.com';

// Get the requested path from the client
$request_uri = $_SERVER['REQUEST_URI'];

// Construct the full target URL
$target_url = $target_base . $request_uri;

// Initialize cURL session
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $target_url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HEADER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);

// Forward the request method (GET, POST, etc.)
$method = $_SERVER['REQUEST_METHOD'];
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);

// Forward the headers from the client
$headers = array();
foreach (getallheaders() as $name => $value) {
    // Skip Host header to avoid mismatch on target server
    if (strtolower($name) === 'host')
        continue;
    $headers[] = "$name: $value";
}
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

// Forward the request body if present
if ($method === 'POST' || $method === 'PUT' || $method === 'PATCH') {
    curl_setopt($ch, CURLOPT_POSTFIELDS, file_get_contents('php://input'));
}

// Execute the request to the backend
$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);

// Separate response headers from response body
$header_str = substr($response, 0, $header_size);
$body_str = substr($response, $header_size);

curl_close($ch);

// Set the response code
http_response_code($http_code);

// Forward response headers back to the frontend
$response_headers = explode("\r\n", $header_str);
foreach ($response_headers as $header) {
    if (!empty(trim($header)) && stripos($header, 'Transfer-Encoding') === false) {
        header($header, false);
    }
}

// Output the body
echo $body_str;
?>