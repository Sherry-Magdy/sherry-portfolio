(function(){
  var el = document.getElementById('typeline');
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var full = "> init --profile sherry_magdy";
  if(prefersReduced){
    el.innerHTML = full + '<span class="cursor"></span>';
    return;
  }
  el.innerHTML = '<span class="cursor"></span>';
  var i = 0;
  function type(){
    if(i <= full.length){
      el.innerHTML = full.slice(0,i) + '<span class="cursor"></span>';
      i++;
      setTimeout(type, 28);
    }
  }
  type();
})();

// Rail active-state via IntersectionObserver
(function(){
  var sections = document.querySelectorAll('main section');
  var nodes = document.querySelectorAll('.rail-node');
  if(!sections.length || !nodes.length) return;
  var map = {};
  nodes.forEach(function(n){ map[n.dataset.target] = n; });

  var observer = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var id = entry.target.id;
      if(entry.isIntersecting){
        nodes.forEach(function(n){ n.classList.remove('active'); });
        if(map[id]) map[id].classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });

  sections.forEach(function(s){ observer.observe(s); });
})();

// Scroll reveal motion
(function(){
  var items = document.querySelectorAll('.reveal');
  if(!items.length) return;
  var revealObserver = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  items.forEach(function(el){ revealObserver.observe(el); });
})();

// ---------- Chatbot ----------
(function(){
  var toggleBtn = document.getElementById('chatbot-toggle');
  var box = document.getElementById('chatbot-box');
  var messages = document.getElementById('chatbot-messages');
  var input = document.getElementById('chatbot-input');
  var sendBtn = document.getElementById('chatbot-send');

  if(!toggleBtn || !box || !messages || !input || !sendBtn) return;

  toggleBtn.addEventListener('click', function(){
    box.classList.toggle('hidden');
  });

  function addMessage(text, sender){
    var div = document.createElement('div');
    div.className = 'msg ' + sender;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  async function sendMessage(){
    var text = input.value.trim();
    if(!text) return;
    addMessage(text, 'user');
    input.value = '';
    addMessage('...', 'bot-loading');

    try {
      var res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      var data = await res.json();
      var loadingEl = document.querySelector('.bot-loading');
      if(loadingEl) loadingEl.remove();
      addMessage(data.reply || "Sorry, I couldn't get a response.", 'bot');
    } catch (e) {
      var loadingEl2 = document.querySelector('.bot-loading');
      if(loadingEl2) loadingEl2.remove();
      addMessage("Sorry, something went wrong.", 'bot');
    }
  }

  sendBtn.addEventListener('click', sendMessage);
  input.addEventListener('keydown', function(e){
    if(e.key === 'Enter') sendMessage();
  });
})();
