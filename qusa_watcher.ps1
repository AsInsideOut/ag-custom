$ErrorActionPreference = 'Continue'

$root = $PSScriptRoot
$resDir = Join-Path $env:LOCALAPPDATA 'Programs\antigravity\resources'
$asarPath = Join-Path $resDir 'app.asar'
$bakPath = Join-Path $resDir 'app.asar.bak'
$exePath = Join-Path $env:LOCALAPPDATA 'Programs\antigravity\Antigravity.exe'
$patcher = Join-Path $root 'patch_asar.py'
$uiScript = Join-Path $root 'qusaCustomUI.js'
$launcher = Join-Path $root 'launch_medium.ps1'

$stateDir = Join-Path $env:USERPROFILE '.gemini\antigravity'
$pidFile = Join-Path $stateDir 'qusa-watcher.pid'
$logFile = Join-Path $stateDir 'qusa-watcher.log'

New-Item -ItemType Directory -Path $stateDir -Force | Out-Null

function Write-Log([string]$msg) {
    try {
        if ((Test-Path $logFile) -and (Get-Item $logFile).Length -gt 204800) {
            $tail = Get-Content $logFile -Tail 200
            Set-Content -Path $logFile -Value $tail -Encoding UTF8
        }
        $ts = Get-Date -Format 'yyyy-MM-dd HH:mm:ss'
        Add-Content -Path $logFile -Value "[$ts] $msg" -Encoding UTF8
    } catch {}
}

# Stop any older instance of this watcher service (single-instance replacement)
function Stop-PreviousWatchers {
    if (Test-Path $pidFile) {
        try {
            $oldPid = [int](Get-Content $pidFile -ErrorAction SilentlyContinue | Select-Object -First 1)
            if ($oldPid -and $oldPid -ne $PID) {
                $p = Get-Process -Id $oldPid -ErrorAction SilentlyContinue
                if ($p -and $p.ProcessName -like 'powershell*') {
                    Stop-Process -Id $oldPid -Force -ErrorAction SilentlyContinue
                }
            }
        } catch {}
    }
    try {
        $others = Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe'" -ErrorAction SilentlyContinue |
            Where-Object { $_.ProcessId -ne $PID -and $_.CommandLine -like '*qusa_watcher.ps1*' }
        foreach ($proc in $others) {
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
        }
    } catch {}
}

Stop-PreviousWatchers
Set-Content -Path $pidFile -Value $PID -Encoding ASCII
Write-Log "Service started (PID=$PID). Watching: $asarPath"

$lastStamp = ''

while ($true) {
    try {
        if ((Test-Path $asarPath) -and (Test-Path $patcher) -and (Test-Path $uiScript)) {
            $info = Get-Item $asarPath -ErrorAction SilentlyContinue
            if ($info) {
                $stamp = "$($info.LastWriteTimeUtc.Ticks)_$($info.Length)"
                if ($stamp -ne $lastStamp) {
                    $checkOut = & python $patcher --check $asarPath 2>&1
                    $checkCode = $LASTEXITCODE
                    if ($checkCode -eq 0) {
                        $lastStamp = $stamp
                        Write-Log "Verified patched: $checkOut"
                    } elseif ($checkCode -eq 2) {
                        Write-Log "Detected unpatched app.asar ($checkOut). Waiting 2s for updater to settle..."
                        Start-Sleep -Seconds 2

                        $tmpOut = Join-Path $resDir 'app.asar.qusa_new'
                        $patchOut = & python $patcher --patch $asarPath --ui $uiScript --out $tmpOut 2>&1
                        if ($LASTEXITCODE -eq 0 -and (Test-Path $tmpOut)) {
                            Write-Log "Dynamic patch succeeded: $patchOut"
                            Copy-Item $asarPath $bakPath -Force -ErrorAction SilentlyContinue

                            $running = @(Get-Process -Name 'Antigravity' -ErrorAction SilentlyContinue)
                            if ($running.Count -gt 0) {
                                Write-Log "Stopping running Antigravity ($($running.Count) processes) to apply update patch..."
                                $running | Stop-Process -Force -ErrorAction SilentlyContinue
                                Start-Sleep -Seconds 2
                            }

                            $swapped = $false
                            for ($attempt = 1; $attempt -le 5; $attempt++) {
                                try {
                                    Move-Item -Path $tmpOut -Destination $asarPath -Force -ErrorAction Stop
                                    $swapped = $true
                                    break
                                } catch {
                                    Start-Sleep -Seconds 1
                                }
                            }

                            if ($swapped) {
                                $newInfo = Get-Item $asarPath -ErrorAction SilentlyContinue
                                if ($newInfo) {
                                    $lastStamp = "$($newInfo.LastWriteTimeUtc.Ticks)_$($newInfo.Length)"
                                }
                                Write-Log "Installed freshly patched app.asar."
                                if ($running.Count -gt 0 -and (Test-Path $exePath)) {
                                    Write-Log "Relaunching Antigravity..."
                                    & $launcher -ExePath $exePath | Out-Null
                                }
                            } else {
                                Write-Log "ERROR: Could not replace locked app.asar; will retry next cycle."
                                Remove-Item $tmpOut -Force -ErrorAction SilentlyContinue
                            }
                        } else {
                            Write-Log "ERROR: Dynamic patch failed: $patchOut"
                            Remove-Item $tmpOut -Force -ErrorAction SilentlyContinue
                            $lastStamp = $stamp
                        }
                    } else {
                        Write-Log "Check skipped (code=$checkCode): $checkOut"
                    }
                }
            }
        }
    } catch {
        Write-Log "Loop error: $_"
    }
    Start-Sleep -Seconds 5
}
