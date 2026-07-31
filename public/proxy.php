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
