export function download(data, name) {
  if (!global.document) return;

  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], {type: "application/json"});
  const a = global.document.createElement('a');
  const url = global.URL.createObjectURL(blob);
  a.href = url;
  a.download = name;
  a.click();
  global.URL.revokeObjectURL(url);
}
