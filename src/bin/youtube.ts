#!/usr/bin/env node

import cli from '../lib/cli';

const command = process.argv[2] || null;
const commands = ['id', 'search', 'related', 'channelId'];

/**
 * Error
 * command is null
 */
if (!command) {
  cli.error(0);
  process.exit(0);
}

/**
 * Error
 * command don't exist in applications
 */
if (!commands.includes(command)) {
  cli.error(1);
  process.exit(1);
}

// Mapeo de comandos a métodos
const commandMap: Record<string, () => void> = {
  id: cli.id,
  search: cli.search,
  related: cli.related,
  channelId: cli.channelId,
};

commandMap[command]();
