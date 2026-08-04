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

<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600;700;900&display=swap" rel="stylesheet">
<script src="https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js"></script>

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

.container {
    position: relative;
    width: 100%;
    max-width: 550px;
    padding: 40px;
    background: #1e293b;
    border-radius: 20px;
    border: 1px solid rgba(245, 158, 11, 0.2); /* Fipmoney Gold subtle border */
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 2px 0 rgba(245, 158, 11, 0.4);
    text-align: center;
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    transform: translateY(30px);
    opacity: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

@keyframes slideUp {
    to { transform: translateY(0); opacity: 1; }
}

.logo-container {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 10px;
}

.fm-icon {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    background: linear-gradient(to bottom right, #fbbf24, #d97706);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
    overflow: hidden;
}

.fm-icon::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('https://www.transparenttextures.com/patterns/carbon-fibre.png');
    opacity: 0.2;
    mix-blend-mode: overlay;
}

.fm-text {
    font-size: 20px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -1px;
    font-style: italic;
    z-index: 10;
}

.fipmoney-text {
    font-size: 24px;
    font-weight: 900;
    background: linear-gradient(to right, #ffffff, #e0e7ff, #c7d2fe);
    -webkit-background-clip: text;
    color: transparent;
    letter-spacing: -1px;
}

#lottie-container {
    width: 250px;
    height: 250px;
    margin: 10px auto 10px auto;
}

h1 {
    font-size: 2rem;
    color: #f59e0b; /* Fipmoney Gold */
    margin-bottom: 15px;
    font-weight: 700;
}

p {
    font-size: 1.1rem;
    line-height: 1.6;
    color: #cbd5e1;
    margin-bottom: 30px;
}

.btn {
    display: inline-block;
    padding: 12px 30px;
    background: linear-gradient(to right, #6366f1, #4f46e5);
    color: white;
    text-decoration: none;
    border-radius: 8px;
    font-weight: 600;
    transition: all 0.2s;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 15px -3px rgba(99, 102, 241, 0.4);
}

.container::before {
    content: '';
    position: absolute;
    top: -2px; left: -2px; right: -2px; bottom: -2px;
    background: linear-gradient(45deg, #f59e0b, transparent, #6366f1);
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
    .container { padding: 30px 20px; }
    h1 { font-size: 1.75rem; }
}
</style>
</head>
<body>

<div class="container">
    <div class="logo-container">
        <div class="fm-icon">
            <span class="fm-text">FM</span>
        </div>
        <div class="fipmoney-text">Fipmoney</div>
    </div>
    
    <div id="lottie-container"></div>
    
    <h1>Restricted Access</h1>
    <p>Oops! It looks like you've wandered into a restricted area of our infrastructure. If you're looking for our main website, you can safely head back home.</p>
    
    <a href="/" class="btn">Return to Fipmoney</a>
</div>

<script>
    var animation = lottie.loadAnimation({
        container: document.getElementById('lottie-container'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: '/error_page.json'
    });
</script>
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