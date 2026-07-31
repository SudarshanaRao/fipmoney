<?php
// Provide a fallback for getallheaders if not using Apache mod_php
if (!function_exists('getallheaders')) {
    function getallheaders() {
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
    header("Content-Type: text/html");
    echo '<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Nice Try! 🕵️‍♂️</title>
    <style>
        body { font-family: "Courier New", monospace; background-color: #0f172a; color: #10b981; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; text-align: center; }
        .container { border: 2px solid #10b981; padding: 40px; border-radius: 12px; background: #1e293b; box-shadow: 0 0 20px rgba(16, 185, 129, 0.2); }
        h1 { color: #fbbf24; font-size: 2rem; margin-bottom: 20px; }
        p { font-size: 1.2rem; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🛑 Unauthorized Access</h1>
        <p>It\'s a secret to know all the things...</p>
        <p>Get back to work! 💻🥊</p>
    </div>
</body>
</html>';
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
    if (strtolower($name) === 'host') continue;
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
