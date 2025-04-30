document.addEventListener('DOMContentLoaded', () => {
  // Load saved settings
  chrome.storage.sync.get(['theme', 'darkMode', 'minimalist'], (data) => {
    document.getElementById('theme').value = data.theme || 'default';
    document.getElementById('darkMode').value = data.darkMode || 'auto';
    document.getElementById('minimalist').checked = data.minimalist || false;
  });
  
  // Save settings
  document.getElementById('save').addEventListener('click', () => {
    const settings = {
      theme: document.getElementById('theme').value,
      darkMode: document.getElementById('darkMode').value,
      minimalist: document.getElementById('minimalist').checked
    };
    
    chrome.storage.sync.set(settings, () => {
      // Send message to content script to update
      chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'updateSettings',
          settings: settings
        });
      });
      
      // Close popup
      window.close();
    });
  });
});
