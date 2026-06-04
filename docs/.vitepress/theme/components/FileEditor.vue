<script setup>
import { ref, computed, nextTick } from 'vue'
import { useI18n } from '../composables/useI18n.js'

// 密码保护 — 使用 hash 校验，密码不以明文存储在源码中
const isAuthed = ref(false)
const passwordInput = ref('')
const passwordError = ref('')
const STORAGE_KEY = 'ef_editor_auth'
const showHelp = ref(false)
const { t, T } = useI18n()

async function hashPassword(str) {
  const buf = new TextEncoder().encode(str)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
}

async function checkPassword() {
  const h = await hashPassword(passwordInput.value)
// Client-side password authentication disabled; use server-side authentication.
  if (false) {
    isAuthed.value = true
    passwordError.value = ''
    localStorage.setItem(STORAGE_KEY, '1')
  } else {
    passwordError.value = T.value.editor.lock.error
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
const snippetCopied = ref(false)
const textareaRef = ref(null)

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
  reader.onerror = () => {
    fileName.value = ''
    alert('FILE READ ERROR')
  }
  reader.readAsText(file)
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderPreview() {
  let md = fileContent.value
  // 1. 提取代码块，防止内部被处理
  const codeBlocks = []
  md = md.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    codeBlocks.push(`<pre><code class="language-${lang}">${escapeHtml(code)}</code></pre>`)
    return `\x00CB${codeBlocks.length - 1}\x00`
  })
  // 2. 提取行内代码
  const inlineCodes = []
  md = md.replace(/`([^`]+)`/g, (_, code) => {
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`)
    return `\x00IC${inlineCodes.length - 1}\x00`
  })
  // 3. HTML 转义剩余内容
  md = escapeHtml(md)
  // 4. 处理标题
  md = md.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  md = md.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  md = md.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  // 5. 处理粗体和斜体
  md = md.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  md = md.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // 6. 处理列表
  md = md.replace(/^- (.+)$/gm, '<li>$1</li>')
  // 7. 段落
  md = md.replace(/\n\n/g, '</p><p>')
  md = '<p>' + md + '</p>'
  // 8. 还原代码块和行内代码
  md = md.replace(/\x00CB(\d+)\x00/g, (_, i) => codeBlocks[i])
  md = md.replace(/\x00IC(\d+)\x00/g, (_, i) => inlineCodes[i])
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

function newBlog() {
  const today = new Date().toISOString().slice(0, 10)
  fileContent.value = `---
title: "文章标题"
date: ${today}
description: "文章简介"
tags: ["TAG"]
---

# 文章标题

在这里开始写作...
`
  fileName.value = 'new-post.md'
  fileLoaded.value = true
  updateStats()
}

function generateSnippet() {
  const name = fileName.value.replace(/\.md$/, '')
  const title = fileContent.value.match(/^title:\s*"?([^"\n]+)"?/m)?.[1] || name
  const date = fileContent.value.match(/^date:\s*(\S+)/m)?.[1] || new Date().toISOString().slice(0, 10)
  const tags = fileContent.value.match(/^tags:\s*\[(.+?)\]/m)?.[1] || '"TAG"'
  const tag = tags.replace(/["\s]/g, '').split(',')[0]

  fetch('/blog-list.json')
    .then(r => r.json())
    .catch(() => [])
    .then(list => {
      if (!Array.isArray(list)) list = []
      const num = String(list.length + 1).padStart(2, '0')
      const entry = `  {
    "num": "${num}",
    "id": "TX-${num}",
    "title": "${title}",
    "date": "${date}",
    "tag": "${tag}",
    "link": "/blog/${name}"
  }`
      navigator.clipboard.writeText(entry)
      snippetCopied.value = true
      setTimeout(() => snippetCopied.value = false, 2000)
    })
}

function downloadBlogList() {
  const name = fileName.value.replace(/\.md$/, '')
  const title = fileContent.value.match(/^title:\s*"?([^"\n]+)"?/m)?.[1] || name
  const date = fileContent.value.match(/^date:\s*(\S+)/m)?.[1] || new Date().toISOString().slice(0, 10)
  const tags = fileContent.value.match(/^tags:\s*\[(.+?)\]/m)?.[1] || '"TAG"'
  const tag = tags.replace(/["\s]/g, '').split(',')[0]

  fetch('/blog-list.json')
    .then(r => r.json())
    .catch(() => [])
    .then(list => {
      if (!Array.isArray(list)) list = []
      const exists = list.some(p => p.link === `/blog/${name}`)
      if (!exists) {
        const num = String(list.length + 1).padStart(2, '0')
        list.push({
          num,
          id: `TX-${num}`,
          title,
          date,
          tag,
          link: `/blog/${name}`
        })
      }
      const blob = new Blob([JSON.stringify(list, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'blog-list.json'
      a.click()
      URL.revokeObjectURL(url)
    })
}

function clearEditor() {
  fileContent.value = ''
  fileName.value = ''
  fileLoaded.value = false
  previewHtml.value = ''
}

// ══ 图片粘贴/拖拽 ════════════════════════════════════════════════
function insertImageAtCursor(dataUrl, name) {
  const ta = textareaRef.value
  const md = `\n![${name}](${dataUrl})\n`
  if (ta) {
    const start = ta.selectionStart
    const end = ta.selectionEnd
    fileContent.value = fileContent.value.slice(0, start) + md + fileContent.value.slice(end)
    nextTick(() => {
      ta.selectionStart = ta.selectionEnd = start + md.length
      ta.focus()
    })
  } else {
    fileContent.value += md
  }
  updateStats()
}

function handlePaste(e) {
  const items = e.clipboardData?.items
  if (!items) return
  for (const item of items) {
    if (item.type.startsWith('image/')) {
      e.preventDefault()
      const file = item.getAsFile()
      const reader = new FileReader()
      reader.onload = (ev) => insertImageAtCursor(ev.target.result, file.name || 'image')
      reader.readAsDataURL(file)
      return
    }
  }
}

function handleImageDrop(e) {
  const files = e.dataTransfer?.files
  if (!files) return
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      e.preventDefault()
      const reader = new FileReader()
      reader.onload = (ev) => insertImageAtCursor(ev.target.result, file.name)
      reader.readAsDataURL(file)
    }
  }
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
      <p class="ef-lock-title">{{ T.editor.lock.title }}</p>
      <p class="ef-lock-sub">{{ T.editor.lock.subtitle }}</p>
      <div class="ef-lock-input-row">
        <input
          v-model="passwordInput"
          type="password"
          class="ef-lock-input"
          :placeholder="T.editor.lock.placeholder"
          @keyup.enter="checkPassword"
        />
        <button class="ef-lock-btn" @click="checkPassword">{{ T.editor.lock.enter }}</button>
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
        <span class="ef-editor-label">{{ T.editor.btn.terminal }}</span>
        <input v-if="fileLoaded" v-model="fileName" class="ef-editor-filename-input" spellcheck="false" />
      </div>
      <div class="ef-editor-stats">
        <span>{{ lineCount }} lines</span>
        <span class="ef-sep">|</span>
        <span>{{ charCount }} chars</span>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="ef-editor-toolbar">
      <div class="ef-toolbar-row">
        <div class="ef-editor-tabs">
          <button :class="['ef-tab', { 'ef-tab--active': activeTab === 'edit' }]" @click="switchTab('edit')">{{ T.editor.btn.edit }}</button>
          <button :class="['ef-tab', { 'ef-tab--active': activeTab === 'preview' }]" @click="switchTab('preview')">{{ T.editor.btn.preview }}</button>
        </div>
      </div>
      <div class="ef-toolbar-row">
        <div class="ef-editor-actions">
          <button class="ef-btn" @click="newFile">{{ T.editor.btn.new }}</button>
          <button class="ef-btn ef-btn--blog" @click="newBlog">{{ T.editor.btn.blog }}</button>
          <label class="ef-btn">
            {{ T.editor.btn.upload }}
            <input type="file" accept=".md,.txt,.c,.h,.py,.js,.css,.html,.json" @change="handleFileSelect" hidden />
          </label>
          <span class="ef-toolbar-sep"></span>
          <button class="ef-btn" @click="downloadFile" :disabled="!fileLoaded">{{ T.editor.btn.export }}</button>
          <button v-if="fileLoaded" class="ef-btn" @click="generateSnippet">
            {{ snippetCopied ? T.editor.btn.copied : T.editor.btn.copyEntry }}
          </button>
          <button v-if="fileLoaded && fileName.endsWith('.md')" class="ef-btn ef-btn--blog" @click="downloadBlogList">{{ T.editor.btn.list }}</button>
        </div>
        <div class="ef-editor-actions">
          <button class="ef-btn ef-btn--help" @click="showHelp = true">{{ T.editor.btn.help }}</button>
          <button v-if="fileLoaded" class="ef-btn ef-btn--danger" @click="clearEditor">{{ T.editor.btn.clear }}</button>
          <button class="ef-btn ef-btn--lock" @click="lockEditor">{{ T.editor.btn.lock }}</button>
        </div>
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
        <p class="ef-dropzone-text">{{ T.editor.btn.dropFile }}</p>
        <p class="ef-dropzone-hint">.md .txt .c .h .py .js .css .json</p>
        <label class="ef-dropzone-btn">
          {{ T.editor.btn.browse }}
          <input type="file" accept=".md,.txt,.c,.h,.py,.js,.css,.html,.json" @change="handleFileSelect" hidden />
        </label>
      </div>
    </div>

    <div v-else class="ef-editor-body">
      <textarea v-if="activeTab === 'edit'" ref="textareaRef" v-model="fileContent"
        @input="handleInput" @paste="handlePaste" @drop.prevent="handleImageDrop" @dragover.prevent
        class="ef-textarea" spellcheck="false" placeholder="Start typing... (paste or drop images)"></textarea>
      <div v-else class="ef-preview vp-doc" v-html="previewHtml"></div>
    </div>

    <!-- 状态栏 -->
    <div class="ef-statusbar">
      <span class="ef-status-item"><span class="ef-dot"></span> {{ fileLoaded ? T.editor.btn.loaded : T.editor.btn.ready }}</span>
      <span class="ef-status-item" v-if="fileName">{{ T.editor.btn.file }} {{ fileName }}</span>
      <span class="ef-status-right">UTF-8 | MARKDOWN</span>
    </div>
  </div>

  <!-- ══ 帮助弹窗 ═══════════════════════════════════════ -->
  <Teleport to="body">
    <div v-if="showHelp" class="ef-help-overlay" @click.self="showHelp = false">
      <div class="ef-help-box">
        <p class="ef-help-title">{{ T.editor.help.title }}</p>
        <div class="ef-help-content">
          <div class="ef-help-section">
            <p class="ef-help-section-title">{{ T.editor.help.fileEditingTitle }}</p>
            <div class="ef-help-step">
              <span class="ef-help-num">01</span>
              <div>
                <p class="ef-help-step-title">{{ T.editor.help.step1Title }}</p>
                <p class="ef-help-step-desc">{{ T.editor.help.step1Desc }}</p>
              </div>
            </div>
            <div class="ef-help-step">
              <span class="ef-help-num">02</span>
              <div>
                <p class="ef-help-step-title">{{ T.editor.help.step2Title }}</p>
                <p class="ef-help-step-desc">{{ T.editor.help.step2Desc }}</p>
              </div>
            </div>
            <div class="ef-help-step">
              <span class="ef-help-num">03</span>
              <div>
                <p class="ef-help-step-title">{{ T.editor.help.step3Title }}</p>
                <p class="ef-help-step-desc">{{ T.editor.help.step3Desc }}</p>
              </div>
            </div>
          </div>
          <div class="ef-help-divider"></div>
          <div class="ef-help-section">
            <p class="ef-help-section-title">{{ T.editor.help.blogTitle }}</p>
            <div class="ef-help-step">
              <span class="ef-help-num">01</span>
              <div>
                <p class="ef-help-step-title">{{ T.editor.help.blogStep1Title }}</p>
                <p class="ef-help-step-desc">{{ T.editor.help.blogStep1Desc }}</p>
              </div>
            </div>
            <div class="ef-help-step">
              <span class="ef-help-num">02</span>
              <div>
                <p class="ef-help-step-title">{{ T.editor.help.blogStep2Title }}</p>
                <p class="ef-help-step-desc">{{ T.editor.help.blogStep2Desc }}</p>
              </div>
            </div>
            <div class="ef-help-step">
              <span class="ef-help-num">03</span>
              <div>
                <p class="ef-help-step-title">{{ T.editor.help.blogStep3Title }}</p>
                <p class="ef-help-step-desc">{{ T.editor.help.blogStep3Desc }}</p>
              </div>
            </div>
            <div class="ef-help-step">
              <span class="ef-help-num">04</span>
              <div>
                <p class="ef-help-step-title">{{ T.editor.help.blogStep4Title }}</p>
                <p class="ef-help-step-desc">{{ T.editor.help.blogStep4Desc }}</p>
              </div>
            </div>
            <div class="ef-help-step">
              <span class="ef-help-num">05</span>
              <div>
                <p class="ef-help-step-title">{{ T.editor.help.blogStep5Title }}</p>
                <p class="ef-help-step-desc">{{ T.editor.help.blogStep5Desc }}</p>
              </div>
            </div>
          </div>
        </div>
        <button class="ef-help-close" @click="showHelp = false">{{ T.editor.help.close }}</button>
      </div>
    </div>
  </Teleport>
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
  height: 560px;
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
.ef-editor-filename-input {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: #888;
  background: transparent;
  border: 1px solid transparent;
  padding: 1px 4px;
  outline: none;
  width: 160px;
  transition: border-color 0.2s;
}
.ef-editor-filename-input:focus { border-color: #2a2a2a; }
.ef-editor-stats { font-family: 'Share Tech Mono', monospace; font-size: 10px; color: #444; display: flex; gap: 8px; }
.ef-sep { color: #2a2a2a; }

.ef-editor-toolbar {
  display: flex;
  flex-direction: column;
  padding: 4px 12px;
  background: #0e0e0e;
  border-bottom: 1px solid #1a1a1a;
  gap: 4px;
}
.ef-toolbar-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.ef-toolbar-sep {
  width: 1px;
  height: 14px;
  background: #2a2a2a;
  margin: 0 4px;
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
.ef-btn--blog { border-color: rgba(0,255,162,0.3); color: rgba(0,255,162,0.7); }
.ef-btn--blog:hover { border-color: #00ffa2; color: #00ffa2; }
.ef-btn--danger:hover { border-color: #ff4060; color: #ff4060; }
.ef-btn--lock { margin-left: auto; }
.ef-btn--help { border-color: rgba(0,255,162,0.3); color: #00ffa2; }
.ef-btn--help:hover { border-color: #00ffa2; color: #00ffa2; background: rgba(0,255,162,0.06); }

/* ══ 帮助弹窗 ════════════════════════════════════════════ */
.ef-help-overlay {
  position: fixed; inset: 0; z-index: 9998;
  background: rgba(0,0,0,0.8); display: flex; align-items: center; justify-content: center;
}
.ef-help-box {
  background: #161616; border: 1px solid #333; padding: 32px; max-width: 460px; width: 90vw;
  max-height: 80vh; overflow-y: auto;
}
.ef-help-title {
  font-family: 'Inter', sans-serif; font-weight: 800; font-size: 12px;
  letter-spacing: 4px; color: var(--ef-yellow); margin: 0 0 20px;
}
.ef-help-content { display: flex; flex-direction: column; gap: 0; }
.ef-help-section { margin-bottom: 8px; }
.ef-help-section-title {
  font-family: 'Source Sans 3', sans-serif; font-size: 11px; font-weight: 700;
  letter-spacing: 2px; color: #aaa; text-transform: uppercase; margin: 0 0 12px;
}
.ef-help-divider { height: 1px; background: #333; margin: 8px 0 16px; }
.ef-help-step { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 10px; }
.ef-help-num {
  font-family: 'Inter', sans-serif; font-weight: 900; font-size: 16px;
  color: rgba(255,241,0,0.35); min-width: 26px; line-height: 1;
}
.ef-help-step-title {
  font-family: 'Source Sans 3', sans-serif; font-size: 12px; font-weight: 700;
  color: #e0e0e0; margin: 0 0 1px;
}
.ef-help-step-desc {
  font-size: 11px; color: #999; margin: 0; line-height: 1.4;
}
.ef-help-close {
  margin-top: 20px; width: 100%; padding: 10px;
  background: rgba(255,241,0,0.06); border: 1px solid rgba(255,241,0,0.2); color: var(--ef-yellow);
  font-family: 'Inter', sans-serif; font-weight: 700; font-size: 11px;
  letter-spacing: 3px; cursor: pointer; transition: all 0.2s;
}
.ef-help-close:hover { background: rgba(255,241,0,0.12); border-color: var(--ef-yellow); }

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
