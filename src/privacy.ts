/** One output boundary, used after serialization for every CLI-owned sink. */
export class OutputGuard {
  private readonly fragments = new Set<string>();
  private readonly shortValues = new Set<string>();

  protect(value: string): void {
    if (!value) return;
    if (value.length < 5) this.shortValues.add(value);
    for (let index = 0; index <= value.length - 5; index++) {
      this.fragments.add(value.slice(index, index + 5));
    }
  }

  private positions(text: string): Uint8Array {
    const hidden = new Uint8Array(text.length);
    for (let index = 0; index < text.length; index++) {
      if (this.fragments.has(text.slice(index, index + 5))) hidden.fill(1, index, index + 5);
      for (const value of this.shortValues) {
        if (text.startsWith(value, index)) hidden.fill(1, index, index + value.length);
      }
    }
    return hidden;
  }

  scrub(text: string): string {
    // Remove terminal controls and bidi overrides from metadata. Then redact the
    // union of matching windows, without exposing even a four-character suffix.
    let result = text.replace(/[\x00-\x08\x0b-\x1f\x7f-\x9f\u202a-\u202e\u2066-\u2069]/g, '');
    for (;;) {
      const hidden = this.positions(result);
      if (!hidden.includes(1)) return result;
      // A single block cannot contain a five-character slice. If it is itself
      // a short secret, deletion still converges. Recheck newly joined text.
      const marker = [...this.shortValues].some(value => '█'.includes(value)) ? '' : '█';
      let next = '';
      for (let index = 0; index < result.length; index++) {
        if (!hidden[index]) next += result[index];
        else if (index === 0 || !hidden[index - 1]) next += marker;
      }
      if (next === result) return '';
      result = next;
    }
  }

  json(serialized: string): string {
    const safe = this.scrub(serialized);
    try { JSON.parse(safe); return safe; } catch {
      // Adversarial credentials can overlap JSON punctuation. Never emit broken
      // JSON or relax redaction. An empty object is the fail-closed result.
      return this.scrub('{}') === '{}' ? '{}' : '';
    }
  }
}
