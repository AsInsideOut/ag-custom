import argparse
import hashlib
import json
import os
import re
import struct
import sys

PRELOAD_MARKER = "exposeInMainWorld('qusaPersist'"
UTILS_MARKER = "global.__qusaIpcRegistered"

PRELOAD_HOOK = """
electron_1.contextBridge.exposeInMainWorld('qusaPersist', {
    loadConfig: () => electron_1.ipcRenderer.invoke('qusa:load-config'),
    saveConfig: (cfg) => electron_1.ipcRenderer.invoke('qusa:save-config', cfg),
    loadWallpaper: () => electron_1.ipcRenderer.invoke('qusa:load-wallpaper'),
    saveWallpaper: (payload) => electron_1.ipcRenderer.invoke('qusa:save-wallpaper', payload),
    clearWallpaper: () => electron_1.ipcRenderer.invoke('qusa:clear-wallpaper'),
});
"""

UTILS_HOOK = """    if (!global.__qusaIpcRegistered) {
        global.__qusaIpcRegistered = true;
        try {
            const { ipcMain: qIpc } = require('electron');
            const qFs = require('fs');
            const qPath = require('path');
            const qOs = require('os');
            const qDir = qPath.join(qOs.homedir(), '.gemini', 'antigravity');
            const qCfgFile = qPath.join(qDir, 'custom-ui-config.json');
            const qWpBin = qPath.join(qDir, 'custom-ui-wallpaper.bin');
            const qWpMeta = qPath.join(qDir, 'custom-ui-wallpaper.meta.json');
            const ensureDir = () => { if (!qFs.existsSync(qDir)) qFs.mkdirSync(qDir, { recursive: true }); };

            qIpc.handle('qusa:load-config', () => {
                try {
                    if (qFs.existsSync(qCfgFile)) {
                        return JSON.parse(qFs.readFileSync(qCfgFile, 'utf8'));
                    }
                } catch (e) { console.error('[Qusa] load-config error:', e); }
                return null;
            });
            qIpc.handle('qusa:save-config', (_ev, cfg) => {
                try {
                    ensureDir();
                    const tmp = qCfgFile + '.tmp';
                    qFs.writeFileSync(tmp, JSON.stringify(cfg, null, 2), 'utf8');
                    qFs.renameSync(tmp, qCfgFile);
                    return true;
                } catch (e) { console.error('[Qusa] save-config error:', e); return false; }
            });
            qIpc.handle('qusa:load-wallpaper', () => {
                try {
                    if (qFs.existsSync(qWpBin)) {
                        const meta = qFs.existsSync(qWpMeta) ? JSON.parse(qFs.readFileSync(qWpMeta, 'utf8')) : {};
                        const buf = qFs.readFileSync(qWpBin);
                        return { bytes: new Uint8Array(buf), name: meta.name || '', type: meta.type || '' };
                    }
                } catch (e) { console.error('[Qusa] load-wallpaper error:', e); }
                return null;
            });
            qIpc.handle('qusa:save-wallpaper', (_ev, payload) => {
                try {
                    ensureDir();
                    const buf = Buffer.from(payload.bytes);
                    qFs.writeFileSync(qWpBin, buf);
                    qFs.writeFileSync(qWpMeta, JSON.stringify({ name: payload.name || '', type: payload.type || '' }), 'utf8');
                    return true;
                } catch (e) { console.error('[Qusa] save-wallpaper error:', e); return false; }
            });
            qIpc.handle('qusa:clear-wallpaper', () => {
                try {
                    if (qFs.existsSync(qWpBin)) qFs.unlinkSync(qWpBin);
                    if (qFs.existsSync(qWpMeta)) qFs.unlinkSync(qWpMeta);
                    return true;
                } catch (e) { console.error('[Qusa] clear-wallpaper error:', e); return false; }
            });
        } catch (err) {
            console.error('[Qusa] Failed to register IPC:', err);
        }
    }
    hubContents.on('did-finish-load', () => {
        try {
            const fsMod = require('fs');
            const pathMod = require('path');
            const customUiPath = pathMod.join(__dirname, 'qusaCustomUI.js');
            const customUiCode = fsMod.readFileSync(customUiPath, 'utf8');
            void hubContents.executeJavaScript(customUiCode).catch((err) => {
                console.error('[Qusa] executeJavaScript failed:', err);
            });
        } catch (err) {
            console.error('[Qusa] Failed to inject custom UI:', err);
        }
    });
"""


def make_integrity(data: bytes) -> dict:
    block_size = 4194304
    full_hash = hashlib.sha256(data).hexdigest()
    blocks = [
        hashlib.sha256(data[i : i + block_size]).hexdigest()
        for i in range(0, max(1, len(data)), block_size)
    ]
    return {
        "algorithm": "SHA256",
        "hash": full_hash,
        "blockSize": block_size,
        "blocks": blocks,
    }


def read_asar(path: str):
    with open(path, "rb") as f:
        raw16 = f.read(16)
        if len(raw16) < 16:
            raise ValueError("Invalid ASAR file (too short)")
        _, hdr_pickle_size, _, hdr_str_size = struct.unpack("<IIII", raw16)
        header = json.loads(f.read(hdr_str_size).decode("utf-8"))
        base_offset = 8 + hdr_pickle_size
        f.seek(base_offset)
        payload = f.read()
    return header, payload


def get_file_bytes(header: dict, payload: bytes, parts: list[str]) -> bytes | None:
    node = header
    for p in parts:
        files = node.get("files")
        if not files or p not in files:
            return None
        node = files[p]
    if "offset" not in node or "size" not in node:
        return None
    off = int(node["offset"])
    sz = int(node["size"])
    return payload[off : off + sz]


def is_patched(header: dict, payload: bytes) -> tuple[bool, str]:
    pkg_bytes = get_file_bytes(header, payload, ["package.json"])
    ver = "unknown"
    if pkg_bytes:
        try:
            ver = json.loads(pkg_bytes.decode("utf-8")).get("version", "unknown")
        except Exception:
            pass

    qusa = get_file_bytes(header, payload, ["dist", "qusaCustomUI.js"])
    preload = get_file_bytes(header, payload, ["dist", "preload.js"])
    utils = get_file_bytes(header, payload, ["dist", "utils.js"])

    if not qusa or not preload or not utils:
        return False, ver
    ok = (
        PRELOAD_MARKER in preload.decode("utf-8", errors="replace")
        and UTILS_MARKER in utils.decode("utf-8", errors="replace")
    )
    return ok, ver


def patch_asar(src_path: str, ui_js_path: str, out_path: str, force: bool = False) -> int:
    header, old_payload = read_asar(src_path)
    already, ver = is_patched(header, old_payload)
    if already and not force:
        print(f"ALREADY_PATCHED version={ver}")
        return 0

    with open(ui_js_path, "rb") as f:
        qusa_bytes = f.read()

    preload_raw = get_file_bytes(header, old_payload, ["dist", "preload.js"])
    utils_raw = get_file_bytes(header, old_payload, ["dist", "utils.js"])
    if preload_raw is None or utils_raw is None:
        print("ERROR: Missing dist/preload.js or dist/utils.js in ASAR", file=sys.stderr)
        return 1

    preload_src = preload_raw.decode("utf-8")
    if PRELOAD_MARKER not in preload_src:
        patched_preload_bytes = (preload_src + PRELOAD_HOOK).encode("utf-8")
    else:
        patched_preload_bytes = preload_raw

    utils_src = utils_raw.decode("utf-8")
    if UTILS_MARKER not in utils_src:
        m = re.search(r"^[ \t]*(?:void[ \t]+)?win\.loadURL\(url\);", utils_src, flags=re.MULTILINE)
        if not m:
            print("ERROR: Could not find win.loadURL(url) hook point in dist/utils.js", file=sys.stderr)
            return 1
        patched_utils_bytes = (
            utils_src[: m.start()] + UTILS_HOOK + utils_src[m.start() :]
        ).encode("utf-8")
    else:
        patched_utils_bytes = utils_raw

    header["files"]["dist"]["files"]["qusaCustomUI.js"] = {
        "size": len(qusa_bytes),
        "offset": "0",
        "integrity": make_integrity(qusa_bytes),
    }

    chunks = []
    cur_offset = 0

    def process_node(node, path_parts):
        nonlocal cur_offset
        if "files" in node:
            for name, child in node["files"].items():
                process_node(child, path_parts + [name])
        else:
            if node.get("unpacked"):
                return
            if path_parts == ["dist", "qusaCustomUI.js"]:
                data = qusa_bytes
                node["integrity"] = make_integrity(data)
            elif path_parts == ["dist", "utils.js"]:
                data = patched_utils_bytes
                node["integrity"] = make_integrity(data)
            elif path_parts == ["dist", "preload.js"]:
                data = patched_preload_bytes
                node["integrity"] = make_integrity(data)
            else:
                old_off = int(node["offset"])
                old_sz = int(node["size"])
                data = old_payload[old_off : old_off + old_sz]
            node["offset"] = str(cur_offset)
            node["size"] = len(data)
            chunks.append(data)
            cur_offset += len(data)

    process_node(header, [])

    new_hdr_bytes = json.dumps(header, separators=(",", ":"), ensure_ascii=False).encode("utf-8")
    pad_len = (4 - (len(new_hdr_bytes) % 4)) % 4
    new_hdr_padded = new_hdr_bytes + (b"\x00" * pad_len)
    new_hdr_str_size = len(new_hdr_bytes)
    new_hdr_inner_size = len(new_hdr_padded) + 4
    new_hdr_pickle_size = new_hdr_inner_size + 4

    tmp_path = out_path + ".tmp"
    with open(tmp_path, "wb") as out:
        out.write(
            struct.pack(
                "<IIII", 4, new_hdr_pickle_size, new_hdr_inner_size, new_hdr_str_size
            )
        )
        out.write(new_hdr_padded)
        for c in chunks:
            out.write(c)

    os.replace(tmp_path, out_path)
    print(f"PATCHED_OK version={ver} size={os.path.getsize(out_path)}")
    return 0


def main():
    parser = argparse.ArgumentParser(description="Antigravity ASAR dynamic custom UI patcher")
    parser.add_argument("--check", help="Check if ASAR is already patched (exit 0=patched, 2=unpatched)")
    parser.add_argument("--patch", help="Source ASAR to patch")
    parser.add_argument("--ui", help="Path to qusaCustomUI.js")
    parser.add_argument("--out", help="Output ASAR path")
    parser.add_argument("--force", action="store_true", help="Re-inject qusaCustomUI.js even if already patched")
    args = parser.parse_args()

    if args.check:
        try:
            header, payload = read_asar(args.check)
            ok, ver = is_patched(header, payload)
            print(f"{'PATCHED' if ok else 'UNPATCHED'} version={ver}")
            sys.exit(0 if ok else 2)
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(1)

    if args.patch:
        if not args.ui or not args.out:
            print("ERROR: --patch requires --ui and --out", file=sys.stderr)
            sys.exit(1)
        try:
            rc = patch_asar(args.patch, args.ui, args.out, force=args.force)
            sys.exit(rc)
        except Exception as e:
            print(f"ERROR: {e}", file=sys.stderr)
            sys.exit(1)

    parser.print_help()
    sys.exit(1)


if __name__ == "__main__":
    main()
