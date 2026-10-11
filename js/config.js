
const CLIPDROP_CONFIG = {
  version: 'v1.0.0',

  repositoryUrl: 'https://github.com/andreluizdasilvaa/clipdrop',

  customWindowsUrl: null,

  downloads: {
    windows: {
      get version() {
        return CLIPDROP_CONFIG.version.startsWith('v') 
          ? CLIPDROP_CONFIG.version 
          : `v${CLIPDROP_CONFIG.version}`;
      },
      get fileName() {
        const cleanVer = CLIPDROP_CONFIG.version.replace(/^v/, '');
        return `ClipDrop.Setup.${cleanVer}.exe`;
      },
      get url() {
        if (CLIPDROP_CONFIG.customWindowsUrl) {
          return CLIPDROP_CONFIG.customWindowsUrl;
        }
        const tag = this.version;
        const file = this.fileName;
        return `${CLIPDROP_CONFIG.repositoryUrl}/releases/download/${tag}/${file}`;
      },
      active: true
    },

    linux: {
      version: 'v1.1.0',
      active: false
    },

    mac: {
      version: 'v1.1.0',
      active: false
    }
  }
};

if (typeof window !== 'undefined') {
  window.CLIPDROP_CONFIG = CLIPDROP_CONFIG;
}
