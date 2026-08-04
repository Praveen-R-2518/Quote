try {
  $word = New-Object -ComObject Word.Application
  $word.Quit()
  [System.Runtime.InteropServices.Marshal]::ReleaseComObject($word) | Out-Null
  Write-Output "Word COM available"
} catch {
  Write-Output "Word COM unavailable: $($_.Exception.Message)"
}
