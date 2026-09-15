<?php
/**
 * Lädt index.html direkt auf der Haupt-URL (https://schami-leipzig.de/),
 * ohne "index.html" in der Adresszeile des Browsers anzuzeigen.
 */

if (file_exists(__DIR__ . '/index.html')) {
    include __DIR__ . '/index.html';
    exit();
}
?>
