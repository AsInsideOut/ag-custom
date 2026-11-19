$root = $PSScriptRoot
$res = Join-Path $env:LOCALAPPDATA 'Programs\antigravity\resources'
$exe = Join-Path $env:LOCALAPPDATA 'Programs\antigravity\Antigravity.exe'
$launcher = Join-Path $root 'launch_medium.ps1'
$stateDir = Join-Path $env:USERPROFILE '.gemini\antigravity'
$pidFile = Join-Path $stateDir 'qusa-watcher.pid'
$runRegPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
$runRegName = 'QusaAntigravityUI'

Write-Host '[Qusa] Stopping background watcher service...'
if (Test-Path $pidFile) {
    try {
        $oldPid = [int](Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
        if ($oldPid) {
            Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
        }
    } catch {}
    Remove-Item $pidFile -Force -ErrorAction SilentlyContinue
}
Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -like '*qusa_watcher.ps1*' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

Write-Host '[Qusa] Removing Windows startup entry...'
Remove-ItemProperty -Path $runRegPath -Name $runRegName -ErrorAction SilentlyContinue

$orig = Join-Path $res 'app.asar'
$bak = Join-Path $res 'app.asar.bak'
if (-not (Test-Path $bak)) {
    Write-Host '[!] Backup app.asar.bak not found.'
    pause
    exit 1
}

Get-Process -Name 'Antigravity' -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2
Copy-Item $bak $orig -Force
Write-Host '[Qusa] Original UI restored & service removed! Launching Antigravity...'
& $launcher -ExePath $exe
