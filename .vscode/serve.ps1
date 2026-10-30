# Start localhost server on port 8080
Start-Process python -ArgumentList "-m","http.server","8080","--bind","localhost" -WindowStyle Hidden
Start-Sleep -Seconds 3

# Launch Edge with remote debugging on port 9222, separate profile (your main Edge is untouched)
Start-Process msedge -ArgumentList "--remote-debugging-port=9222","--user-data-dir=${env:TEMP}\sunkngardns-debug","--no-first-run","--no-default-browser-check","http://localhost:8080/"
Start-Sleep -Seconds 3
