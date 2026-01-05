// Roster数据
const roster = [
  {
    name: "zjm",
    description: "Tasks:\nInvestigation, Writing, Public Engagement\nSpecific tasks:\n(1)Investigation:Participated in wet-lab experiments, responsible for the construction of blue-light control system. (2) Writing:Handled formatting adjustments and standardization for the blue light control group’s wiki, unified the format of all notebooks, and wrote the safety module for the wiki. (3)Public Engagement:Took part in Academic Cultural Festival: IGEM Exhibition, as a member of the iGEM outreach team.",
    image: "zjm.jpg"
  },
  {
    name: "px",
    description: "Tasks:\nAnalysis, Conceptualization, Investigation, Data Curation, Notebook/record keeping, Project Administration, Public Engagement, Visualization, Writing, Safety\nSpecific tasks:\n(1)Project Administration: She was responsible for planning the team's wet-lab experiments,designing a project schedule to ensure all project deliverables are submitted on time and smoothly,making ppts for weekly group meetings, coordinating with other teams, and comunicated with team's instructors. (2)Conceptualization: She completed the task of constructing the plasmid for the red light controlled system in the project. (3)Writing: She constructed the writing framework for most sections in the experimental team's wiki, and wrote the indigo and red light-controlled system in the Results and Engineering Success sections, the green light-controlled and green pigment synthesis system in the Parts section, as well as the homologous recombination and indigo extraction parts in the Protocol section. (4)Investigation: She participated in wet-lab work, constructing both indigo synthesis plasmids, GFP-validation plasmids under red-light control and protein expression verification of 4,4'-dinitroindigo synthesis plasmid.She also assisted the hardware team in conducting experiments on cultivating E.coli BL21(DE3) able to produce indigo in hydrogels to produce indigo. (5)Data Curation: She was responsible for organizing experimental data, analyzing these data, and visualizing these data. (6)Public Engagement: She actively engaged in project presentations, delivering oral reports on experimental design at the 9th iGEM Southern China Regional Meeting, and exchanged insights with other teams.She also participated in 17th Migrant Children's Public Welfare Summer Camp by Zhuhai Collaborators,one of the inclusive activities for migrant children, and communicated with Daosheng Biotechnology. (7)Visualization:She prepared a series of indigo standard samples with different concentrations, tested their absorbance, fitted a graph showing the relationship between absorbance and the concentration of indigo samples, and visualized the data.She also gave some ideas about project promotion video. (8)Safety:She read the safety rules set by iGEM carefully to make sure the team's activities was safe and the safety form met the standardand.She wrote the team's preliminary safety form and final safety form. (9)Notebook/record keeping:She kept recording the timeline of indigo synthesis and contributed a part to the recording of red-light control verification.She also recorded the experiment of 4,4'-dinitroindigo synthesis. (10)Analysis:She analyzed indigo fermentation conditions and indigo extraction methods from papers and other iGEM team's protocol or notebook.",
    image: "px.jpg"
  }
];

// 人物展示组件脚本
document.addEventListener('DOMContentLoaded', function() {
  const rosterContainer = document.getElementById('roster');
  const template = document.getElementById('character-template');
  function escapeHTML(str) {
    return String(str).replace(/[&<>"']/g, function(s) {
      return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[s];
    });
  }

  function setupPaging(img, info, pagesContainer, moreBtn, backBtn, rawText) {
    const header = info.querySelector('h3');
    const paddingReserve = 40; // 大致预留空间（info 内边距等）

    const allowedHeight = Math.max(0, img.clientHeight - (header ? header.offsetHeight : 0) - paddingReserve);

    pagesContainer.innerHTML = '';

    // 创建临时测量元素
    const testDiv = document.createElement('div');
    testDiv.className = 'page';
    testDiv.style.position = 'absolute';
    testDiv.style.visibility = 'hidden';
    testDiv.style.left = '-9999px';
    testDiv.style.width = pagesContainer.clientWidth + 'px';
    pagesContainer.appendChild(testDiv);

    if (allowedHeight <= 0) {
      moreBtn.style.display = 'none';
      backBtn.style.display = 'none';
      pagesContainer.removeChild(testDiv);
      return;
    }

    let remaining = rawText || '';
    const pages = [];
    const maxPages = 50;

    while (remaining.length > 0 && pages.length < maxPages) {
      let low = 0, high = remaining.length, fit = 0;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        testDiv.innerHTML = escapeHTML(remaining.slice(0, mid)).replace(/\n/g, '<br>');
        if (testDiv.scrollHeight <= allowedHeight) {
          fit = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      if (fit === 0) {
        // 无法放入任何字符时，取一段保证前进
        fit = Math.min(200, remaining.length);
      }

      pages.push(remaining.slice(0, fit));
      remaining = remaining.slice(fit).trim();
    }

    pagesContainer.removeChild(testDiv);

    // 创建页面 DOM
    pages.forEach((txt, idx) => {
      const d = document.createElement('div');
      d.className = 'page';
      d.innerHTML = escapeHTML(txt).replace(/\n/g, '<br>');
      d.style.display = idx === 0 ? 'block' : 'none';
      d.style.maxHeight = allowedHeight + 'px';
      d.style.overflow = 'hidden';
      pagesContainer.appendChild(d);
    });

    if (pages.length <= 1) {
      moreBtn.style.display = 'none';
      backBtn.style.display = 'none';
      return;
    }

    moreBtn.style.display = 'inline-block';
    backBtn.style.display = 'inline-block';

    let current = 0;
    const pageElems = pagesContainer.querySelectorAll('.page');

    function updateControls(idx) {
      const last = pageElems.length - 1;
      if (idx <= 0) {
        backBtn.disabled = true;
        backBtn.style.opacity = '0.5';
        backBtn.style.pointerEvents = 'none';
      } else {
        backBtn.disabled = false;
        backBtn.style.opacity = '';
        backBtn.style.pointerEvents = '';
      }

      if (idx >= last) {
        moreBtn.disabled = true;
        moreBtn.style.opacity = '0.5';
        moreBtn.style.pointerEvents = 'none';
      } else {
        moreBtn.disabled = false;
        moreBtn.style.opacity = '';
        moreBtn.style.pointerEvents = '';
      }
    }

    function show(i) {
      const n = pageElems.length;
      const idx = Math.max(0, Math.min(i, n - 1)); // 不循环，保持在 [0, n-1]
      pageElems.forEach((el, ii) => { el.style.display = ii === idx ? 'block' : 'none'; });
      current = idx;
      updateControls(idx);
    }

    moreBtn.onclick = function() { if (!moreBtn.disabled) show(current + 1); };
    backBtn.onclick = function() { if (!backBtn.disabled) show(current - 1); };

    // 初始控件状态
    updateControls(0);
  }

  function fillCharacterElement(el, data) {
    const img = el.querySelector('img');
    const info = el.querySelector('.info');
    const h3 = info.querySelector('h3');
    const pagesContainer = info.querySelector('.pages');
    const moreBtn = info.querySelector('.more-btn');
    const backBtn = info.querySelector('.back-btn');

    img.src = data.image || '';
    img.alt = data.name || '';
    h3.textContent = data.name || '';

    const raw = data.description || '';
    pagesContainer.innerHTML = '';
    moreBtn.style.display = 'none';
    backBtn.style.display = 'none';

    el.setAttribute('tabindex', '0');
    el.style.animationDelay = Math.random() * 0.5 + 's';

    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.classList.toggle('hovered');
      }
    });

    function trySetup() {
      try { setupPaging(img, info, pagesContainer, moreBtn, backBtn, raw); } catch (err) { console.warn(err); }
    }

    if (img.complete && img.naturalHeight !== 0) {
      setTimeout(trySetup, 60);
    } else {
      img.addEventListener('load', function() { setTimeout(trySetup, 60); });
    }
  }

  // 填充已有的 DOM 节点（页面上初始的两个）
  const existing = rosterContainer.querySelectorAll('.character');
  existing.forEach((el, idx) => {
    if (roster[idx]) {
      fillCharacterElement(el, roster[idx]);
    }
  });

  // 定义添加单个角色的函数（用于动态追加）
  function addCharacter(data) {
    const node = template.content.firstElementChild.cloneNode(true);
    fillCharacterElement(node, data);
    rosterContainer.appendChild(node);
    return node;
  }

  // 如果 roster 中有额外数据，动态克隆模板并追加
  for (let i = existing.length; i < roster.length; i++) {
    const data = roster[i];
    addCharacter(data);
  }

  // 对外暴露添加接口，便于后续动态添加图片
  window.addCharacter = addCharacter;

  // 添加页面加载动画
  const container = document.querySelector('.container');
  container.style.opacity = '0';
  container.style.transform = 'translateY(20px)';
  container.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

  setTimeout(() => {
    container.style.opacity = '1';
    container.style.transform = 'translateY(0)';
  }, 100);
});