import { emitKeypressEvents } from 'node:readline';
import { TOKEN_GUIDANCE } from './constants.js';

/** No echo, asterisks, readline history, pasted values or token-length display. */
export async function hiddenToken(): Promise<string> {
  const input = process.stdin;
  if (!input.isTTY || !process.stderr.isTTY) throw new Error('token');
  process.stderr.write(`${TOKEN_GUIDANCE}\nRailway API token (hidden): `);
  emitKeypressEvents(input);
  const wasRaw = input.isRaw;
  input.setRawMode(true);
  input.resume();
  return new Promise((resolve, reject) => {
    let value = '';
    const restore = () => {
      input.off('keypress', onKey);
      input.off('end', onEnd);
      input.setRawMode(wasRaw);
      input.pause();
      process.stderr.write('\n');
    };
    const onEnd = () => { restore(); reject(new Error('token')); };
    const onKey = (text: string | undefined, key: { name?: string; ctrl?: boolean }) => {
      if ((key.ctrl && ['c', 'd'].includes(key.name ?? '')) || key.name === 'escape') { onEnd(); return; }
      if (key.name === 'return' || key.name === 'enter') { restore(); resolve(value.trim()); return; }
      if (key.name === 'backspace') value = [...value].slice(0, -1).join('');
      else if (text && !key.ctrl && !text.startsWith('\x1b')) value += text.replace(/[\x00-\x1f\x7f]/g, '');
    };
    input.on('keypress', onKey);
    input.on('end', onEnd);
  });
}
