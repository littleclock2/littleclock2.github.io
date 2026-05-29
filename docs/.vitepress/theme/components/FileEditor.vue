<script setup>
import { ref, computed } from 'vue'

// 密码保护 — 使用 hash 校验，密码不以明文存储在源码中
const isAuthed = ref(false)
const passwordInput = ref('')
const passwordError = ref('')
const STORAGE_KEY = 'ef_editor_auth'

async function hashPassword(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function checkPassword() {
  const h = await hashPassword(passwordInput.value)
  // terminus2024 的 SHA-256
  if (false) {
    isAuthed.value = true
    passwordError.value = ''
    localStorage.setItem(STORAGE_KEY, '1')
  } else {
    passwordError.value = 'ACCESS DENIED'
    passwordInput.value = ''
  }
}

// 检查是否已认证
if (false) {
  isAuthed.value = true
}

function lockEditor() {
  isAuthed.value = false
  localStorage.removeItem(STORAGE_KEY)
  passwordInput.value = ''
}

// 编辑器状态
const fileLoaded = ref(false)
const fileName = ref('')
const fileContent = ref('')
const previewHtml = ref('')
const activeTab = ref('edit')
const dragOver = ref(false)
const charCount = ref(0)
const lineCount = ref(0)

function updateStats() {
  charCount.value = fileContent.value.length
  lineCount.value = fileContent.value.split('\n').length
}

function handleDrop(e) {
  e.preventDefault()
  dragOver.value = false
  const file = e.dataTransfer.files[0]
  if (file) readFile(file)
}

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (file) readFile(file)
}

function readFile(file) {
  fileName.value = file.name
  const reader = new FileReader()
  reader.onload = (e) => {
    fileContent.value = e.target.result
    fileLoaded.value = true
    updateStats()
    renderPreview()
  }
  reader.readAsText(file)
}

function renderPreview() {
  let md = fileContent.value
  md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  md = md.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  md = md.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  md = md.replace(/\*(.+?)\*/g, '<em>$1</em>')
  md = md.replace(/`([^`]+)`/g, '<code>$1</code>')
  md = md.replace(/^- (.+)$/gm, '<li>$1</li>')
  md = md.replace(/\n\n/g, '</p><p>')
  md = '<p>' + md + '</p>'
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="language-$1">$2</code></pre>')
  previewHtml.value = md
}

function handleInput() {
  updateStats()
  if (activeTab.value === 'preview') renderPreview()
}

function switchTab(tab) {
  activeTab.value = tab
  if (tab === 'preview') renderPreview()
}

function downloadFile() {
  const blob = new Blob([fileContent.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName.value || 'document.md'
  a.click()
  URL.revokeObjectURL(url)
}

function newFile() {
  fileContent.value = '# New Document\n\nStart writing here...'
  fileName.value = 'untitled.md'
  fileLoaded.value = true
  updateStats()
}

function clearEditor() {
  fileContent.value = ''
  fileName.value = ''
  fileLoaded.value = false
  previewHtml.value = ''
}
</script>

<template>
  <!-- 密码保护界面 -->
  <div v-if="!isAuthed" class="ef-lock">
    <div class="ef-lock-box">
      <div class="ef-lock-icon">
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="14" width="20" height="16" stroke="currentColor" stroke-width="1.5"/>
          <path d="M10 14V10a6 6 0 0112 0v4" stroke="currentColor" stroke-width="1.5"/>
          <circle cx="16" cy="22" r="2" fill="currentColor"/>
        </svg>
      </div>
      <p class="ef-lock-title">RESTRICTED ACCESS</p>
      <p class="ef-lock-sub">此页面仅限授权人员访问</p>
      <div class="ef-lock-input-row">
        <input
          v-model="passwordInput"
          type="password"
          class="ef-lock-input"
          placeholder="输入访问密码"
          @keyup.enter="checkPassword"
        />
        <button class="ef-lock-btn" @click="checkPassword">ENTER</button>
      </div>
      <p v-if="passwordError" class="ef-lock-error">{{ passwordError }}</p>
    </div>
  </div>

  <!-- 编辑器主体 -->
  <div v-else class="ef-editor">
    <!-- 编辑器头部 -->
    <div class="ef-editor-header">
      <div class="ef-editor-title">
        <span class="ef-editor-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 2h10v10H2z" stroke="currentColor" stroke-width="1"/>
            <path d="M4 5h6M4 7h4M4 9h5" stroke="currentColor" stroke-width="0.8"/>
          </svg>
        </span>
        <span class="ef-editor-label">TERMINAL</span>
        <span class="ef-editor-filename" v-if="fileName">{{ fileName }}</span>
      </div>
      <div class="ef-editor-stats">
        <span>{{ lineCount }} lines</span>
        <span class="ef-sep">|</span>
        <span>{{ charCount }} chars</span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="ef-editor-toolbar">
      <div class="ef-editor-tabs">
        <button :class="['ef-tab', { 'ef-tab--active': activeTab === 'edit' }]" @click="switchTab('edit')">EDIT</button>
        <button :class="['ef-tab', { 'ef-tab--active': activeTab === 'preview' }]" @click="switchTab('preview')">PREVIEW</button>
      </div>
      <div class="ef-editor-actions">
        <button class="ef-btn" @click="newFile">+ NEW</button>
        <label class="ef-btn">
          UPLOAD
          <input type="file" accept=".md,.txt,.c,.h,.py,.js,.css,.html,.json" @change="handleFileSelect" hidden />
        </label>
        <button class="ef-btn" @click="downloadFile" :disabled="!fileLoaded">EXPORT</button>
        <button v-if="fileLoaded" class="ef-btn ef-btn--danger" @click="clearEditor">CLEAR</button>
        <button class="ef-btn ef-btn--lock" @click="lockEditor">🔒 LOCK</button>
      </div>
    </div>

    <!-- 拖拽区/编辑器 -->
    <div v-if="!fileLoaded"
      :class="['ef-dropzone', { 'ef-dropzone--active': dragOver }]"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop="handleDrop"
    >
      <div class="ef-dropzone-inner">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <rect x="6" y="6" width="28" height="28" stroke="currentColor" stroke-width="1.2" stroke-dasharray="3 2"/>
          <path d="M20 14v12M14 20h12" stroke="currentColor" stroke-width="1.2"/>
        </svg>
        <p class="ef-dropzone-text">DROP FILE HERE</p>
        <p class="ef-dropzone-hint">.md .txt .c .h .py .js .css .json</p>
        <label class="ef-dropzone-btn">
          BROWSE
          <input type="file" accept=".md,.txt,.c,.h,.py,.js,.css,.html,.json" @change="handleFileSelect" hidden />
        </label>
      </div>
    </div>

    <div v-else class="ef-editor-body">
      <textarea v-if="activeTab === 'edit'" v-model="fileContent" @input="handleInput"
        class="ef-textarea" spellcheck="false" placeholder="Start typing..."></textarea>
      <div v-else class="ef-preview vp-doc" v-html="previewHtml"></div>
    </div>

    <!-- 状态栏 -->
    <div class="ef-statusbar">
      <span class="ef-status-item"><span class="ef-dot"></span> {{ fileLoaded ? 'LOADED' : 'READY' }}</span>
      <span class="ef-status-item" v-if="fileName">FILE: {{ fileName }}</span>
      <span class="ef-status-right">UTF-8 | MARKDOWN</span>
    </div>
  </div>
</template>

<style scoped>
/* ══ 密码锁 ════════════════════════════════════════════ */

.ef-lock {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.ef-lock-box {
  text-align: center;
  padding: 40px;
  border: 1px solid #1e1e1e;
  background: #111;
}

.ef-lock-icon { color: var(--ef-yellow); margin-bottom: 20px; }

.ef-lock-title {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 14px;
  letter-spacing: 4px;
  color: #ccc;
  margin: 0 0 8px;
}

.ef-lock-sub {
  font-size: 13px;
  color: #666;
  margin: 0 0 24px;
}

.ef-lock-input-row {
  display: flex;
  gap: 0;
}

.ef-lock-input {
  background: #0c0c0c;
  border: 1px solid #2a2a2a;
  color: #ddd;
  padding: 10px 16px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  outline: none;
  width: 200px;
}

.ef-lock-input:focus { border-color: var(--ef-yellow); }

.ef-lock-btn {
  background: var(--ef-yellow);
  color: #0a0a0a;
  border: none;
  padding: 10px 20px;
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: all 0.2s;
}

.ef-lock-btn:hover { background: #ffe800; }

.ef-lock-error {
  color: #ff4060;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  letter-spacing: 2px;
  margin-top: 12px;
}

/* ══ 编辑器 ════════════════════════════════════════════ */

.ef-editor {
  border: 1px solid #1e1e1e;
  background: #0c0c0c;
  font-family: 'Source Sans 3', sans-serif;
  display: flex;
  flex-direction: column;
  height: 500px;
  overflow: hidden;
}

.ef-editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: #111;
  border-bottom: 1px solid #1a1a1a;
}

.ef-editor-title { display: flex; align-items: center; gap: 10px; }
.ef-editor-icon { color: var(--ef-yellow); display: flex; }
.ef-editor-label {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--ef-yellow);
}
.ef-editor-filename { font-family: 'Share Tech Mono', monospace; font-size: 11px; color: #555; }
.ef-editor-stats { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #444; display: flex; gap: 8px; }
.ef-sep { color: #2a2a2a; }

.ef-editor-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 12px;
  background: #0e0e0e;
  border-bottom: 1px solid #1a1a1a;
}

.ef-editor-tabs { display: flex; gap: 2px; }

.ef-tab {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  padding: 5px 14px;
  background: transparent;
  border: none;
  color: #555;
  cursor: pointer;
  transition: all 0.2s;
}

.ef-tab:hover { color: #888; }
.ef-tab--active { background: rgba(255,241,0,0.06); color: var(--ef-yellow); }

.ef-editor-actions { display: flex; gap: 4px; }

.ef-btn {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 5px 12px;
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #777;
  cursor: pointer;
  transition: all 0.2s;
}
.ef-btn:hover { border-color: var(--ef-yellow); color: var(--ef-yellow); }
.ef-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.ef-btn--danger:hover { border-color: #ff4060; color: #ff4060; }
.ef-btn--lock { margin-left: auto; }

.ef-btn-sm {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 1.5px;
  padding: 4px 10px;
  background: transparent;
  border: 1px solid #2a2a2a;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
}
.ef-btn-sm:hover { border-color: var(--ef-yellow); color: var(--ef-yellow); }
.ef-btn-sm--danger:hover { border-color: #ff4060; color: #ff4060; }

/* 拖拽区 */
.ef-dropzone {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #222;
  margin: 8px;
  transition: all 0.3s;
}
.ef-dropzone--active { border-color: var(--ef-yellow); background: rgba(255,241,0,0.02); }
.ef-dropzone-inner { text-align: center; color: #333; }
.ef-dropzone--active .ef-dropzone-inner { color: var(--ef-yellow); }
.ef-dropzone-text {
  font-family: 'Inter', sans-serif;
  font-weight: 700;
  font-size: 13px;
  letter-spacing: 3px;
  color: #444;
  margin: 12px 0 6px;
}
.ef-dropzone--active .ef-dropzone-text { color: var(--ef-yellow); }
.ef-dropzone-hint { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #333; margin: 0 0 16px; }
.ef-dropzone-btn {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 2px;
  padding: 8px 20px;
  border: 1px solid #333;
  color: #777;
  cursor: pointer;
  display: inline-block;
  transition: all 0.2s;
}
.ef-dropzone-btn:hover { border-color: var(--ef-yellow); color: var(--ef-yellow); }

/* 编辑区 */
.ef-editor-body { flex: 1; overflow: hidden; }

.ef-textarea {
  width: 100%;
  height: 100%;
  background: #0c0c0c;
  color: #d4d4d4;
  border: none;
  outline: none;
  resize: none;
  padding: 16px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  line-height: 1.8;
  tab-size: 2;
}
.ef-textarea::placeholder { color: #333; }

.ef-preview { height: 100%; overflow-y: auto; padding: 16px; }

/* 状态栏 */
.ef-statusbar {
  display: flex;
  align-items: center;
  padding: 4px 12px;
  background: #111;
  border-top: 1px solid #1a1a1a;
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  color: #444;
  gap: 12px;
}
.ef-status-item { display: flex; align-items: center; gap: 6px; }
.ef-dot { width: 5px; height: 5px; background: #00ffa2; box-shadow: 0 0 6px rgba(0,255,162,0.4); }
.ef-status-right { margin-left: auto; }
</style>
