<?php

// return [
//     'paths' => ['api/*', 'sanctum/csrf-cookie'],
//     'allowed_methods' => ['*'],
//     'allowed_origins' => ['http://localhost:3000'], // Change to match your frontend
//     'allowed_origins_patterns' => [],
//     'allowed_headers' => ['*'],
//     'supports_credentials' => true,
// ];


return [

    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
