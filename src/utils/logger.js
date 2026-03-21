const formatTimestamp = () => new Date().toISOString();

const formatMeta = (meta) => {
  if (!meta || !Object.keys(meta).length) return '';
  return ' | ' + Object.entries(meta)
    .map(([k, v]) => `${k}: ${typeof v === 'object' ? JSON.stringify(v) : v}`)
    .join(' | ');
};

const createLogger = (module) => {
  const prefix = `[${module}]`;

  return {
    info: (message, meta = {}) => {
      console.log(`${formatTimestamp()} INFO  ${prefix} ${message}${formatMeta(meta)}`);
    },
    warn: (message, meta = {}) => {
      console.warn(`${formatTimestamp()} WARN  ${prefix} ${message}${formatMeta(meta)}`);
    },
    error: (message, meta = {}) => {
      console.error(`${formatTimestamp()} ERROR ${prefix} ${message}${formatMeta(meta)}`);
    },
    debug: (message, meta = {}) => {
      if (process.env.NODE_ENV !== 'production') {
        console.log(`${formatTimestamp()} DEBUG ${prefix} ${message}${formatMeta(meta)}`);
      }
    },
  };
};

module.exports = createLogger;
