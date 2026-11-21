$ErrorActionPreference = 'Stop'
$root = $PSScriptRoot
$res = Join-Path $env:LOCALAPPDATA 'Programs\antigravity\resources'
$exe = Join-Path $env:LOCALAPPDATA 'Programs\antigravity\Antigravity.exe'
$patcher = Join-Path $root 'patch_asar.py'
$uiScript = Join-Path $root 'qusaCustomUI.js'
$launcher = Join-Path $root 'launch_medium.ps1'
$hiddenStarter = Join-Path $root 'start_watcher_hidden.vbs'
$stateDir = Join-Path $env:USERPROFILE '.gemini\antigravity'
$pidFile = Join-Path $stateDir 'qusa-watcher.pid'
$runRegPath = 'HKCU:\Software\Microsoft\Windows\CurrentVersion\Run'
$runRegName = 'QusaAntigravityUI'

if (-not (Test-Path $exe)) {
    Write-Host "[!] Antigravity.exe not found at: $exe"
    pause
    exit 1
}

Write-Host '[Qusa] Stopping old background service (if running)...'
if (Test-Path $pidFile) {
    try {
        $oldPid = [int](Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
        if ($oldPid) {
            Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
        }
    } catch {}
}
Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe'" -ErrorAction SilentlyContinue |
    Where-Object { $_.CommandLine -like '*qusa_watcher.ps1*' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }

$orig = Join-Path $res 'app.asar'
$bak = Join-Path $res 'app.asar.bak'
$tmpOut = Join-Path $res 'app.asar.qusa_new'

Write-Host '[Qusa] Checking current Antigravity app.asar...'
$checkOut = & python $patcher --check $orig 2>&1
$checkCode = $LASTEXITCODE
Write-Host "[Qusa] Status: $checkOut"

if ($checkCode -eq 2) {
    Write-Host '[Qusa] Backing up clean app.asar -> app.asar.bak...'
    Copy-Item $orig $bak -Force
    $srcForPatch = $orig
} elseif ($checkCode -eq 0 -and (Test-Path $bak)) {
    Write-Host '[Qusa] Re-applying latest patch on clean backup app.asar.bak...'
    $srcForPatch = $bak
} else {
    $srcForPatch = $orig
}

Write-Host '[Qusa] Dynamically patching app.asar...'
$patchOut = & python $patcher --patch $srcForPatch --ui $uiScript --out $tmpOut --force 2>&1
if ($LASTEXITCODE -ne 0 -or -not (Test-Path $tmpOut)) {
    Write-Host "[!] Patching failed: $patchOut"
    pause
    exit 1
}
Write-Host "[Qusa] $patchOut"

Write-Host '[Qusa] Stopping Antigravity...'
Get-Process -Name 'Antigravity' -ErrorAction SilentlyContinue | Stop-Process -Force
Start-Sleep -Seconds 2

Write-Host '[Qusa] Installing patched app.asar...'
Move-Item -Path $tmpOut -Destination $orig -Force

Write-Host '[Qusa] Registering background service in Windows startup...'
$startupCmd = "wscript.exe //B //Nologo `"$hiddenStarter`""
Set-ItemProperty -Path $runRegPath -Name $runRegName -Value $startupCmd

Write-Host '[Qusa] Starting new background watcher service...'
Start-Process -FilePath 'wscript.exe' -ArgumentList "//B //Nologo `"$hiddenStarter`""

Write-Host '[Qusa] Launching Antigravity with custom UI (Medium IL)...'
& $launcher -ExePath $exe
