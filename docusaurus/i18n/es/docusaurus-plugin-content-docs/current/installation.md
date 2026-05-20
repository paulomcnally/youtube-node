---
sidebar_position: 2
---

# Instalación

Esta guía te ayudará a instalar y configurar `youtube-node` en tu proyecto.

## Instalación con npm

```bash
npm install youtube-node
```

## Instalación con yarn

```bash
yarn add youtube-node
```

## Instalación con pnpm

```bash
pnpm add youtube-node
```

## Instalación Global (para CLI)

Si deseas usar la interfaz de línea de comandos (CLI):

```bash
npm install -g youtube-node
```

## Verificar Instalación

```typescript
import YouTube from 'youtube-node';

const youtube = new YouTube();
console.log('youtube-node instalado correctamente ✅');
```

## Dependencias

La librería incluye automáticamente estas dependencias:

- `axios` - Cliente HTTP
- `@colors/colors` - Colores para la CLI
- `prompt` - Interacción en la CLI

## TypeScript

Si usas TypeScript, los tipos están incluidos automáticamente. No necesitas instalar `@types/youtube-node`.

```typescript
import YouTube from 'youtube-node';  // Tipado completo incluido ✅
```

## Próximos Pasos

- [Configurar tu API Key](./authentication.md)
- [Guía Rápida](./quickstart.md)
