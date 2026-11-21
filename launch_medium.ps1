param([string]$ExePath)

$code = @'
using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

public class MediumLauncher {
    [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Unicode)]
    public struct STARTUPINFO {
        public int cb;
        public string lpReserved;
        public string lpDesktop;
        public string lpTitle;
        public int dwX, dwY, dwXSize, dwYSize, dwXCountChars, dwYCountChars, dwFillAttribute, dwFlags;
        public short wShowWindow, cbReserved2;
        public IntPtr lpReserved2, hStdInput, hStdOutput, hStdError;
    }

    [StructLayout(LayoutKind.Sequential)]
    public struct PROCESS_INFORMATION {
        public IntPtr hProcess, hThread;
        public int dwProcessId, dwThreadId;
    }

    [DllImport("kernel32.dll", SetLastError = true)]
    public static extern IntPtr OpenProcess(uint a, bool b, int pid);

    [DllImport("advapi32.dll", SetLastError = true)]
    public static extern bool OpenProcessToken(IntPtr p, uint a, out IntPtr t);

    [DllImport("advapi32.dll", SetLastError = true)]
    public static extern bool DuplicateTokenEx(IntPtr hTok, uint access, IntPtr attr, int imp, int type, out IntPtr newTok);

    [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
    public static extern bool CreateProcessWithTokenW(IntPtr hTok, int flags, string app, string cmd, int cf, IntPtr env, string dir, ref STARTUPINFO si, out PROCESS_INFORMATION pi);

    [DllImport("kernel32.dll")]
    public static extern bool CloseHandle(IntPtr h);

    public static void LaunchAsExplorer(string exePath, string workDir) {
        Process[] exps = Process.GetProcessesByName("explorer");
        if (exps.Length == 0) throw new Exception("explorer.exe not running");
        IntPtr hProc = IntPtr.Zero, hTok = IntPtr.Zero, hNewTok = IntPtr.Zero;
        try {
            hProc = OpenProcess(0x0400, false, exps[0].Id);
            if (hProc == IntPtr.Zero) throw new Exception("OpenProcess failed");
            if (!OpenProcessToken(hProc, 0x0002 | 0x0008 | 0x0001, out hTok)) throw new Exception("OpenProcessToken failed");
            if (!DuplicateTokenEx(hTok, 0x02000000, IntPtr.Zero, 2, 1, out hNewTok)) throw new Exception("DuplicateTokenEx failed");
            STARTUPINFO si = new STARTUPINFO();
            si.cb = Marshal.SizeOf(si);
            PROCESS_INFORMATION pi;
            string cmd = "\"" + exePath + "\"";
            if (!CreateProcessWithTokenW(hNewTok, 0, exePath, cmd, 0, IntPtr.Zero, workDir, ref si, out pi)) {
                throw new Exception("CreateProcessWithTokenW failed: " + Marshal.GetLastWin32Error());
            }
            CloseHandle(pi.hProcess);
            CloseHandle(pi.hThread);
        } finally {
            if (hNewTok != IntPtr.Zero) CloseHandle(hNewTok);
            if (hTok != IntPtr.Zero) CloseHandle(hTok);
            if (hProc != IntPtr.Zero) CloseHandle(hProc);
        }
    }
}
'@

$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    try {
        Add-Type -TypeDefinition $code -ErrorAction Stop
        [MediumLauncher]::LaunchAsExplorer($ExePath, (Split-Path $ExePath -Parent))
        Write-Host "[Qusa] Launched Antigravity at Medium Integrity (drag-and-drop enabled)."
        exit 0
    } catch {
        Write-Host "[Qusa] Medium launch fallback via explorer..."
    }
}

Start-Process -FilePath 'explorer.exe' -ArgumentList "`"$ExePath`""
Write-Host "[Qusa] Launched Antigravity."
