document.getElementById('generate-fsm').addEventListener('click', async () => {
    const prompt = document.getElementById('fsm-prompt').value;
    const response = await fetch('/api/generate-fsm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt })
    });
    const fsmData = await response.json();
    window.fsmData = fsmData;
    visualizeFSM(fsmData);
  });
  
  function visualizeFSM(fsmData) {
    const mermaidDefinition = generateMermaidDefinition(fsmData);
    document.getElementById('fsm-visualization').innerHTML = `<div class="mermaid">${mermaidDefinition}</div>`;
    mermaid.init();
  }
  
  function generateMermaidDefinition(fsmData) {
    const states = fsmData.states.map(state => `state ${state}`).join('\n');
    const transitions = fsmData.transitions.map(transition => `${transition.from} --> ${transition.to} : ${transition.input}`).join('\n');
    return `stateDiagram-v2\n${states}\n${transitions}`;
  }
  
  document.getElementById('export-json').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(window.fsmData));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "fsm.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  });

document.getElementById('copy-data').addEventListener('click', () => {
  const fsmDataStr = JSON.stringify(window.fsmData, null, 2);
  navigator.clipboard.writeText(fsmDataStr).then(() => {
  }).catch(err => {
    alert('Failed to copy FSM data: ', err);
  });
});