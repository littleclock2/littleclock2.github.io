<script setup>
import { ref, watch, nextTick } from 'vue'

const STORAGE_PREFIX = 'ef_about_'
const sKey = (k) => STORAGE_PREFIX + k

// ══ 编辑权限 ════════════════════════════════════════════════
const isEditing = ref(false)
const showPwdModal = ref(false)
const pwdInput = ref('')
const pwdError = ref('')
const AUTH_KEY = 'ef_about_edit_auth'

async function hashStr(s) {
  const buf = new TextEncoder().encode(s)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function tryEnableEdit() {
  // 已认证过直接进入
  if (false) {
    isEditing.value = true
    return
  }
  showPwdModal.value = true
  pwdInput.value = ''
  pwdError.value = ''
}

async function submitPwd() {
  const h = await hashStr(pwdInput.value)
  if (false) {
    isEditing.value = true
    showPwdModal.value = false
    localStorage.setItem(AUTH_KEY, '1')
  } else {
    pwdError.value = 'ACCESS DENIED'
    pwdInput.value = ''
  }
}

function lockEdit() {
  isEditing.value = false
  localStorage.removeItem(AUTH_KEY)
}

const profile = ref(load('profile', {
  name: 'YUNSWORD',
  role: '嵌入式开发工程师 · MCU · 硬件设计',
  quote: '「在比特与电子之间，寻找无限可能。」'
}))

const skills = ref(load('skills', [
  { name: 'MCU 开发', pct: 95, tools: 'STM32 · TI MSPM0' },
  { name: '开发环境', pct: 88, tools: 'Keil · IAR · CCS' },
  { name: '编程语言', pct: 88, tools: 'C · C++ · Python' },
  { name: 'PCB 设计', pct: 78, tools: 'Altium Designer · KiCad' },
  { name: 'Android', pct: 68, tools: 'Kotlin · Java' },
]))

const fields = ref(load('fields', [
  { icon: '▸', title: '嵌入式系统设计', desc: '从需求分析到固件实现' },
  { icon: '▸', title: '模拟电路设计', desc: '信号链、电源管理、传感器接口' },
  { icon: '▸', title: '信号处理', desc: '数字滤波、FFT、调制解调' },
  { icon: '▸', title: '仪器仪表开发', desc: 'LC 表、万用表、信号发生器' },
]))

const avatarUrl = ref(load('avatar', ''))
const showcaseImages = ref(load('showcase', []))

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(sKey(key))
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}
function save(key, val) {
  try { localStorage.setItem(sKey(key), JSON.stringify(val)) } catch {}
}

watch(profile, (v) => save('profile', v), { deep: true })
watch(skills, (v) => save('skills', v), { deep: true })
watch(fields, (v) => save('fields', v), { deep: true })
watch(avatarUrl, (v) => save('avatar', v))
watch(showcaseImages, (v) => save('showcase', v), { deep: true })

// ══ 裁剪 ════════════════════════════════════════════════
const cropVisible = ref(false)
const cropImgSrc = ref('')
const cropAspect = ref(1) // 1=square, 0.75=3:4
const cropCallback = ref(null)

// 裁剪框状态
const cropBox = ref({ x: 0, y: 0, w: 0, h: 0 })
const imgNatural = ref({ w: 0, h: 0 })
const imgDisplay = ref({ w: 0, h: 0, offsetX: 0, offsetY: 0 })
const dragging = ref(false)
const dragType = ref('') // 'move' | 'nw' | 'ne' | 'sw' | 'se'
const dragStart = ref({ x: 0, y: 0 })
const boxStart = ref({ x: 0, y: 0, w: 0, h: 0 })

function openCrop(file, aspect, cb) {
  const reader = new FileReader()
  reader.onload = (e) => {
    cropImgSrc.value = e.target.result
    cropAspect.value = aspect
    cropCallback.value = cb
    cropVisible.value = true
    nextTick(() => initCropBox())
  }
  reader.readAsDataURL(file)
}

function initCropBox() {
  const img = document.querySelector('.ef-crop-img')
  if (!img) return
  const rect = img.getBoundingClientRect()
  imgDisplay.value = { w: rect.width, h: rect.height, offsetX: rect.left, offsetY: rect.top }
  imgNatural.value = { w: img.naturalWidth, h: img.naturalHeight }

  // 初始裁剪框：居中，最大尺寸
  const maxW = rect.width * 0.8
  const maxH = rect.height * 0.8
  let w, h
  if (cropAspect.value >= 1) {
    w = Math.min(maxW, maxH * cropAspect.value)
    h = w / cropAspect.value
  } else {
    h = Math.min(maxH, maxW / cropAspect.value)
    w = h * cropAspect.value
  }
  cropBox.value = {
    x: (rect.width - w) / 2,
    y: (rect.height - h) / 2,
    w, h
  }
}

function onCropMouseDown(e, type) {
  e.preventDefault()
  e.stopPropagation()
  dragging.value = true
  dragType.value = type
  dragStart.value = { x: e.clientX, y: e.clientY }
  boxStart.value = { ...cropBox.value }
}

function onCropMouseMove(e) {
  if (!dragging.value) return
  const dx = e.clientX - dragStart.value.x
  const dy = e.clientY - dragStart.value.y
  const b = { ...boxStart.value }
  const imgW = imgDisplay.value.w
  const imgH = imgDisplay.value.h
  const aspect = cropAspect.value

  if (dragType.value === 'move') {
    b.x = Math.max(0, Math.min(imgW - b.w, b.x + dx))
    b.y = Math.max(0, Math.min(imgH - b.h, b.y + dy))
  } else {
    // 角落拖拽：保持比例
    let newW = b.w, newH = b.h
    if (dragType.value === 'se') {
      newW = Math.max(40, Math.min(imgW - b.x, b.w + dx))
      newH = newW / aspect
    } else if (dragType.value === 'sw') {
      newW = Math.max(40, b.w - dx)
      newH = newW / aspect
      b.x = b.x + (b.w - newW)
    } else if (dragType.value === 'ne') {
      newW = Math.max(40, Math.min(imgW - b.x, b.w + dx))
      newH = newW / aspect
      b.y = b.y + (b.h - newH)
    } else if (dragType.value === 'nw') {
      newW = Math.max(40, b.w - dx)
      newH = newW / aspect
      b.x = b.x + (b.w - newW)
      b.y = b.y + (b.h - newH)
    }
    // 边界检查
    if (b.x + newW > imgW) { newW = imgW - b.x; newH = newW / aspect }
    if (b.y + newH > imgH) { newH = imgH - b.y; newW = newH * aspect }
    if (b.x < 0) { newW += b.x; newH = newW / aspect; b.x = 0 }
    if (b.y < 0) { newH += b.y; newW = newH * aspect; b.y = 0 }
    b.w = newW; b.h = newH
  }
  cropBox.value = b
}

function onCropMouseUp() {
  dragging.value = false
}

function confirmCrop() {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = document.querySelector('.ef-crop-img')
  if (!img) return

  const displayW = imgDisplay.value.w
  const displayH = imgDisplay.value.h
  const scaleX = img.naturalWidth / displayW
  const scaleY = img.naturalHeight / displayH

  const sx = cropBox.value.x * scaleX
  const sy = cropBox.value.y * scaleY
  const sw = cropBox.value.w * scaleX
  const sh = cropBox.value.h * scaleY

  canvas.width = sw
  canvas.height = sh
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh)

  const result = canvas.toDataURL('image/jpeg', 0.7)
  if (cropCallback.value) cropCallback.value(result)
  cropVisible.value = false
}

function cancelCrop() {
  cropVisible.value = false
}

// ══ 上传入口 ════════════════════════════════════════════════
function handleAvatarUpload(e) {
  const file = e.target.files[0]
  if (!file) return
  openCrop(file, 1, (url) => { avatarUrl.value = url })
}

function handleShowcaseUpload(e) {
  const files = Array.from(e.target.files)
  let idx = 0
  function next() {
    if (idx >= files.length) return
    openCrop(files[idx], 3 / 4, (url) => {
      showcaseImages.value.push({ url, name: files[idx].name })
      idx++
      next()
    })
  }
  next()
}

function removeShowcase(index) {
  showcaseImages.value.splice(index, 1)
}

// ══ 技能/领域编辑 ════════════════════════════════════════════════
function addSkill() {
  skills.value.push({ name: 'NEW SKILL', pct: 50, tools: '' })
}
function removeSkill(i) {
  skills.value.splice(i, 1)
}
function addField() {
  fields.value.push({ icon: '▸', title: 'NEW FIELD', desc: '' })
}
function removeField(i) {
  fields.value.splice(i, 1)
}
</script>

<template>
  <div class="ef-about">
    <!-- 编辑模式切换 -->
    <div class="ef-about-toolbar">
      <template v-if="isEditing">
        <button class="ef-about-edit-btn ef-about-edit-btn--lock" @click="lockEdit">🔒 LOCK</button>
        <button class="ef-about-edit-btn ef-about-edit-btn--active" @click="isEditing = false">✓ DONE</button>
      </template>
      <button v-else class="ef-about-edit-btn" @click="tryEnableEdit">✎ EDIT</button>
    </div>

    <!-- 头像展示区 -->
    <div class="ef-about-hero">
      <div class="ef-about-avatar-wrap">
        <div class="ef-about-avatar-border">
          <div class="ef-about-avatar" v-if="avatarUrl">
            <img :src="avatarUrl" alt="avatar" />
          </div>
          <div class="ef-about-avatar ef-about-avatar--empty" v-else>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <circle cx="24" cy="18" r="10" stroke="currentColor" stroke-width="1.5"/>
              <path d="M8 44c0-10 7-16 16-16s16 6 16 16" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <label class="ef-about-avatar-upload">
              UPLOAD AVATAR
              <input type="file" accept="image/*" @change="handleAvatarUpload" hidden />
            </label>
          </div>
          <!-- 编辑模式：更换头像 -->
          <label v-if="isEditing && avatarUrl" class="ef-about-avatar-replace">
            REPLACE
            <input type="file" accept="image/*" @change="handleAvatarUpload" hidden />
          </label>
        </div>
        <div class="ef-about-corner ef-about-corner--tl"></div>
        <div class="ef-about-corner ef-about-corner--tr"></div>
        <div class="ef-about-corner ef-about-corner--bl"></div>
        <div class="ef-about-corner ef-about-corner--br"></div>
      </div>

      <div class="ef-about-info">
        <p class="ef-about-code-name">CODE NAME</p>
        <h1 class="ef-about-name">
          <template v-if="isEditing">
            <input v-model="profile.name" class="ef-inline-input ef-inline-input--name" />
          </template>
          <template v-else>{{ profile.name }}</template>
        </h1>
        <p class="ef-about-role">
          <template v-if="isEditing">
            <input v-model="profile.role" class="ef-inline-input ef-inline-input--role" />
          </template>
          <template v-else>{{ profile.role }}</template>
        </p>
        <div class="ef-about-divider"></div>
        <p class="ef-about-quote">
          <template v-if="isEditing">
            <input v-model="profile.quote" class="ef-inline-input ef-inline-input--quote" />
          </template>
          <template v-else>{{ profile.quote }}</template>
        </p>
      </div>
    </div>

    <!-- 技能面板 -->
    <div class="ef-about-section">
      <h2 class="ef-about-section-title">
        <span class="ef-about-section-bar"></span>
        SKILL PANEL
        <button v-if="isEditing" class="ef-section-add" @click="addSkill">+ ADD</button>
      </h2>
      <div class="ef-about-skills">
        <div class="ef-about-skill" v-for="(s, i) in skills" :key="i">
          <span class="ef-about-skill-name" v-if="!isEditing">{{ s.name }}</span>
          <input v-else v-model="s.name" class="ef-about-skill-input" />
          <div class="ef-about-skill-bar">
            <div class="ef-about-skill-fill" :style="{ width: s.pct + '%' }"></div>
          </div>
          <input v-if="isEditing" v-model.number="s.pct" type="range" min="0" max="100" class="ef-about-skill-range" />
          <span class="ef-about-skill-tools" v-if="!isEditing">{{ s.tools }}</span>
          <input v-else v-model="s.tools" class="ef-about-skill-input ef-about-skill-input--right" />
          <button v-if="isEditing" class="ef-item-remove" @click="removeSkill(i)">×</button>
        </div>
      </div>
    </div>

    <!-- 任务领域 -->
    <div class="ef-about-section">
      <h2 class="ef-about-section-title">
        <span class="ef-about-section-bar"></span>
        FIELD OF OPERATIONS
        <button v-if="isEditing" class="ef-section-add" @click="addField">+ ADD</button>
      </h2>
      <div class="ef-about-fields">
        <div class="ef-about-field" v-for="(f, i) in fields" :key="i">
          <span class="ef-about-field-icon">{{ f.icon }}</span>
          <div class="ef-about-field-body">
            <template v-if="isEditing">
              <input v-model="f.title" class="ef-about-field-input ef-about-field-input--title" />
              <input v-model="f.desc" class="ef-about-field-input ef-about-field-input--desc" />
            </template>
            <template v-else>
              <strong>{{ f.title }}</strong>
              <p>{{ f.desc }}</p>
            </template>
          </div>
          <button v-if="isEditing" class="ef-item-remove" @click="removeField(i)">×</button>
        </div>
      </div>
    </div>

    <!-- 立绘/图片展示区 -->
    <div class="ef-about-section">
      <h2 class="ef-about-section-title">
        <span class="ef-about-section-bar"></span>
        SHOWCASE
      </h2>
      <div class="ef-about-showcase" v-if="showcaseImages.length">
        <div class="ef-about-showcase-item" v-for="(img, i) in showcaseImages" :key="i">
          <img :src="img.url" :alt="img.name" />
          <button v-if="isEditing" class="ef-about-showcase-remove" @click="removeShowcase(i)">×</button>
        </div>
      </div>
      <div class="ef-about-showcase-empty" v-if="isEditing">
        <label class="ef-about-showcase-upload">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="18" height="18" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
            <path d="M12 8v8M8 12h8" stroke="currentColor" stroke-width="1.2"/>
          </svg>
          <span>上传立绘 / 图片</span>
          <input type="file" accept="image/*" multiple @change="handleShowcaseUpload" hidden />
        </label>
      </div>
    </div>

    <!-- 通信频道 -->
    <div class="ef-about-section">
      <h2 class="ef-about-section-title">
        <span class="ef-about-section-bar"></span>
        COMMUNICATION
      </h2>
      <div class="ef-about-links">
        <a href="https://github.com/littleclock2" target="_blank" class="ef-about-link">
          <span class="ef-about-link-label">GITHUB</span>
          <span class="ef-about-link-value">littleclock2</span>
          <span class="ef-about-link-arrow">→</span>
        </a>
        <a href="mailto:contact@example.invalid" class="ef-about-link">
          <span class="ef-about-link-label">EMAIL</span>
          <span class="ef-about-link-value">contact@example.invalid</span>
          <span class="ef-about-link-arrow">→</span>
        </a>
      </div>
    </div>

    <!-- ══ 密码验证弹窗 ═══════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="showPwdModal" class="ef-pwd-overlay" @click.self="showPwdModal = false">
        <div class="ef-pwd-box">
          <p class="ef-pwd-title">RESTRICTED ACCESS</p>
          <p class="ef-pwd-sub">请输入编辑密码</p>
          <div class="ef-pwd-row">
            <input v-model="pwdInput" type="password" class="ef-pwd-input" placeholder="密码" @keyup.enter="submitPwd" />
            <button class="ef-pwd-btn" @click="submitPwd">ENTER</button>
          </div>
          <p v-if="pwdError" class="ef-pwd-error">{{ pwdError }}</p>
        </div>
      </div>
    </Teleport>

    <!-- ══ 裁剪弹窗 ═══════════════════════════════════════ -->
    <Teleport to="body">
      <div v-if="cropVisible" class="ef-crop-overlay" @mousemove="onCropMouseMove" @mouseup="onCropMouseUp" @mouseleave="onCropMouseUp">
        <div class="ef-crop-modal">
          <p class="ef-crop-title">CROP IMAGE</p>
          <div class="ef-crop-viewport">
            <img :src="cropImgSrc" class="ef-crop-img" @load="initCropBox" />
            <!-- 裁剪遮罩 -->
            <div class="ef-crop-mask" :style="{
              clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${cropBox.x}px ${cropBox.y}px, ${cropBox.x}px ${cropBox.y + cropBox.h}px, ${cropBox.x + cropBox.w}px ${cropBox.y + cropBox.h}px, ${cropBox.x + cropBox.w}px ${cropBox.y}px, ${cropBox.x}px ${cropBox.y}px)`
            }"></div>
            <!-- 裁剪框 -->
            <div class="ef-crop-box" :style="{ left: cropBox.x + 'px', top: cropBox.y + 'px', width: cropBox.w + 'px', height: cropBox.h + 'px' }">
              <div class="ef-crop-handle ef-crop-nw" @mousedown="onCropMouseDown($event, 'nw')"></div>
              <div class="ef-crop-handle ef-crop-ne" @mousedown="onCropMouseDown($event, 'ne')"></div>
              <div class="ef-crop-handle ef-crop-sw" @mousedown="onCropMouseDown($event, 'sw')"></div>
              <div class="ef-crop-handle ef-crop-se" @mousedown="onCropMouseDown($event, 'se')"></div>
              <div class="ef-crop-move" @mousedown="onCropMouseDown($event, 'move')"></div>
              <!-- 十字参考线 -->
              <div class="ef-crop-cross-h"></div>
              <div class="ef-crop-cross-v"></div>
            </div>
          </div>
          <div class="ef-crop-actions">
            <button class="ef-crop-btn ef-crop-cancel" @click="cancelCrop">CANCEL</button>
            <button class="ef-crop-btn ef-crop-confirm" @click="confirmCrop">CONFIRM</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.ef-about { max-width: 800px; }

/* ══ 工具栏 ════════════════════════════════════════════ */
.ef-about-toolbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
.ef-about-edit-btn {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 3px;
  padding: 8px 20px;
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #777;
  cursor: pointer;
  transition: all 0.2s;
}
.ef-about-edit-btn:hover { border-color: var(--ef-yellow); color: var(--ef-yellow); }
.ef-about-edit-btn--active { background: var(--ef-yellow); color: #0a0a0a; border-color: var(--ef-yellow); }

/* ══ Hero区 ════════════════════════════════════════════ */
.ef-about-hero {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 48px;
  padding-bottom: 40px;
  border-bottom: 1px solid #1e1e1e;
}
.ef-about-avatar-wrap { position: relative; flex-shrink: 0; }
.ef-about-avatar-border {
  width: 120px; height: 120px;
  border: 2px solid var(--ef-yellow);
  display: flex; align-items: center; justify-content: center;
  background: #111; position: relative; overflow: visible;
}
.ef-about-avatar { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.ef-about-avatar img { width: 100%; height: 100%; object-fit: cover; }
.ef-about-avatar--empty { flex-direction: column; color: #333; }
.ef-about-avatar-upload {
  font-size: 8px; letter-spacing: 2px; color: #555;
  cursor: pointer; margin-top: 6px; transition: color 0.2s;
}
.ef-about-avatar-upload:hover { color: var(--ef-yellow); }
.ef-about-avatar-replace {
  position: absolute; bottom: -24px; left: 50%; transform: translateX(-50%);
  font-size: 8px; letter-spacing: 2px; color: #555; cursor: pointer;
  white-space: nowrap; transition: color 0.2s;
}
.ef-about-avatar-replace:hover { color: var(--ef-yellow); }

/* 四角装饰 */
.ef-about-corner { position: absolute; width: 10px; height: 10px; }
.ef-about-corner::before, .ef-about-corner::after { content: ''; position: absolute; background: var(--ef-yellow); }
.ef-about-corner::before { width: 1px; height: 100%; }
.ef-about-corner::after { width: 100%; height: 1px; }
.ef-about-corner--tl { top: -6px; left: -6px; }
.ef-about-corner--tl::before { top: 0; left: 0; }
.ef-about-corner--tl::after { top: 0; left: 0; }
.ef-about-corner--tr { top: -6px; right: -6px; }
.ef-about-corner--tr::before { top: 0; right: 0; }
.ef-about-corner--tr::after { top: 0; right: 0; }
.ef-about-corner--bl { bottom: -6px; left: -6px; }
.ef-about-corner--bl::before { bottom: 0; left: 0; }
.ef-about-corner--bl::after { bottom: 0; left: 0; }
.ef-about-corner--br { bottom: -6px; right: -6px; }
.ef-about-corner--br::before { bottom: 0; right: 0; }
.ef-about-corner--br::after { bottom: 0; right: 0; }

.ef-about-code-name { font-family: 'Share Tech Mono', monospace; font-size: 10px; letter-spacing: 4px; color: #555; margin: 0 0 4px; }
.ef-about-name { font-family: 'Inter', sans-serif; font-weight: 900; font-size: 36px; letter-spacing: 4px; color: #fff; margin: 0 0 8px; text-transform: uppercase; }
.ef-about-role { font-size: 14px; color: #777; margin: 0 0 16px; letter-spacing: 1px; }
.ef-about-divider { width: 40px; height: 2px; background: var(--ef-yellow); margin-bottom: 16px; }
.ef-about-quote { font-size: 13px; color: #555; font-style: italic; margin: 0; }

/* ══ 内联编辑输入框 ════════════════════════════════════════ */
.ef-inline-input {
  background: transparent; border: 1px solid #2a2a2a; color: inherit;
  font: inherit; width: 100%; padding: 2px 4px; outline: none;
  transition: border-color 0.2s;
}
.ef-inline-input:focus { border-color: var(--ef-yellow); }
.ef-inline-input--name { font-size: 36px; font-weight: 900; letter-spacing: 4px; }
.ef-inline-input--role { font-size: 14px; letter-spacing: 1px; }
.ef-inline-input--quote { font-size: 13px; font-style: italic; }

/* ══ Section ════════════════════════════════════════════ */
.ef-about-section { margin-bottom: 40px; }
.ef-about-section-title {
  font-family: 'Inter', sans-serif; font-weight: 800; font-size: 12px;
  letter-spacing: 3px; color: #888; text-transform: uppercase;
  display: flex; align-items: center; gap: 10px;
  margin: 0 0 20px; padding-bottom: 12px; border-bottom: 1px solid #1e1e1e;
}
.ef-about-section-bar { width: 3px; height: 14px; background: var(--ef-yellow); flex-shrink: 0; }
.ef-section-add {
  margin-left: auto; font-size: 10px; letter-spacing: 1px;
  background: transparent; border: 1px solid #2a2a2a; color: #666;
  padding: 3px 10px; cursor: pointer; transition: all 0.2s;
}
.ef-section-add:hover { border-color: var(--ef-yellow); color: var(--ef-yellow); }
.ef-item-remove {
  background: transparent; border: none; color: #555; font-size: 16px;
  cursor: pointer; padding: 0 4px; transition: color 0.2s; flex-shrink: 0;
}
.ef-item-remove:hover { color: #ff4060; }

/* ══ 技能条 ════════════════════════════════════════════ */
.ef-about-skills { display: flex; flex-direction: column; gap: 14px; }
.ef-about-skill { display: flex; align-items: center; gap: 12px; }
.ef-about-skill-name { font-family: 'Share Tech Mono', monospace; font-size: 12px; color: #999; letter-spacing: 1px; min-width: 80px; }
.ef-about-skill-bar { flex: 1; height: 4px; background: #1a1a1a; position: relative; }
.ef-about-skill-fill { height: 100%; background: var(--ef-yellow); transition: width 0.3s ease; }
.ef-about-skill-tools { font-size: 11px; color: #555; min-width: 140px; text-align: right; }
.ef-about-skill-input {
  background: transparent; border: 1px solid #2a2a2a; color: #ccc;
  font-family: 'Share Tech Mono', monospace; font-size: 11px;
  padding: 2px 6px; outline: none; min-width: 0;
}
.ef-about-skill-input:focus { border-color: var(--ef-yellow); }
.ef-about-skill-input--right { text-align: right; }
.ef-about-skill-range { width: 60px; accent-color: var(--ef-yellow); }

/* ══ 任务领域 ════════════════════════════════════════════ */
.ef-about-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.ef-about-field { display: flex; gap: 10px; padding: 14px; background: #111; border: 1px solid #1e1e1e; }
.ef-about-field-icon { color: var(--ef-yellow); font-size: 12px; margin-top: 2px; }
.ef-about-field-body { flex: 1; }
.ef-about-field strong { display: block; font-size: 13px; color: #ddd; margin-bottom: 4px; font-weight: 700; }
.ef-about-field p { font-size: 12px; color: #666; margin: 0; }
.ef-about-field-input {
  width: 100%; background: transparent; border: 1px solid #2a2a2a;
  color: #ccc; font: inherit; padding: 2px 4px; outline: none; margin-bottom: 4px;
}
.ef-about-field-input:focus { border-color: var(--ef-yellow); }
.ef-about-field-input--title { font-size: 13px; font-weight: 700; }
.ef-about-field-input--desc { font-size: 12px; color: #888; }

/* ══ 立绘展示 ════════════════════════════════════════════ */
.ef-about-showcase { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 8px; margin-bottom: 12px; }
.ef-about-showcase-item { position: relative; border: 1px solid #1e1e1e; background: #111; aspect-ratio: 3/4; overflow: hidden; }
.ef-about-showcase-item img { width: 100%; height: 100%; object-fit: cover; }
.ef-about-showcase-remove {
  position: absolute; top: 6px; right: 6px; width: 20px; height: 20px;
  background: rgba(0,0,0,0.7); border: 1px solid #333; color: #999;
  font-size: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;
}
.ef-about-showcase-remove:hover { border-color: #ff4060; color: #ff4060; }
.ef-about-showcase-empty { border: 2px dashed #1e1e1e; padding: 32px; text-align: center; }
.ef-about-showcase-upload {
  display: inline-flex; flex-direction: column; align-items: center; gap: 8px;
  color: #444; cursor: pointer; transition: color 0.2s; font-size: 12px; letter-spacing: 1px;
}
.ef-about-showcase-upload:hover { color: var(--ef-yellow); }

/* ══ 通信频道 ════════════════════════════════════════════ */
.ef-about-links { display: flex; flex-direction: column; gap: 2px; }
.ef-about-link { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: #111; border: 1px solid #1e1e1e; text-decoration: none; transition: all 0.2s; }
.ef-about-link:hover { border-color: #2a2a2a; background: #161616; }
.ef-about-link-label { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 10px; letter-spacing: 3px; color: #555; width: 80px; flex-shrink: 0; }
.ef-about-link-value { font-family: 'Share Tech Mono', monospace; font-size: 13px; color: #999; flex: 1; }
.ef-about-link-arrow { color: #333; transition: color 0.2s, transform 0.2s; }
.ef-about-link:hover .ef-about-link-arrow { color: var(--ef-yellow); transform: translateX(4px); }

/* ══ 密码弹窗 ════════════════════════════════════════════ */
.ef-pwd-overlay {
  position: fixed; inset: 0; z-index: 9998;
  background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
}
.ef-pwd-box {
  text-align: center; padding: 32px; background: #111; border: 1px solid #2a2a2a;
}
.ef-pwd-title { font-family: 'Inter', sans-serif; font-weight: 800; font-size: 13px; letter-spacing: 4px; color: #ccc; margin: 0 0 6px; }
.ef-pwd-sub { font-size: 12px; color: #666; margin: 0 0 20px; }
.ef-pwd-row { display: flex; gap: 0; }
.ef-pwd-input {
  background: #0c0c0c; border: 1px solid #2a2a2a; color: #ddd;
  padding: 10px 14px; font-family: 'Share Tech Mono', monospace; font-size: 13px;
  outline: none; width: 180px;
}
.ef-pwd-input:focus { border-color: var(--ef-yellow); }
.ef-pwd-btn {
  background: var(--ef-yellow); color: #0a0a0a; border: none;
  padding: 10px 18px; font-family: 'Inter', sans-serif; font-weight: 700;
  font-size: 11px; letter-spacing: 2px; cursor: pointer;
}
.ef-pwd-btn:hover { background: #ffe800; }
.ef-pwd-error { color: #ff4060; font-family: 'Share Tech Mono', monospace; font-size: 11px; letter-spacing: 2px; margin-top: 12px; }
.ef-about-edit-btn--lock { margin-right: 8px; }

/* ══ 裁剪弹窗 ════════════════════════════════════════════ */
.ef-crop-overlay {
  position: fixed; inset: 0; z-index: 9999;
  background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center;
  cursor: crosshair;
}
.ef-crop-modal { background: #111; border: 1px solid #2a2a2a; padding: 20px; max-width: 600px; width: 90vw; }
.ef-crop-title { font-family: 'Inter', sans-serif; font-weight: 700; font-size: 11px; letter-spacing: 3px; color: #888; margin: 0 0 12px; }
.ef-crop-viewport { position: relative; overflow: hidden; background: #0a0a0a; line-height: 0; }
.ef-crop-img { max-width: 100%; max-height: 50vh; display: block; user-select: none; pointer-events: none; }
.ef-crop-mask { position: absolute; inset: 0; background: rgba(0,0,0,0.6); pointer-events: none; }
.ef-crop-box {
  position: absolute; border: 2px solid var(--ef-yellow); cursor: move;
  box-shadow: 0 0 0 1px rgba(0,0,0,0.5);
}
.ef-crop-move { position: absolute; inset: 0; cursor: move; }
.ef-crop-handle {
  position: absolute; width: 12px; height: 12px; background: var(--ef-yellow);
  border: 1px solid #0a0a0a; z-index: 1;
}
.ef-crop-nw { top: -6px; left: -6px; cursor: nw-resize; }
.ef-crop-ne { top: -6px; right: -6px; cursor: ne-resize; }
.ef-crop-sw { bottom: -6px; left: -6px; cursor: sw-resize; }
.ef-crop-se { bottom: -6px; right: -6px; cursor: se-resize; }
.ef-crop-cross-h { position: absolute; top: 50%; left: 0; right: 0; height: 1px; background: rgba(255,241,0,0.2); pointer-events: none; }
.ef-crop-cross-v { position: absolute; left: 50%; top: 0; bottom: 0; width: 1px; background: rgba(255,241,0,0.2); pointer-events: none; }
.ef-crop-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }
.ef-crop-btn {
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 11px;
  letter-spacing: 2px; padding: 8px 20px; cursor: pointer; border: none; transition: all 0.2s;
}
.ef-crop-cancel { background: #2a2a2a; color: #999; }
.ef-crop-cancel:hover { background: #333; }
.ef-crop-confirm { background: var(--ef-yellow); color: #0a0a0a; }
.ef-crop-confirm:hover { background: #ffe800; }

/* ══ 响应式 ════════════════════════════════════════════ */
@media (max-width: 768px) {
  .ef-about-hero { flex-direction: column; text-align: center; gap: 24px; }
  .ef-about-avatar-border { width: 100px; height: 100px; }
  .ef-about-name, .ef-inline-input--name { font-size: 28px !important; }
  .ef-about-skill { flex-wrap: wrap; }
  .ef-about-fields { grid-template-columns: 1fr; }
}
</style>
