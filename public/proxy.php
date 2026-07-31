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
<title>403 • Access Denied</title>

<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet">

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
height:100vh;
overflow:hidden;
display:flex;
justify-content:center;
align-items:center;
font-family:'Space Grotesk',sans-serif;
background:
radial-gradient(circle at top,#132238,#050816 70%);
color:#fff;
}

body:before{
content:"";
position:fixed;
inset:0;
background:
radial-gradient(circle at 20% 20%,rgba(0,255,170,.18),transparent 30%),
radial-gradient(circle at 80% 70%,rgba(0,180,255,.15),transparent 35%);
animation:bgMove 8s ease-in-out infinite alternate;
}

@keyframes bgMove{
from{transform:scale(1);}
to{transform:scale(1.15);}
}

.card{

position:relative;
z-index:2;

width:min(760px,92%);
padding:60px;

border-radius:24px;

background:rgba(255,255,255,.05);

backdrop-filter:blur(18px);

border:1px solid rgba(255,255,255,.08);

box-shadow:
0 25px 60px rgba(0,0,0,.4),
0 0 60px rgba(0,255,170,.15);

text-align:center;

}

.badge{

display:inline-block;
padding:8px 18px;
border-radius:50px;
background:#ef4444;
font-weight:bold;
letter-spacing:2px;
font-size:13px;
margin-bottom:25px;

}

.icon{

font-size:72px;
margin-bottom:25px;
animation:pulse 2s infinite;

}

@keyframes pulse{
0%,100%{transform:scale(1);}
50%{transform:scale(1.08);}
}

h1{

font-size:52px;
margin-bottom:20px;

background:linear-gradient(90deg,#00ffb7,#38bdf8);

-webkit-background-clip:text;
-webkit-text-fill-color:transparent;

}

.desc{

font-size:20px;
line-height:1.8;
color:#d1d5db;
margin-bottom:35px;

}

.terminal{

text-align:left;

background:#08111d;

border-left:4px solid #00ffb7;

padding:25px;

border-radius:14px;

font-family:'JetBrains Mono',monospace;

font-size:14px;

line-height:1.9;

color:#7dd3fc;

margin-bottom:35px;

}

.footer{

font-size:15px;

color:#94a3b8;

}

.footer strong{

color:#00ffb7;

}

.warning{

margin-top:30px;

font-size:13px;

font-family:'JetBrains Mono',monospace;

color:#64748b;

}

</style>

</head>

<body>

<div class="card">

<div class="badge">
403 • ACCESS DENIED
</div>

<div class="icon">
🛡️
</div>

<h1>
Nice Try.
</h1>

<div class="desc">

You've reached a door reserved for authorized personnel.<br><br>

<strong>Curiosity unlocked this page.</strong><br>
<strong>Authorization unlocks everything else.</strong>

</div>

<div class="terminal">

&gt; Initializing security protocol...<br>
&gt; Identity verification............. FAILED<br>
&gt; Permission level.................. NONE<br>
&gt; Vault access...................... DENIED<br>
&gt; Secret discovery.................. 0%<br><br>

<strong>Counter Message:</strong><br>

"You found the gate.<br>
The key wasn't included."

</div>

<div class="footer">

🚀 <strong>Fipmoney Secure Infrastructure</strong><br><br>

Every request tells a story.<br>
This one simply ends here.

</div>

<div class="warning">

No secrets were exposed.<br>
Our firewall appreciates your curiosity.

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