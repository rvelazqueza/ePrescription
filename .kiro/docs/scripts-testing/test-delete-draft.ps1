# Get a draft prescription ID
$drafts = curl -s "http://localhost:8000/api/prescriptions/status/draft?page=1&pageSize=10" | ConvertFrom-Json

if ($drafts.items.Count -gt 0) {
    $draftId = $drafts.items[0].id
    Write-Host "Found draft prescription: $draftId"
    
    # Try to delete it
    Write-Host "Attempting to delete draft..."
    $response = curl -X DELETE "http://localhost:8000/api/prescriptions/$draftId/draft" -H "Content-Type: application/json" 2>&1
    Write-Host "Response: $response"
} else {
    Write-Host "No draft prescriptions found"
}
