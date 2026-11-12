import './style.css';

const app = document.querySelector('#app');
let coins = Number(localStorage.getItem('pm_coins') || 120);
let spins = Number(localStorage.getItem('pm_spins') || 1);
let history = JSON.parse(localStorage.getItem('pm_history') || '[]');
let busy = false;

const rewards = [
  { coins: 0, weight: 30, label: '0' },
  { coins: 1, weight: 40, label: '1' },
  { coins: 2, weight: 20, label: '2' },
  { coins: 5, weight: 9, label: '5' },
  { coins: 10, weight: 1, label: '10' }
];

const ucPackages = [
  { uc: 30, price: 400 },
  { uc: 60, price: 700 },
  { uc: 300, price: 3100 },
  { uc: 600, price: 5800 }
];

function save() {
  localStorage.setItem('pm_coins', String(coins));
  localStorage.setItem('pm_spins', String(spins));
  localStorage.setItem('pm_history', JSON.stringify(history));
}

function render() {
  app.innerHTML = `
    <div class="shell">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">P<span>★</span></div>
          <div><strong>PRIZE MASTER</strong><small>العب • اجمع • اكسب</small></div>
        </div>
        <button class="avatar" aria-label="الملف الشخصي">👤</button>
      </header>

      <main>
        <section class="welcome">
          <div>
            <span class="eyebrow">أهلاً بيك في عالم الجوائز</span>
            <h1>جاهز تكسب؟</h1>
            <p>جرّب حظك واجمع عملاتك كل يوم.</p>
          </div>
          <div class="spark">✦</div>
        </section>

        <section class="wallet-card">
          <div class="wallet-top"><span>رصيدك الحالي</span><span class="coin-icon">✦</span></div>
          <div class="balance"><strong id="balance">${coins}</strong><span>عملة</span></div>
          <div class="wallet-bottom"><span>استمر في اللعب لزيادة رصيدك</span><span class="wallet-gem">◆</span></div>
        </section>

        <section class="section-head">
          <div><span class="eyebrow">فرصتك مستنياك</span><h2>عجلة الحظ</h2></div>
          <span class="daily-pill">🎟 ${spins} محاولة</span>
        </section>

        <section class="wheel-card">
          <div class="wheel-wrap">
            <div class="pointer"></div>
            <div class="wheel" id="wheel">
              <div class="wheel-center">PM</div>
              <span class="wlabel l1">5</span><span class="wlabel l2">10</span>
              <span class="wlabel l3">25</span><span class="wlabel l4">50</span>
              <span class="wlabel l5">100</span>
            </div>
          </div>
          <p class="wheel-caption">لف العجلة واكتشف جائزتك!</p>
          <button class="spin-btn" id="spinBtn">🎡 لف العجلة</button>
          <p class="hint" id="hint">لديك محاولة مجانية تجريبية</p>
        </section>

        <section class="section-head tasks-head">
          <div><span class="eyebrow">اجمع المزيد</span><h2>طرق كسب العملات</h2></div>
        </section>
        <div class="task-list">
          <article class="task">
            <div class="task-icon purple">🎯</div>
            <div class="task-info"><strong>المهام اليومية</strong><small>مهام جديدة قريباً</small></div>
            <span class="coming">قريباً</span>
          </article>
          <article class="task">
            <div class="task-icon gold">🎁</div>
            <div class="task-info"><strong>مكافآت إضافية</strong><small>تابعنا لمعرفة الجديد</small></div>
            <span class="coming">قريباً</span>
          </article>
        </div>

        <section class="section-head shop-head">
          <div><span class="eyebrow">حوّل عملاتك لمكافآت</span><h2>استبدال الشدات</h2></div>
        </section>
        <div class="shop-list">
          ${ucPackages.map(pkg => `
            <article class="shop-item">
              <div class="uc-icon">UC</div>
              <div class="shop-info"><strong>${pkg.uc} شدة</strong><small>${pkg.price.toLocaleString('en-US')} كوين</small></div>
              <button class="redeem-btn" data-uc="${pkg.uc}" data-price="${pkg.price}">استبدال</button>
            </article>
          `).join('')}
        </div>
        <p class="manual-note">تسليم الشدات يدوي بعد مراجعة طلب الاستبدال.</p>

        <section class="history">
          <div class="section-head"><div><span class="eyebrow">آخر نشاطاتك</span><h2>سجل الجوائز</h2></div></div>
          <div id="historyList">${history.length ? history.slice(0,4).map(h => `<div class="history-row"><span>🏆 جائزة عجلة الحظ</span><b>+${h} عملة</b></div>`).join('') : '<div class="empty">لسه مفيش جوائز — جرّب العجلة!</div>'}</div>
        </section>
      </main>
      <nav class="bottom-nav">
        <button class="active"><span>⌂</span>الرئيسية</button>
        <button id="navWheel"><span>◉</span>العجلة</button>
        <button><span>▣</span>المهام</button>
        <button><span>♙</span>حسابي</button>
      </nav>
    </div>
    <div class="toast" id="toast"></div>
  `;

  document.querySelector('#spinBtn').addEventListener('click', spin);
  document.querySelector('#navWheel').addEventListener('click', () => document.querySelector('.wheel-card').scrollIntoView({behavior:'smooth'}));
  document.querySelectorAll('.redeem-btn').forEach(button => {
    button.addEventListener('click', () => requestRedemption(Number(button.dataset.uc), Number(button.dataset.price)));
  });
}

function requestRedemption(uc, price) {
  if (coins < price) {
    toast('رصيدك غير كافٍ لاستبدال هذه الباقة.');
    return;
  }
  toast('واجهة الطلب تجريبية حالياً؛ هنفعّل إرسال الطلبات بعد ربط Firebase.');
}

function chooseReward() {
  const total = rewards.reduce((sum, r) => sum + r.weight, 0);
  let roll = Math.random() * total;
  for (const reward of rewards) {
    roll -= reward.weight;
    if (roll < 0) return reward;
  }
  return rewards[0];
}

function toast(message) {
  const el = document.querySelector('#toast');
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2600);
}

function spin() {
  if (busy) return;
  if (spins <= 0) {
    toast('انتهت محاولتك التجريبية. ارجع لاحقاً!');
    return;
  }
  busy = true;
  spins -= 1;
  const button = document.querySelector('#spinBtn');
  const wheel = document.querySelector('#wheel');
  button.disabled = true;
  button.textContent = 'العجلة بتلف...';
  const reward = chooseReward();
  const rotations = 1800 + Math.floor(Math.random() * 900);
  wheel.style.transform = `rotate(${rotations}deg)`;
  setTimeout(() => {
    coins += reward.coins;
    history.unshift(reward.coins);
    save();
    busy = false;
    render();
    toast(reward.coins === 0 ? 'حظ أوفر المرة القادمة!' : `مبروك! كسبت ${reward.coins} كوين 🎉`);
  }, 4200);
}

render();
