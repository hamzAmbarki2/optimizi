$excludeDirs = @('node_modules', '.idea', '.git')
$excludeFiles = @('package-lock.json')
$excludeExtensions = @('.jpg', '.jpeg', '.png', '.svg', '.eps')

function Get-ProjectStructure {
    param (
        [string]$Path,
        [int]$Level = 0
    )

    Get-ChildItem -Path $Path -Force | Where-Object {
        -not ($excludeDirs -contains $_.Name) -and
        -not ($excludeFiles -contains $_.Name) -and
        -not ($_.Name.StartsWith('.git')) -and
        -not ($excludeExtensions -contains $_.Extension.ToLower())
    } | Sort-Object -Property PSIsContainer, Name | ForEach-Object {
        $item = $_
        $indent = "  " * $Level
        $type = if ($item.PSIsContainer) { "[DIR]" } else { "[FILE]" }
        "$indent- $type $($item.Name)" | Out-File -Append -Encoding utf8 project-structure.md

        if ($item.PSIsContainer) {
            Get-ProjectStructure -Path $item.FullName -Level ($Level + 1)
        }
    }
}

# Clear old output
if (Test-Path project-structure.md) {
    Remove-Item project-structure.md
}

# Start from current directory
Get-ProjectStructure -Path "."

Write-Output "Project structure saved to project-structure.md"
