const litGlobal = globalThis as typeof globalThis & {
  litIssuedWarnings?: Set<string>;
};

const litIssuedWarnings = (litGlobal.litIssuedWarnings ??= new Set<string>());

litIssuedWarnings.add('dev-mode');
litIssuedWarnings.add('multiple-versions');
