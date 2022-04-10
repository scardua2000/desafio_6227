export function ConverteData(timestamp) {
  const date = new Date(timestamp);
  const data =
    date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear();
  return data;
}

export function ConvertTimestamp(data) {
  if (data == 0) {
    return null;
  } else {
    const timestamp = Date.parse(data);
    return timestamp;
  }
}
