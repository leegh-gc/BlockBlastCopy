/**
 * Block Blast 앱 아이콘 생성 스크립트 (순수 Node.js, 외부 의존성 없음)
 * zlib을 사용한 최소 PNG 인코더
 */
import { deflateSync } from 'zlib'
import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = join(__dirname, '..', 'public', 'icons')
mkdirSync(outDir, { recursive: true })

// --- Minimal PNG encoder ---
function crc32(buf) {
  const table = crc32.table || (crc32.table = (() => {
    const t = new Uint32Array(256)
    for (let i = 0; i < 256; i++) {
      let c = i
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
      t[i] = c
    }
    return t
  })())
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = table[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length)
  const crcBuf = Buffer.concat([typeBytes, data])
  const crcVal = Buffer.alloc(4)
  crcVal.writeUInt32BE(crc32(crcBuf))
  return Buffer.concat([len, typeBytes, data, crcVal])
}

function encodePNG(width, height, pixels) {
  // pixels: Uint8Array of RGBA values, row by row
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // color type: RGB (no alpha to simplify — using RGBA type=6 instead)
  ihdr[9] = 6   // RGBA
  ihdr[10] = 0  // compression
  ihdr[11] = 0  // filter
  ihdr[12] = 0  // interlace

  const rawRows = []
  for (let y = 0; y < height; y++) {
    rawRows.push(0) // filter byte: None
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      rawRows.push(pixels[i], pixels[i+1], pixels[i+2], pixels[i+3])
    }
  }
  const raw = Buffer.from(rawRows)
  const compressed = deflateSync(raw, { level: 6 })

  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

// --- Icon drawing ---
function drawIcon(size) {
  const pixels = new Uint8Array(size * size * 4)

  function setPixel(x, y, r, g, b, a = 255) {
    if (x < 0 || x >= size || y < 0 || y >= size) return
    const i = (y * size + x) * 4
    pixels[i] = r; pixels[i+1] = g; pixels[i+2] = b; pixels[i+3] = a
  }

  function fillRect(x0, y0, w, h, r, g, b, a = 255) {
    for (let dy = 0; dy < h; dy++)
      for (let dx = 0; dx < w; dx++)
        setPixel(x0 + dx, y0 + dy, r, g, b, a)
  }

  function fillRoundRect(x0, y0, w, h, rad, r, g, b, a = 255) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        const cx = x0 + dx, cy = y0 + dy
        // Corner check
        const inCorner =
          (cx < x0 + rad && cy < y0 + rad && dist(cx, cy, x0 + rad, y0 + rad) > rad) ||
          (cx >= x0 + w - rad && cy < y0 + rad && dist(cx, cy, x0 + w - rad, y0 + rad) > rad) ||
          (cx < x0 + rad && cy >= y0 + h - rad && dist(cx, cy, x0 + rad, y0 + h - rad) > rad) ||
          (cx >= x0 + w - rad && cy >= y0 + h - rad && dist(cx, cy, x0 + w - rad, y0 + h - rad) > rad)
        if (!inCorner) setPixel(cx, cy, r, g, b, a)
      }
    }
  }

  function dist(x1, y1, x2, y2) {
    return Math.sqrt((x1-x2)**2 + (y1-y2)**2)
  }

  const corner = Math.round(size * 0.22)
  // Blue background
  fillRoundRect(0, 0, size, size, corner, 0, 122, 255)

  // 5x5 block grid
  const gridSize = 5
  const gridPad = Math.round(size * 0.12)
  const gap = Math.round(size * 0.025)
  const cellSize = Math.floor((size - gridPad * 2 - gap * (gridSize - 1)) / gridSize)
  const cellRad = Math.round(cellSize * 0.18)

  const pattern = [
    [0, 1, 1, 1, 0],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 0, 1],
    [1, 1, 0, 1, 1],
    [0, 1, 1, 1, 0],
  ]

  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const x = gridPad + col * (cellSize + gap)
      const y = gridPad + row * (cellSize + gap)
      const filled = pattern[row][col] === 1
      if (filled) {
        fillRoundRect(x, y, cellSize, cellSize, cellRad, 255, 255, 255)
      } else {
        fillRoundRect(x, y, cellSize, cellSize, cellRad, 255, 255, 255, 64)
      }
    }
  }

  return encodePNG(size, size, pixels)
}

writeFileSync(join(outDir, 'icon-192.png'), drawIcon(192))
writeFileSync(join(outDir, 'icon-512.png'), drawIcon(512))
console.log('Icons generated successfully: public/icons/icon-192.png, public/icons/icon-512.png')
