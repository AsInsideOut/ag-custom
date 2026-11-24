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
    translateText: (text) => electron_1.ipcRenderer.invoke('qusa:translate', text),
    translateBatch: (texts) => electron_1.ipcRenderer.invoke('qusa:translate-batch', texts),
    spotifyState: () => electron_1.ipcRenderer.invoke('qusa:spotify-state'),
    spotifyPeak: () => electron_1.ipcRenderer.invoke('qusa:spotify-peak'),
    spotifyAction: (cmd) => electron_1.ipcRenderer.invoke('qusa:spotify-action', cmd),
    spotifyOpen: (uri) => electron_1.ipcRenderer.invoke('qusa:spotify-open', uri),
    spotifyLyrics: (payload) => electron_1.ipcRenderer.invoke('qusa:spotify-lyrics', payload),
    spotifyCover: (payload) => electron_1.ipcRenderer.invoke('qusa:spotify-cover', payload),
    loadLyricsFont: () => electron_1.ipcRenderer.invoke('qusa:load-lyrics-font'),
    saveLyricsFont: (payload) => electron_1.ipcRenderer.invoke('qusa:save-lyrics-font', payload),
    clearLyricsFont: () => electron_1.ipcRenderer.invoke('qusa:clear-lyrics-font'),
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
            const qFontBin = qPath.join(qDir, 'custom-lyrics-font.bin');
            const qFontMeta = qPath.join(qDir, 'custom-lyrics-font.meta.json');
            qIpc.handle('qusa:load-lyrics-font', () => {
                try {
                    if (qFs.existsSync(qFontBin)) {
                        const meta = qFs.existsSync(qFontMeta) ? JSON.parse(qFs.readFileSync(qFontMeta, 'utf8')) : {};
                        const buf = qFs.readFileSync(qFontBin);
                        return { bytes: new Uint8Array(buf), name: meta.name || 'custom.ttf', builtin: false };
                    }
                    const builtinFont = qPath.join(__dirname, 'qusa_lyrics_font.ttf');
                    if (qFs.existsSync(builtinFont)) {
                        const buf = qFs.readFileSync(builtinFont);
                        return { bytes: new Uint8Array(buf), name: 'aahigherup.ttf', builtin: true };
                    }
                } catch (e) { console.error('[Qusa] load-lyrics-font error:', e); }
                return null;
            });
            qIpc.handle('qusa:save-lyrics-font', (_ev, payload) => {
                try {
                    ensureDir();
                    const buf = Buffer.from(payload.bytes);
                    qFs.writeFileSync(qFontBin, buf);
                    qFs.writeFileSync(qFontMeta, JSON.stringify({ name: payload.name || 'custom.ttf' }), 'utf8');
                    return true;
                } catch (e) { console.error('[Qusa] save-lyrics-font error:', e); return false; }
            });
            qIpc.handle('qusa:clear-lyrics-font', () => {
                try {
                    if (qFs.existsSync(qFontBin)) qFs.unlinkSync(qFontBin);
                    if (qFs.existsSync(qFontMeta)) qFs.unlinkSync(qFontMeta);
                    return true;
                } catch (e) { console.error('[Qusa] clear-lyrics-font error:', e); return false; }
            });
            const qTransFile = qPath.join(qDir, 'custom-ui-trans-cache.json');
            const qTransCache = new Map();
            try {
                if (qFs.existsSync(qTransFile)) {
                    const saved = JSON.parse(qFs.readFileSync(qTransFile, 'utf8'));
                    if (saved && typeof saved === 'object') {
                        for (const [k, v] of Object.entries(saved)) qTransCache.set(k, v);
                    }
                }
            } catch {}
            const saveTransCache = () => {
                try {
                    ensureDir();
                    const obj = {};
                    let count = 0;
                    for (const [k, v] of qTransCache.entries()) {
                        obj[k] = v;
                        if (++count >= 1200) break;
                    }
                    qFs.writeFileSync(qTransFile, JSON.stringify(obj), 'utf8');
                } catch {}
            };
            const qHttps = require('https');
            const httpGetJson = (url) => new Promise((resolve) => {
                const req = qHttps.get(url, { timeout: 6000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
                    const chunks = [];
                    res.on('data', (chunk) => { chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)); });
                    res.on('end', () => {
                        if (res.statusCode !== 200) return resolve(null);
                        try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); } catch { resolve(null); }
                    });
                });
                req.on('error', () => resolve(null));
                req.on('timeout', () => { req.destroy(); resolve(null); });
            });
            let googleBlockedUntil = 0;
            const translateGoogleBatch = async (items) => {
                if (Date.now() < googleBlockedUntil) return null;
                const joined = items.join('\\n');
                const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ru&dt=t&q=' + encodeURIComponent(joined);
                const data = await httpGetJson(url);
                if (!data || !Array.isArray(data[0])) {
                    googleBlockedUntil = Date.now() + 180000;
                    return null;
                }
                const full = data[0].map((part) => (Array.isArray(part) ? part[0] : '')).join('');
                const lines = full.split('\\n');
                if (lines.length === items.length) return lines;
                return null;
            };
            const translateMyMemoryOne = async (text) => {
                const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=en|ru';
                const data = await httpGetJson(url);
                const out = data && data.responseData && data.responseData.translatedText;
                if (typeof out === 'string' && out.trim() && !/MYMEMORY WARNING/i.test(out)) {
                    return out.trim();
                }
                return null;
            };
            const runBatchTranslate = async (texts) => {
                const result = {};
                const todo = [];
                for (const raw of (Array.isArray(texts) ? texts : [])) {
                    const clean = String(raw || '').trim();
                    if (!clean || clean.length > 400) continue;
                    if (qTransCache.has(clean)) {
                        result[clean] = qTransCache.get(clean);
                    } else if (!todo.includes(clean)) {
                        todo.push(clean);
                    }
                }
                let changed = false;
                for (let idx = 0; idx < todo.length; idx += 12) {
                    const slice = todo.slice(idx, idx + 12);
                    const gRes = await translateGoogleBatch(slice);
                    if (gRes) {
                        for (let j = 0; j < slice.length; j++) {
                            const t = (gRes[j] || '').trim();
                            if (t && t !== slice[j]) {
                                qTransCache.set(slice[j], t);
                                result[slice[j]] = t;
                                changed = true;
                            }
                        }
                    } else {
                        for (const item of slice) {
                            const mRes = await translateMyMemoryOne(item);
                            if (mRes && mRes !== item) {
                                qTransCache.set(item, mRes);
                                result[item] = mRes;
                                changed = true;
                            }
                            await new Promise((r) => setTimeout(r, 180));
                        }
                    }
                }
                if (changed) saveTransCache();
                return result;
            };
            qIpc.handle('qusa:translate-batch', async (_ev, texts) => {
                try { return await runBatchTranslate(texts); } catch { return {}; }
            });
            qIpc.handle('qusa:translate', async (_ev, text) => {
                try {
                    const clean = String(text || '').trim();
                    if (!clean) return clean;
                    const map = await runBatchTranslate([clean]);
                    return map[clean] || clean;
                } catch { return text; }
            });

            // --- Spotify Native Windows GSMTC Bridge ---
            const { spawn: qSpawn } = require('child_process');
            const { app: qApp, shell: qShell } = require('electron');
            const qSpBridgeSrc = qPath.join(__dirname, 'qusa_spotify_bridge.ps1');
            const qSpBridgeDisk = qPath.join(qDir, 'qusa-spotify-bridge.ps1');
            let qSpProc = null;
            let qSpBuf = '';
            const qSpQueue = [];

            const ensureSpotifyBridge = () => {
                if (process.platform !== 'win32') return null;
                if (qSpProc && !qSpProc.killed) return qSpProc;
                try {
                    ensureDir();
                    if (qFs.existsSync(qSpBridgeSrc)) {
                        qFs.writeFileSync(qSpBridgeDisk, qFs.readFileSync(qSpBridgeSrc, 'utf8'), 'utf8');
                    }
                    if (!qFs.existsSync(qSpBridgeDisk)) return null;
                    qSpProc = qSpawn('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File', qSpBridgeDisk], {
                        windowsHide: true,
                        stdio: ['pipe', 'pipe', 'ignore'],
                    });
                    qSpBuf = '';
                    qSpProc.stdout.setEncoding('utf8');
                    qSpProc.stdout.on('data', (chunk) => {
                        qSpBuf += chunk;
                        let nl;
                        while ((nl = qSpBuf.indexOf('\\n')) !== -1) {
                            const line = qSpBuf.slice(0, nl).trim();
                            qSpBuf = qSpBuf.slice(nl + 1);
                            const waiter = qSpQueue.shift();
                            if (waiter) {
                                clearTimeout(waiter.timer);
                                try { waiter.resolve(JSON.parse(line)); } catch { waiter.resolve({ running: false }); }
                            }
                        }
                    });
                    const clearAll = () => {
                        qSpProc = null;
                        while (qSpQueue.length > 0) {
                            const w = qSpQueue.shift();
                            clearTimeout(w.timer);
                            w.resolve({ running: false });
                        }
                    };
                    qSpProc.on('exit', clearAll);
                    qSpProc.on('error', clearAll);
                    return qSpProc;
                } catch {
                    qSpProc = null;
                    return null;
                }
            };

            if (qApp && typeof qApp.on === 'function') {
                qApp.on('will-quit', () => {
                    try {
                        if (qSpProc && !qSpProc.killed) {
                            qSpProc.stdin.write('exit\\n');
                            qSpProc.kill();
                        }
                    } catch {}
                });
            }

            const sendSpotifyCmd = (cmd) => new Promise((resolve) => {
                const proc = ensureSpotifyBridge();
                if (!proc || !proc.stdin || proc.stdin.destroyed) return resolve({ running: false });
                if (qSpQueue.length > 6) return resolve(null);
                const waiter = {
                    resolve,
                    timer: setTimeout(() => {
                        const idx = qSpQueue.indexOf(waiter);
                        if (idx !== -1) qSpQueue.splice(idx, 1);
                        resolve(null);
                    }, 3500),
                };
                qSpQueue.push(waiter);
                try {
                    proc.stdin.write(String(cmd) + '\\n');
                } catch {
                    const idx = qSpQueue.indexOf(waiter);
                    if (idx !== -1) qSpQueue.splice(idx, 1);
                    clearTimeout(waiter.timer);
                    resolve(null);
                }
            });

            qIpc.handle('qusa:spotify-state', () => sendSpotifyCmd('state'));
            qIpc.handle('qusa:spotify-peak', () => sendSpotifyCmd('peak'));
            qIpc.handle('qusa:spotify-action', (_ev, cmd) => {
                const allowed = ['playpause', 'next', 'prev', 'repeat', 'like'];
                const isSeek = typeof cmd === 'string' && /^seek:\\d+(?:\\.\\d+)?$/.test(cmd);
                if (!allowed.includes(cmd) && !isSeek) return { running: false };
                return sendSpotifyCmd(cmd);
            });
            qIpc.handle('qusa:spotify-open', (_ev, uri) => {
                try {
                    const s = String(uri || '').trim();
                    if (s.startsWith('spotify:')) {
                        void qShell.openExternal(s);
                        return true;
                    }
                } catch {}
                return false;
            });
            const qLyricsCache = new Map();
            qIpc.handle('qusa:spotify-lyrics', async (_ev, payload) => {
                try {
                    const artist = String((payload && payload.artist) || '').trim();
                    const title = String((payload && payload.title) || '').trim();
                    const dur = Math.round(Number((payload && payload.duration) || 0));
                    if (!title && !artist) return { synced: '', plain: '', duration: 0, cover: '' };
                    const key = (artist + '|' + title + '|' + (dur > 0 ? Math.round(dur / 3) : 0)).toLowerCase();
                    if (qLyricsCache.has(key)) return qLyricsCache.get(key);

                    const tLow = title.toLowerCase();
                    const aLow = artist.toLowerCase();

                    const fetchLyrics = async () => {
                        const badVerRe = /\\b(slowed|sped\\s*up|speed\\s*up|nightcore|reverb|8d|remix|karaoke|mashup|pitched|daycore)\\b/i;
                        const origHasBad = badVerRe.test(title);
                        const isVersionClean = (item) => {
                            if (origHasBad) return true;
                            const txt = String((item && item.trackName) || '') + ' ' + String((item && item.albumName) || '');
                            return !badVerRe.test(txt);
                        };
                        const durMatches = (item, tol) => {
                            if (dur <= 1) return true;
                            const itDur = Number((item && item.duration) || 0);
                            if (itDur <= 1) return false;
                            return Math.abs(itDur - dur) <= tol;
                        };
                        const pickBestSynced = (list, tol) => {
                            if (!Array.isArray(list) || list.length === 0) return null;
                            const valid = list.filter((it) => it && it.syncedLyrics && isVersionClean(it) && durMatches(it, tol));
                            if (valid.length === 0) return null;
                            const scored = valid.map((it) => {
                                let sc = 0;
                                const itT = String(it.trackName || '').toLowerCase();
                                const itA = String(it.artistName || '').toLowerCase();
                                if (tLow && itT === tLow) sc += 40;
                                else if (tLow && (itT.includes(tLow) || tLow.includes(itT))) sc += 20;
                                if (aLow && itA === aLow) sc += 35;
                                else if (aLow && (itA.includes(aLow) || aLow.includes(itA))) sc += 16;
                                const itDur = Number(it.duration || 0);
                                if (dur > 1 && itDur > 1) sc += Math.max(0, 30 - Math.abs(itDur - dur) * 10);
                                return { it, sc };
                            }).sort((a, b) => b.sc - a.sc);
                            return scored[0] ? scored[0].it : null;
                        };

                        let plainFallback = '';
                        let plainDur = 0;
                        const collectPlain = (list) => {
                            if (plainFallback || !Array.isArray(list)) return;
                            const p = list.find((it) => it && it.plainLyrics && isVersionClean(it));
                            if (p) { plainFallback = p.plainLyrics; plainDur = Number(p.duration || 0); }
                        };

                        // 1. Exact get with strict duration check (+-2.5s)
                        if (artist && title) {
                            const durParam = dur > 1 ? '&duration=' + dur : '';
                            const exact = await httpGetJson('https://lrclib.net/api/get?artist_name=' + encodeURIComponent(artist) + '&track_name=' + encodeURIComponent(title) + durParam);
                            if (exact && isVersionClean(exact)) {
                                if (exact.syncedLyrics && durMatches(exact, 2.5)) {
                                    return { synced: exact.syncedLyrics, plain: exact.plainLyrics || '', duration: Number(exact.duration || 0) };
                                }
                                if (exact.plainLyrics) { plainFallback = exact.plainLyrics; plainDur = Number(exact.duration || 0); }
                            }
                        }

                        // 2. Structured search (track_name + artist_name)
                        let allLists = [];
                        if (artist && title) {
                            const list1 = await httpGetJson('https://lrclib.net/api/search?track_name=' + encodeURIComponent(title) + '&artist_name=' + encodeURIComponent(artist));
                            if (Array.isArray(list1)) allLists = allLists.concat(list1);
                            const b1 = pickBestSynced(list1, 2.5);
                            if (b1) return { synced: b1.syncedLyrics, plain: b1.plainLyrics || '', duration: Number(b1.duration || 0) };
                            collectPlain(list1);
                        }

                        // 3. Free-text search (artist + title)
                        const qStr = (artist ? artist + ' ' : '') + title;
                        const list2 = await httpGetJson('https://lrclib.net/api/search?q=' + encodeURIComponent(qStr));
                        if (Array.isArray(list2)) allLists = allLists.concat(list2);
                        const b2 = pickBestSynced(list2, 2.5);
                        if (b2) return { synced: b2.syncedLyrics, plain: b2.plainLyrics || '', duration: Number(b2.duration || 0) };
                        collectPlain(list2);

                        // 4. Clean title fallback (strip "(feat...)", "- Remastered", etc.)
                        const cleanTitle = title.replace(/\\s*[(\\[].*?[)\\]]/g, '').replace(/\\s*-\\s*(remaster|radio|single|edit|version).*$/i, '').trim();
                        if (cleanTitle && cleanTitle.toLowerCase() !== tLow) {
                            const list3 = await httpGetJson('https://lrclib.net/api/search?track_name=' + encodeURIComponent(cleanTitle) + (artist ? '&artist_name=' + encodeURIComponent(artist) : ''));
                            if (Array.isArray(list3)) allLists = allLists.concat(list3);
                            const b3 = pickBestSynced(list3, 2.5);
                            if (b3) return { synced: b3.syncedLyrics, plain: b3.plainLyrics || '', duration: Number(b3.duration || 0) };
                            collectPlain(list3);
                        }

                        // 5. Relaxed duration tolerance (+-6s, still strictly excluding slowed/sped-up/remix) for slight outro silence differences
                        const bRelaxed = pickBestSynced(allLists, 6.0);
                        if (bRelaxed) return { synced: bRelaxed.syncedLyrics, plain: bRelaxed.plainLyrics || '', duration: Number(bRelaxed.duration || 0) };

                        // 6. Fallback plain lyrics via lyrics.ovh if LRCLIB had nothing
                        if (!plainFallback && artist && title) {
                            const ovh = await httpGetJson('https://api.lyrics.ovh/v1/' + encodeURIComponent(artist) + '/' + encodeURIComponent(cleanTitle || title));
                            if (ovh && ovh.lyrics) plainFallback = String(ovh.lyrics);
                        }

                        return { synced: '', plain: plainFallback, duration: plainDur };
                    };

                    const lyr = await fetchLyrics();
                    const out = {
                        synced: lyr.synced || '',
                        plain: lyr.plain || '',
                        duration: lyr.duration || 0,
                    };
                    if (qLyricsCache.size > 150) {
                        const firstKey = qLyricsCache.keys().next().value;
                        if (firstKey !== undefined) qLyricsCache.delete(firstKey);
                    }
                    qLyricsCache.set(key, out);
                    return out;
                } catch {
                    return { synced: '', plain: '', duration: 0 };
                }
            });
            const qCoverCache = new Map();
            qIpc.handle('qusa:spotify-cover', async (_ev, payload) => {
                try {
                    const artist = String((payload && payload.artist) || '').trim();
                    const title = String((payload && payload.title) || '').trim();
                    if (!title && !artist) return { cover: '', duration: 0 };
                    const key = (artist + '|' + title).toLowerCase();
                    if (qCoverCache.has(key)) return qCoverCache.get(key);
                    const tLow = title.toLowerCase();
                    const aLow = artist.toLowerCase();
                    const qStr = (artist ? artist + ' ' : '') + title;
                    let out = { cover: '', duration: 0 };
                    try {
                        const dz = await httpGetJson('https://api.deezer.com/search?limit=5&q=' + encodeURIComponent(qStr));
                        if (dz && Array.isArray(dz.data) && dz.data.length > 0) {
                            const best = dz.data.map((it) => {
                                let sc = 0;
                                const itT = String((it && it.title) || '').toLowerCase();
                                const itA = String((it && it.artist && it.artist.name) || '').toLowerCase();
                                if (tLow && itT === tLow) sc += 35;
                                else if (tLow && (itT.includes(tLow) || tLow.includes(itT))) sc += 16;
                                if (aLow && itA === aLow) sc += 30;
                                else if (aLow && (itA.includes(aLow) || aLow.includes(itA))) sc += 14;
                                return { it, sc };
                            }).sort((a, b) => b.sc - a.sc)[0];
                            if (best && best.sc >= 14 && best.it && best.it.album) {
                                const cov = best.it.album.cover_big || best.it.album.cover_medium || '';
                                if (cov) out = { cover: cov, duration: Number(best.it.duration || 0) };
                            }
                        }
                    } catch {}
                    if (!out.cover) {
                        try {
                            const itunes = await httpGetJson('https://itunes.apple.com/search?entity=song&limit=5&term=' + encodeURIComponent(qStr));
                            if (itunes && Array.isArray(itunes.results) && itunes.results.length > 0) {
                                const best = itunes.results.map((it) => {
                                    let sc = 0;
                                    const itT = String((it && it.trackName) || '').toLowerCase();
                                    const itA = String((it && it.artistName) || '').toLowerCase();
                                    if (tLow && itT === tLow) sc += 35;
                                    else if (tLow && (itT.includes(tLow) || tLow.includes(itT))) sc += 16;
                                    if (aLow && itA === aLow) sc += 30;
                                    else if (aLow && (itA.includes(aLow) || aLow.includes(itA))) sc += 14;
                                    return { it, sc };
                                }).sort((a, b) => b.sc - a.sc)[0];
                                if (best && best.sc >= 14 && best.it && best.it.artworkUrl100) {
                                    out = {
                                        cover: String(best.it.artworkUrl100).replace('100x100bb', '600x600bb'),
                                        duration: Math.round(Number(best.it.trackTimeMillis || 0) / 1000),
                                    };
                                }
                            }
                        } catch {}
                    }
                    if (qCoverCache.size > 200) {
                        const firstKey = qCoverCache.keys().next().value;
                        if (firstKey !== undefined) qCoverCache.delete(firstKey);
                    }
                    qCoverCache.set(key, out);
                    return out;
                } catch {
                    return { cover: '', duration: 0 };
                }
            });
        } catch (err) {
            console.error('[Qusa] Failed to register IPC:', err);
        }
    }
    if (process.platform === 'win32' && typeof win?.setTitleBarOverlay === 'function' && !win.__qusaOverlayPatched) {
        win.__qusaOverlayPatched = true;
        const origSetOverlay = win.setTitleBarOverlay.bind(win);
        win.setTitleBarOverlay = (opts) => origSetOverlay({ ...(opts || {}), color: '#00000000', symbolColor: '#e2e8f0', height: (opts && opts.height) || 30 });
        try { win.setTitleBarOverlay({}); } catch (_e) {}
    }
    hubContents.on('did-finish-load', () => {
        try {
            if (process.platform === 'win32' && typeof win?.setTitleBarOverlay === 'function') {
                win.setTitleBarOverlay({ color: '#00000000', symbolColor: '#e2e8f0', height: 30 });
            }
        } catch (_e) {}
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
    hubContents.on('did-frame-finish-load', (_ev, isMainFrame, frameProcessId, frameRoutingId) => {
        if (isMainFrame) return;
        try {
            const { webFrameMain } = require('electron');
            const frame = webFrameMain.fromId(frameProcessId, frameRoutingId);
            if (!frame) return;
            const u = String(frame.url || '');
            if (!u.startsWith('plugin://') && !u.startsWith('http://localhost:') && !u.startsWith('http://127.0.0.1:')) return;
            const sidecarJs = "(() => { if (document.getElementById('qusa-sidecar-style')) return; const st = document.createElement('style'); st.id = 'qusa-sidecar-style'; st.textContent = 'html, body, #root, #app, #root > div, main { background: transparent !important; background-color: transparent !important; }'; (document.head || document.documentElement).appendChild(st); const clean = () => { document.querySelectorAll('div, main, section, aside, header, nav').forEach((el) => { const cs = getComputedStyle(el); const m = cs.backgroundColor && cs.backgroundColor.match(/^rgba?\\\\(\\\\s*(\\\\d+),\\\\s*(\\\\d+),\\\\s*(\\\\d+)(?:,\\\\s*([\\\\d.]+))?\\\\s*\\\\)/); if (!m) return; const r = +m[1], g = +m[2], b = +m[3], a = m[4] === undefined ? 1 : +m[4]; if (a >= 0.85 && Math.max(r,g,b) - Math.min(r,g,b) <= 18 && r <= 48 && g <= 48 && b <= 48) { const rect = el.getBoundingClientRect(); if (rect.width >= 180 && rect.height >= 120) el.style.setProperty('background-color', 'transparent', 'important'); } }); }; clean(); setTimeout(clean, 400); setTimeout(clean, 1400); new MutationObserver(() => clean()).observe(document.documentElement, { childList: true, subtree: true }); })();";
            void frame.executeJavaScript(sidecarJs).catch(() => {});
        } catch (_e) {}
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

    base_dir = os.path.dirname(os.path.abspath(ui_js_path))
    sp_bridge_path = os.path.join(base_dir, "qusa_spotify_bridge.ps1")
    sp_bridge_bytes = None
    if os.path.exists(sp_bridge_path):
        with open(sp_bridge_path, "rb") as f:
            sp_bridge_bytes = f.read()

    lyrics_font_bytes = None
    default_font_path = os.path.join(base_dir, "assets", "aahigherup.ttf")
    if os.path.exists(default_font_path):
        with open(default_font_path, "rb") as f:
            lyrics_font_bytes = f.read()

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
        hook_patterns = [
            r"^[ \t]*(?:void[ \t]+)?loadHubWindowUrl\(win,",
            r"^[ \t]*(?:void[ \t]+)?win\.loadURL\(url\);",
            r"^[ \t]*\(0,\s*previewViewers_1\.registerPreviewViewer\)\(hubContents\);",
        ]
        m = None
        for pat in hook_patterns:
            m = re.search(pat, utils_src, flags=re.MULTILINE)
            if m:
                break
        if not m:
            print("ERROR: Could not find Hub window hook point in dist/utils.js", file=sys.stderr)
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
    if sp_bridge_bytes is not None:
        header["files"]["dist"]["files"]["qusa_spotify_bridge.ps1"] = {
            "size": len(sp_bridge_bytes),
            "offset": "0",
            "integrity": make_integrity(sp_bridge_bytes),
        }
    if lyrics_font_bytes is not None:
        header["files"]["dist"]["files"]["qusa_lyrics_font.ttf"] = {
            "size": len(lyrics_font_bytes),
            "offset": "0",
            "integrity": make_integrity(lyrics_font_bytes),
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
            elif path_parts == ["dist", "qusa_spotify_bridge.ps1"] and sp_bridge_bytes is not None:
                data = sp_bridge_bytes
                node["integrity"] = make_integrity(data)
            elif path_parts == ["dist", "qusa_lyrics_font.ttf"] and lyrics_font_bytes is not None:
                data = lyrics_font_bytes
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
