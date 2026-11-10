import { invoke } from '@tauri-apps/api/core';

const KNOWN_PERMISSIONS = new Set([
  'ui:mount',
  'ui:style',
  'stores:read',
  'stores:write',
  'api:call',
  'network',
  'crypto',
  'tauri',
  'storage',
  'events',
  'media',
]);

const KNOWN_MOUNT_POINTS = new Set([
  'panel:tab',
  'panel:tab-content',
  'nav:top',
  'nav:item',
  'nav:bottom',
  'chat-list:header',
  'chat-item:leading',
  'chat-item:badge',
  'chat-item:trailing',
  'chat:header-leading',
  'chat:header-action',
  'chat:header-info',
  'chat:footer',
  'chat:background',
  'message:header',
  'message:footer',
  'message:decoration',
  'message:context-item',
  'input:action',
  'input:action-left',
  'input:action-right',
  'input:toolbar',
  'input:toolbar-action',
  'input:context-item',
  'sticker-panel:tab',
  'sticker-panel:tab-content',
  'call:action',
  'call:panel',
  'call:video-overlay',
  'settings:section',
  'settings:page',
  'sidebar:section',
  'notification:action',
  'global:style',
  'global:init',
  'global:overlay',
  'global:modal',
]);

const ID_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/;
const MAX_FILE_BYTES = 131072;

export class PluginLoadError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export async function validateManifest(manifest, files) {
  const fileSizes = Object.fromEntries(
    [...files.entries()].map(([path, content]) => [
      path,
      new TextEncoder().encode(String(content)).byteLength,
    ])
  );

  try {
    await invoke('validate_plugin_manifest', {
      manifest,
      fileSizes,
    });
    return true;
  } catch (error) {
    const message = String(error ?? 'Plugin manifest validation failed');
    const separator = message.indexOf('|');
    const code = separator >= 0 ? message.slice(0, separator) : 'INVALID_MANIFEST';
    const detail = separator >= 0 ? message.slice(separator + 1) : message;
    throw new PluginLoadError(code, detail);
  }
}

export const PERMISSION_LABELS = {
  'ui:mount': 'Добавление элементов в интерфейс',
  'ui:style': 'Изменение стилей и оформления',
  'stores:read': 'Чтение сообщений, чатов и профиля',
  'stores:write': 'Изменение состояния приложения',
  'api:call': 'Выполнение запросов к API мессенджера',
  'network': 'Внешние сетевые запросы',
  'crypto': 'Пользовательские алгоритмы шифрования',
  'tauri': 'Доступ к системным функциям устройства',
  'storage': 'Локальное сохранение данных на устройстве',
  'events': 'Отслеживание событий (сообщения, чаты)',
  'media': 'Обработка видео и аудио потоков',
};

export const CATEGORY_LABELS = {
  'function': 'Функция',
  'style': 'Стиль',
  'integration': 'Интеграция',
  'crypto': 'Шифрование',
};

