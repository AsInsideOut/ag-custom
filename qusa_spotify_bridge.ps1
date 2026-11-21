$ErrorActionPreference = 'SilentlyContinue'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

Add-Type -AssemblyName System.Runtime.WindowsRuntime
Add-Type @'
using System;
using System.Runtime.InteropServices;

[Guid("A95664D2-9614-4F35-A746-DE8DB63617E6"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDeviceEnumerator {
    int NotImpl1();
    [PreserveSig] int GetDefaultAudioEndpoint(int dataFlow, int role, out IMMDevice ppDevice);
}
[Guid("D666063F-1587-4E43-81F1-B948E807363F"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IMMDevice {
    [PreserveSig] int Activate(ref Guid iid, int dwClsCtx, IntPtr pActivationParams, [MarshalAs(UnmanagedType.IUnknown)] out object ppInterface);
}
[Guid("C02216F6-8C67-4B5B-9D00-D008E73E0064"), InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
interface IAudioMeterInformation {
    [PreserveSig] int GetPeakValue(out float pfPeak);
    [PreserveSig] int GetMeteringChannelCount(out int pnChannelCount);
    [PreserveSig] int GetChannelsPeakValues(int u32ChannelCount, [Out, MarshalAs(UnmanagedType.LPArray, SizeParamIndex = 0)] float[] afPeakValues);
}
[ComImport, Guid("BCDE0395-E52F-467C-8E3D-C4579291692E")]
class MMDeviceEnumerator {}

public class QusaNative {
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern uint MapVirtualKey(uint uCode, uint uMapType);
    [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, uint dwFlags, UIntPtr dwExtraInfo);

    const uint KEYEVENTF_KEYUP = 0x0002;
    const byte VK_MENU = 0x12;   // Alt
    const byte VK_SHIFT = 0x10;  // Shift
    const byte VK_B = 0x42;      // Physical B (layout-independent)

    public static void SendSpotifyLike(IntPtr spotifyHwnd) {
        if (spotifyHwnd == IntPtr.Zero) return;
        IntPtr prevHwnd = GetForegroundWindow();
        try {
            if (IsIconic(spotifyHwnd)) {
                ShowWindow(spotifyHwnd, 9); // SW_RESTORE only if minimized
            }
            SetForegroundWindow(spotifyHwnd);
            System.Threading.Thread.Sleep(150);

            byte scanAlt = (byte)MapVirtualKey(VK_MENU, 0);
            byte scanShift = (byte)MapVirtualKey(VK_SHIFT, 0);
            byte scanB = (byte)MapVirtualKey(VK_B, 0);

            keybd_event(VK_MENU, scanAlt, 0, UIntPtr.Zero);
            keybd_event(VK_SHIFT, scanShift, 0, UIntPtr.Zero);
            keybd_event(VK_B, scanB, 0, UIntPtr.Zero);
            System.Threading.Thread.Sleep(40);
            keybd_event(VK_B, scanB, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_SHIFT, scanShift, KEYEVENTF_KEYUP, UIntPtr.Zero);
            keybd_event(VK_MENU, scanAlt, KEYEVENTF_KEYUP, UIntPtr.Zero);

            System.Threading.Thread.Sleep(110);
            if (prevHwnd != IntPtr.Zero && prevHwnd != spotifyHwnd) {
                SetForegroundWindow(prevHwnd);
            }
        } catch {}
    }

    static IAudioMeterInformation _meter;
    static void EnsureMeter() {
        if (_meter != null) return;
        var enumerator = (IMMDeviceEnumerator)(new MMDeviceEnumerator());
        IMMDevice dev;
        if (enumerator.GetDefaultAudioEndpoint(0, 1, out dev) == 0 && dev != null) {
            Guid iid = typeof(IAudioMeterInformation).GUID;
            object obj;
            if (dev.Activate(ref iid, 1, IntPtr.Zero, out obj) == 0) {
                _meter = (IAudioMeterInformation)obj;
            }
        }
    }

    public static float[] GetPeaks() {
        try {
            EnsureMeter();
            if (_meter != null) {
                float master = 0f;
                _meter.GetPeakValue(out master);
                int ch = 0;
                _meter.GetMeteringChannelCount(out ch);
                if (ch >= 2) {
                    float[] vals = new float[ch];
                    if (_meter.GetChannelsPeakValues(ch, vals) == 0) {
                        return new float[] { vals[0], master, vals[1] };
                    }
                }
                return new float[] { master, master, master };
            }
        } catch {
            _meter = null;
        }
        return new float[] { 0f, 0f, 0f };
    }
}
'@

$asTaskGeneric = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object {
    $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1'
})[0]

function Await($WinRtTask, $ResultType) {
    if ($null -eq $WinRtTask) { return $null }
    $asTask = $asTaskGeneric.MakeGenericMethod($ResultType)
    $netTask = $asTask.Invoke($null, @($WinRtTask))
    $netTask.Wait(2000) | Out-Null
    if ($netTask.IsCompleted -and -not $netTask.IsFaulted) { return $netTask.Result }
    return $null
}

[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager,Windows.Media.Control,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties,Windows.Media.Control,ContentType=WindowsRuntime] | Out-Null
[Windows.Media.MediaPlaybackAutoRepeatMode,Windows.Media,ContentType=WindowsRuntime] | Out-Null
[Windows.Storage.Streams.IRandomAccessStreamWithContentType,Windows.Storage.Streams,ContentType=WindowsRuntime] | Out-Null

$mgr = Await ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager]::RequestAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionManager])
$lastThumbKey = ''
$lastThumbData = ''

function Get-SpotifySession {
    if ($null -eq $mgr) { return $null }
    $sessions = $mgr.GetSessions()
    foreach ($s in $sessions) {
        if ($s.SourceAppUserModelId -like '*Spotify*') { return $s }
    }
    return $null
}

function Get-ThumbnailDataUrl($thumbRef, [string]$key) {
    if ($key -eq $script:lastThumbKey) { return $script:lastThumbData }
    $script:lastThumbKey = $key
    $script:lastThumbData = ''
    if ($null -eq $thumbRef) { return '' }
    try {
        $asTask = $asTaskGeneric.MakeGenericMethod([Windows.Storage.Streams.IRandomAccessStreamWithContentType])
        $netTask = $asTask.Invoke($null, @($thumbRef.OpenReadAsync()))
        if (-not $netTask.Wait(300) -or $netTask.IsFaulted) { return '' }
        $stream = $netTask.Result
        if ($null -eq $stream) { return '' }
        $netStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
        $ms = New-Object System.IO.MemoryStream
        $netStream.CopyTo($ms)
        $bytes = $ms.ToArray()
        $ms.Dispose()
        $netStream.Dispose()
        $mime = if ($stream.ContentType) { $stream.ContentType } else { 'image/jpeg' }
        $stream.Dispose()
        if ($bytes.Length -eq 0 -or $bytes.Length -gt 2097152) { return '' }
        $b64 = [Convert]::ToBase64String($bytes)
        $script:lastThumbData = "data:$mime;base64,$b64"
        return $script:lastThumbData
    } catch {
        return ''
    }
}

function Get-SpotifyStateJson {
    # Require an actual open Spotify window (MainWindowHandle != 0), not just a background/tray process
    $spWin = Get-Process -Name 'Spotify' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
    if ($null -eq $spWin) {
        return '{"running":false}'
    }

    $s = Get-SpotifySession
    $title = ''
    $artist = ''
    $status = 'Paused'
    $repeat = 'None'
    $cover = ''

    # Fast path: Spotify MainWindowTitle ("Artist - Track") updates instantaneously (<50ms) when playing
    if ($spWin.MainWindowTitle -and $spWin.MainWindowTitle -ne 'Spotify' -and $spWin.MainWindowTitle -ne 'Spotify Free' -and $spWin.MainWindowTitle -ne 'Spotify Premium') {
        $wt = [string]$spWin.MainWindowTitle
        $dashIdx = $wt.IndexOf(' - ')
        if ($dashIdx -gt 0) {
            $artist = $wt.Substring(0, $dashIdx).Trim()
            $title = $wt.Substring($dashIdx + 3).Trim()
            $status = 'Playing'
        }
    }

    if ($s) {
        $pb = $s.GetPlaybackInfo()
        if ($pb) {
            $status = [string]$pb.PlaybackStatus
            if ($null -ne $pb.AutoRepeatMode) { $repeat = [string]$pb.AutoRepeatMode }
        }
        $info = Await ($s.TryGetMediaPropertiesAsync()) ([Windows.Media.Control.GlobalSystemMediaTransportControlsSessionMediaProperties])
        if ($info) {
            if (-not $title -and $info.Title) { $title = [string]$info.Title }
            if (-not $artist -and $info.Artist) { $artist = [string]$info.Artist }
            $thumbKey = "$title|$artist"
            if ($info.Thumbnail) { $cover = Get-ThumbnailDataUrl $info.Thumbnail $thumbKey }
        }
    }

    $p = if ($status -eq 'Playing') { [QusaNative]::GetPeaks() } else { @(0.0, 0.0, 0.0) }
    $obj = @{
        running = $true
        hasSession = [bool]($title -or $artist -or $s)
        title = $title
        artist = $artist
        status = $status
        repeat = $repeat
        cover = $cover
        peaks = @([math]::Round($p[0], 3), [math]::Round($p[1], 3), [math]::Round($p[2], 3))
    }
    return ($obj | ConvertTo-Json -Compress)
}

function Invoke-SpotifyAction([string]$cmd) {
    $s = Get-SpotifySession
    switch ($cmd) {
        'playpause' {
            if ($s) { Await ($s.TryTogglePlayPauseAsync()) ([bool]) | Out-Null }
        }
        'next' {
            if ($s) { Await ($s.TrySkipNextAsync()) ([bool]) | Out-Null }
        }
        'prev' {
            if ($s) { Await ($s.TrySkipPreviousAsync()) ([bool]) | Out-Null }
        }
        'repeat' {
            if ($s) {
                $pb = $s.GetPlaybackInfo()
                $cur = if ($pb -and $null -ne $pb.AutoRepeatMode) { [string]$pb.AutoRepeatMode } else { 'None' }
                $nextMode = switch ($cur) {
                    'None' { [Windows.Media.MediaPlaybackAutoRepeatMode]::List }
                    'List' { [Windows.Media.MediaPlaybackAutoRepeatMode]::Track }
                    default { [Windows.Media.MediaPlaybackAutoRepeatMode]::None }
                }
                Await ($s.TryChangeAutoRepeatModeAsync($nextMode)) ([bool]) | Out-Null
            }
        }
        'like' {
            $sp = Get-Process -Name 'Spotify' -ErrorAction SilentlyContinue | Where-Object { $_.MainWindowHandle -ne 0 } | Select-Object -First 1
            if ($sp) {
                [QusaNative]::SendSpotifyLike($sp.MainWindowHandle)
            }
        }
    }
}

while ($true) {
    $line = [Console]::In.ReadLine()
    if ($null -eq $line) { break }
    $cmd = $line.Trim()
    if ($cmd -eq 'exit') { break }
    if ($cmd -eq 'peak') {
        $p = [QusaNative]::GetPeaks()
        $out = '{"peaks":[' + [math]::Round($p[0], 3) + ',' + [math]::Round($p[1], 3) + ',' + [math]::Round($p[2], 3) + ']}'
        [Console]::Out.WriteLine($out)
        [Console]::Out.Flush()
    } elseif ($cmd -eq 'state') {
        [Console]::Out.WriteLine((Get-SpotifyStateJson))
        [Console]::Out.Flush()
    } else {
        Invoke-SpotifyAction $cmd
        Start-Sleep -Milliseconds 180
        [Console]::Out.WriteLine((Get-SpotifyStateJson))
        [Console]::Out.Flush()
    }
}
