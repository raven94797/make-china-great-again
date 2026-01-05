// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  // 获取DOM元素
  const navContainer = document.getElementById('navContainer');
  const sideNav = document.getElementById('sideNav');
  const navContent = document.getElementById('navContent');
  const toggleNavBtn = document.getElementById('toggleNavBtn');
  const toggleIcon = document.getElementById('toggleIcon');
  const progressRing = document.getElementById('progressRing');
  const body = document.body;
  
  // 获取页面所有一级标题(h1)和二级标题(h2)
  const h1Elements = document.querySelectorAll('h1');
  const h2Elements = document.querySelectorAll('h2');
  
  // 计算圆环的周长用于进度计算
  const radius = 25;
  const circumference = radius * 2 * Math.PI;
  progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
  progressRing.style.strokeDashoffset = circumference;
  
  // 为每个一级标题创建导航项及对应的二级导航
  h1Elements.forEach(function(h1, index) {
    // 如果标题没有id，则为其添加一个唯一id
    if (!h1.id) {
      h1.id = 'section' + (index + 1);
    }
    
    // 创建一级导航项容器
    const navItemContainer = document.createElement('div');
    navItemContainer.className = 'nav-item-container';
    
    // 创建一级导航项
    const navItem = document.createElement('div');
    navItem.className = 'nav-item level-1';
    navItem.setAttribute('data-target', h1.id);
    
    // 分离标题文本和图标，确保箭头对齐
    const titleSpan = document.createElement('span');
    titleSpan.textContent = h1.textContent;
    
    const iconSpan = document.createElement('span');
    iconSpan.className = 'expand-icon';
    iconSpan.textContent = '▼';
    
    navItem.appendChild(titleSpan);
    navItem.appendChild(iconSpan);
    
    // 添加点击事件处理 - 三级交互逻辑
    let clickCount = 0;
    let clickTimer = null;
    navItem.addEventListener('click', function() {
      // 清除之前的定时器
      clearTimeout(clickTimer);
      
      // 增加点击计数
      clickCount++;
      
      // 如果是第一次点击，展开二级导航
      if (clickCount === 1) {
        const level2Container = this.nextElementSibling;
        if (level2Container && level2Container.classList.contains('nav-level-2')) {
          level2Container.classList.toggle('expanded');
          this.classList.toggle('expanded');
        }
      }
      // 如果是第二次点击，跳转到对应章节
      else if (clickCount === 2) {
        const targetId = this.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        
        window.scrollTo({
          top: targetElement.offsetTop - 20,
          behavior: 'smooth'
        });
      }
      // 如果是第三次点击，收起二级导航
      else if (clickCount === 3) {
        const level2Container = this.nextElementSibling;
        if (level2Container && level2Container.classList.contains('nav-level-2')) {
          level2Container.classList.remove('expanded');
          this.classList.remove('expanded');
        }
        clickCount = 0; // 重置点击计数
      }
      
      // 设置2秒的超时，重置点击计数
      clickTimer = setTimeout(function() {
        clickCount = 0;
      }, 2000);
    });
    
    // 创建二级导航容器
    const level2Container = document.createElement('div');
    level2Container.className = 'nav-level-2';
    
    // 查找当前一级标题下的所有二级标题
    const currentH2Elements = [];
    let nextElement = h1.nextElementSibling;
    while (nextElement && nextElement.tagName !== 'H1') {
      if (nextElement.tagName === 'H2') {
        currentH2Elements.push(nextElement);
      }
      nextElement = nextElement.nextElementSibling;
    }
    
    // 为每个二级标题创建导航项
    currentH2Elements.forEach(function(h2) {
      // 如果标题没有id，则为其添加一个唯一id
      if (!h2.id) {
        h2.id = h1.id + '-' + (currentH2Elements.indexOf(h2) + 1);
      }
      
      // 创建二级导航项
      const level2Item = document.createElement('a');
      level2Item.href = '#' + h2.id;
      level2Item.className = 'nav-item level-2';
      level2Item.textContent = h2.textContent;
      
      // 添加点击事件处理 - 平滑滚动
      level2Item.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        window.scrollTo({
          top: targetElement.offsetTop - 20,
          behavior: 'smooth'
        });
      });
      
      // 添加到二级导航容器
      level2Container.appendChild(level2Item);
    });
    
    // 添加到导航栏
    navItemContainer.appendChild(navItem);
    navItemContainer.appendChild(level2Container);
    navContent.appendChild(navItemContainer);
  });
  
  // 点击按钮切换导航栏展开/折叠状态，确保整体同步
  let isNavCollapsed = false;
  toggleNavBtn.addEventListener('click', function() {
    isNavCollapsed = !isNavCollapsed;
    
    if (isNavCollapsed) {
      // 收缩导航栏容器
      navContainer.classList.add('collapsed');
      body.classList.add('nav-collapsed');
      toggleIcon.textContent = '→';
      // 恢复圆环位置
      progressCircleWrapper.style.left = '20px';
      progressCircleWrapper.style.top = '50%';
      progressCircleWrapper.style.transform = 'translateY(-50%)';
    } else {
      // 展开导航栏容器
      navContainer.classList.remove('collapsed');
      body.classList.remove('nav-collapsed');
      toggleIcon.textContent = '☰';
      // 移动圆环到导航栏右下角
      progressCircleWrapper.style.left = '170px';
      progressCircleWrapper.style.top = 'calc(100vh - 80px)';
      progressCircleWrapper.style.transform = 'translateY(0)';
    }
  });
  
  // 计算并更新阅读进度圆环
  function updateReadingProgress() {
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;
    
    // 更新SVG圆环进度
    const offset = circumference - (progress / 100) * circumference;
    progressRing.style.strokeDashoffset = offset;
  }
  
  // 监听滚动事件，更新当前活动的导航项和阅读进度
  window.addEventListener('scroll', function() {
    // 使用requestAnimationFrame优化性能
    requestAnimationFrame(function() {
      updateReadingProgress();
      updateActiveNavItem();
    });
  });
  
  // 更新当前活动的导航项
  function updateActiveNavItem() {
    const scrollPosition = window.scrollY + 100;
    
    // 查找当前可见的章节
    let currentH1Id = '';
    let currentH2Id = '';
    
    // 检查所有h1
    h1Elements.forEach(function(h1) {
      const sectionTop = h1.offsetTop;
      const nextH1 = findNextElement(h1, 'H1');
      
      if (nextH1) {
        if (scrollPosition >= sectionTop && scrollPosition < nextH1.offsetTop) {
          currentH1Id = h1.id;
        }
      } else if (scrollPosition >= sectionTop) {
        // 如果是最后一个章节
        currentH1Id = h1.id;
      }
    });
    
    // 检查所有h2
    h2Elements.forEach(function(h2) {
      const sectionTop = h2.offsetTop;
      const nextH2 = findNextElement(h2, 'H2');
      const nextH1 = findNextElement(h2, 'H1');
      
      if (nextH1 && scrollPosition >= sectionTop && scrollPosition < nextH1.offsetTop) {
        currentH2Id = h2.id;
      } else if (nextH2 && scrollPosition >= sectionTop && scrollPosition < nextH2.offsetTop) {
        currentH2Id = h2.id;
      } else if (!nextH1 && !nextH2 && scrollPosition >= sectionTop) {
        // 如果是最后一个章节
        currentH2Id = h2.id;
      }
    });
    
    // 更新一级导航项的活动状态
    document.querySelectorAll('.nav-item.level-1').forEach(function(navItem) {
      if (navItem.getAttribute('data-target') === currentH1Id) {
        navItem.classList.add('active');
      } else {
        navItem.classList.remove('active');
      }
    });
    
    // 更新二级导航项的活动状态
    document.querySelectorAll('.nav-item.level-2').forEach(function(navItem) {
      if (navItem.getAttribute('href') === '#' + currentH2Id) {
        navItem.classList.add('active');
      } else {
        navItem.classList.remove('active');
      }
    });
  }
  
  // 查找下一个指定类型的元素
  function findNextElement(element, tagName) {
    let nextElement = element.nextElementSibling;
    while (nextElement) {
      if (nextElement.tagName === tagName) {
        return nextElement;
      }
      nextElement = nextElement.nextElementSibling;
    }
    return null;
  }
  
  // 初始化时触发一次滚动事件，设置初始活动状态
  window.dispatchEvent(new Event('scroll'));
  
  // 初始状态
  body.classList.add('nav-expanded');
});