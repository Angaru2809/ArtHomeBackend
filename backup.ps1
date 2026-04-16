# PowerShell script for project backup

# Get current date for backup folder name
$date = Get-Date -Format "yyyy-MM-dd"
$backupFolder = "backups/$date"

# Create backup directory if it doesn't exist
if (-not (Test-Path $backupFolder)) {
    New-Item -ItemType Directory -Path $backupFolder
}

# Files and folders to backup
$itemsToBackup = @(
    "src/aplicacion",
    "src/domain",
    "src/infraestructura",
    "src/index.ts",
    "package.json",
    "package-lock.json",
    "tsconfig.json",
    "CHANGELOG.md",
    "README.md"
)

# Copy each item to backup folder
foreach ($item in $itemsToBackup) {
    if (Test-Path $item) {
        $destination = Join-Path $backupFolder (Split-Path $item -Leaf)
        Copy-Item -Path $item -Destination $destination -Recurse -Force
        Write-Host "Backed up: $item"
    } else {
        Write-Host "Warning: $item not found"
    }
}

# Create a backup of the database schema if it exists
$dbSchemaPath = "src/infraestructura/config/database.ts"
if (Test-Path $dbSchemaPath) {
    $dbBackupPath = Join-Path $backupFolder "database_schema.ts"
    Copy-Item -Path $dbSchemaPath -Destination $dbBackupPath -Force
    Write-Host "Backed up database schema"
}

Write-Host "Backup completed to $backupFolder" 