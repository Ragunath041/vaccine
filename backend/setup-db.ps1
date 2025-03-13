# Database setup script
$setupScript = Get-Content "setup.sql" -Raw

# Execute the SQL script
mysql -u root -proot -e $setupScript

Write-Host "Database setup completed!" 